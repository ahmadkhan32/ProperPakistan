import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './context/useAuth';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ReadingProgress from './components/ReadingProgress';
import Home from './pages/Home';
import AnimatedBlog from './pages/AnimatedBlog';
import BlogDetail from './pages/BlogDetail';
import Category from './pages/Category';
import About from './pages/About';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import './index.css';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

// Animated page wrapper
const AnimatedPage = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="enter"
    exit="exit"
  >
    {children}
  </motion.div>
);

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-dark-50 dark:bg-dark-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
        />
        <p className="mt-4 text-dark-600 dark:text-dark-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout Component
const Layout = ({ children, hideFooter = false }) => {
  return (
    <div className="bg-white dark:bg-dark-900 min-h-screen transition-colors duration-300">
      <ReadingProgress />
      <Navbar />
      <main className="min-h-screen">
        <AnimatedPage>{children}</AnimatedPage>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

// App Routes with AnimatePresence
const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/cinematic" element={<AnimatedBlog />} />
        <Route path="/blog/:slug" element={<Layout><BlogDetail /></Layout>} />
        <Route path="/category/:slug" element={<Layout><Category /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/login" element={<Layout hideFooter><Login /></Layout>} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <Layout>
              <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <h1 className="text-8xl font-bold text-primary-600 mb-4">404</h1>
                </motion.div>
                <p className="text-2xl text-dark-600 dark:text-dark-400 mb-8">
                  Oops! Page not found
                </p>
                <motion.a
                  href="/"
                  className="inline-block px-8 py-4 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Go Home
                </motion.a>
              </div>
            </Layout>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <AppRoutes />

              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#fff',
                    color: '#1a202c',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                    border: '1px solid #e2e8f0',
                  },
                  success: {
                    iconTheme: {
                      primary: '#22c55e',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
