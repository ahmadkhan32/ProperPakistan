import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('🚨 Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.reload();
                                }}
                                className="w-full btn bg-primary-600 text-white hover:bg-primary-700 py-2 px-4 rounded"
                            >
                                Clear Cache & Reload
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full btn bg-gray-200 text-gray-700 hover:bg-gray-300 py-2 px-4 rounded"
                            >
                                Just Reload
                            </button>
                        </div>
                        <details className="mt-6 text-left">
                            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                Technical Details
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                                {this.state.error?.stack}
                            </pre>
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
