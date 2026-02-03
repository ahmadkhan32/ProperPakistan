import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, signOut, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-white/90 dark:bg-dark-900/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-dark-100 dark:border-dark-800"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <motion.div
                            className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30"
                            whileHover={{ rotate: 5, scale: 1.05 }}
                        >
                            <span className="text-xl font-bold text-white">PP</span>
                        </motion.div>
                        <span className="text-xl font-bold text-dark-900 dark:text-white">
                            Proper<span className="text-primary-600">Pakistan</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition">
                            Home
                        </Link>

                        {/* Categories Dropdown */}
                        <div className="relative group">
                            <button className="text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium flex items-center space-x-1">
                                <span>Categories</span>
                                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-dark-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-dark-100 dark:border-dark-700 overflow-hidden">
                                <div className="py-2">
                                    <Link
                                        to="/category/technology"
                                        className="flex items-center px-4 py-3 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition"
                                    >
                                        <span className="text-2xl mr-3">💻</span>
                                        <span className="text-dark-700 dark:text-dark-300 font-medium">Technology</span>
                                    </Link>
                                    <Link
                                        to="/category/education"
                                        className="flex items-center px-4 py-3 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition"
                                    >
                                        <span className="text-2xl mr-3">📚</span>
                                        <span className="text-dark-700 dark:text-dark-300 font-medium">Education</span>
                                    </Link>
                                    <Link
                                        to="/category/freelancing"
                                        className="flex items-center px-4 py-3 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition"
                                    >
                                        <span className="text-2xl mr-3">💼</span>
                                        <span className="text-dark-700 dark:text-dark-300 font-medium">Freelancing</span>
                                    </Link>
                                    <Link
                                        to="/category/study-abroad"
                                        className="flex items-center px-4 py-3 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition"
                                    >
                                        <span className="text-2xl mr-3">✈️</span>
                                        <span className="text-dark-700 dark:text-dark-300 font-medium">Study Abroad</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link to="/about" className="text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition">
                            About
                        </Link>

                        {/* Search Bar */}
                        <SearchBar />

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-dark-700 dark:text-dark-300 hover:text-primary-600">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border-2 border-primary-200" />
                                    ) : (
                                        <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                                            <User size={18} className="text-white" />
                                        </div>
                                    )}
                                    <span className="font-medium">{user.name}</span>
                                    <ChevronDown size={14} />
                                </button>

                                {/* User Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-dark-100 dark:border-dark-700">
                                    <Link
                                        to="/profile"
                                        className="flex items-center space-x-2 px-4 py-2 text-dark-700 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition"
                                    >
                                        <User size={16} />
                                        <span>Profile</span>
                                    </Link>
                                    {isAdmin && (
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center space-x-2 px-4 py-2 text-dark-700 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition"
                                        >
                                            <LayoutDashboard size={16} />
                                            <span>Dashboard</span>
                                        </Link>
                                    )}
                                    <hr className="my-2 border-dark-100 dark:border-dark-700" />
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                    >
                                        <LogOut size={16} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/login"
                                    className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-full shadow-lg shadow-primary-500/30 hover:shadow-xl transition"
                                >
                                    Sign In
                                </Link>
                            </motion.div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-3">
                        <ThemeToggle />
                        <button
                            className="text-dark-700 dark:text-dark-300 p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="py-4 border-t border-dark-100 dark:border-dark-800 space-y-2">
                                <Link
                                    to="/"
                                    className="block py-3 px-4 text-dark-700 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    🏠 Home
                                </Link>

                                <div className="py-2 px-4">
                                    <p className="font-semibold text-dark-900 dark:text-white mb-2">📁 Categories</p>
                                    <div className="space-y-1 pl-4">
                                        <Link to="/category/technology" className="block py-2 text-dark-600 dark:text-dark-400" onClick={() => setIsMenuOpen(false)}>
                                            💻 Technology
                                        </Link>
                                        <Link to="/category/education" className="block py-2 text-dark-600 dark:text-dark-400" onClick={() => setIsMenuOpen(false)}>
                                            📚 Education
                                        </Link>
                                        <Link to="/category/freelancing" className="block py-2 text-dark-600 dark:text-dark-400" onClick={() => setIsMenuOpen(false)}>
                                            💼 Freelancing
                                        </Link>
                                        <Link to="/category/study-abroad" className="block py-2 text-dark-600 dark:text-dark-400" onClick={() => setIsMenuOpen(false)}>
                                            ✈️ Study Abroad
                                        </Link>
                                    </div>
                                </div>

                                <Link
                                    to="/about"
                                    className="block py-3 px-4 text-dark-700 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    ℹ️ About
                                </Link>

                                {user ? (
                                    <>
                                        <Link to="/profile" className="block py-3 px-4 text-dark-700 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                                            👤 Profile
                                        </Link>
                                        {isAdmin && (
                                            <Link to="/dashboard" className="block py-3 px-4 text-dark-700 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                                                📊 Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                                            className="block w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                        >
                                            🚪 Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/login" className="block py-3 px-4 text-primary-600 font-semibold" onClick={() => setIsMenuOpen(false)}>
                                        🔐 Sign In
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar;
