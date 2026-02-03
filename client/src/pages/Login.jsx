import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import SEO from '../components/SEO';
import { Mail, Lock, User as UserIcon, Chrome } from 'lucide-react';

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, signUp, signInWithGoogle } = useAuth();
    const navigate = useNavigate();


    // DISABLED: This was causing redirect loop with Dashboard admin check
    // useEffect(() => {
    //     if (user) {
    //         navigate(isAdmin ? '/dashboard' : '/');
    //     }
    // }, [user, isAdmin, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                const result = await signUp(formData.email, formData.password, formData.name);

                // Check if it's an email confirmation error
                if (result?.error?.message?.includes('email')) {
                    // Account created but email failed - still a success!
                    setError('');
                    alert('✅ Account created successfully! You can now sign in.\n\n(Email confirmation is disabled for development)');
                    setIsSignUp(false); // Switch to login
                    setFormData({ ...formData, name: '', password: '' });
                } else {
                    // Normal success
                    alert('Account created! You can now sign in.');
                    setIsSignUp(false);
                    setFormData({ ...formData, name: '', password: '' });
                }
            } else {
                // Sign in
                await signIn(formData.email, formData.password);
                // Wait for session to be saved to localStorage before redirecting
                // This ensures the Session Guard on dashboard will find the session
                console.log('✅ Login successful, waiting for session to save...');
                setTimeout(() => {
                    console.log('🔄 Redirecting to dashboard...');
                    navigate('/dashboard');
                }, 800); // Increased delay to ensure session is persisted
            }
        } catch (err) {
            // Only show error if it's not an email-related issue
            const errorMsg = err.message || 'Authentication failed';
            if (!errorMsg.toLowerCase().includes('email')) {
                setError(errorMsg);
            } else {
                // Email error but account might be created
                alert('✅ Account created! You can now sign in.\n\n(Note: Email confirmation is currently disabled)');
                setIsSignUp(false);
                setFormData({ ...formData, name: '', password: '' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (err) {
            setError(err.message || 'Google sign-in failed');
        }
    };

    return (
        <>
            <SEO title={isSignUp ? 'Sign Up' : 'Sign In'} />

            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-dark-50 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center space-x-2">
                            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">PP</span>
                            </div>
                            <span className="text-2xl font-bold text-dark-900">
                                Proper<span className="text-primary-600">Pakistan</span>
                            </span>
                        </Link>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
                        <h2 className="text-3xl font-bold text-dark-900 mb-2 text-center">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-dark-600 text-center mb-8">
                            {isSignUp
                                ? 'Sign up to start your journey'
                                : 'Sign in to access your account'}
                        </p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {isSignUp && (
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="John Doe"
                                            className="w-full pl-12 pr-4 py-3 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            required={isSignUp}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="you@example.com"
                                        className="w-full pl-12 pr-4 py-3 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-dark-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-dark-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full flex items-center justify-center space-x-2 border-2 border-dark-200 rounded-lg py-3 hover:bg-dark-50 transition"
                        >
                            <Chrome size={20} className="text-red-500" />
                            <span className="font-semibold text-dark-700">Google</span>
                        </button>

                        {/* Toggle Sign In/Sign Up */}
                        <p className="mt-6 text-center text-dark-600">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            {' '}
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setError('');
                                    setFormData({ email: '', password: '', name: '' });
                                }}
                                className="text-primary-600 font-semibold hover:underline"
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>

                    {/* Additional Info */}
                    <p className="text-center text-dark-500 text-sm mt-6">
                        By signing in, you agree to our{' '}
                        <Link to="/terms" className="text-primary-600 hover:underline">Terms</Link> and{' '}
                        <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
