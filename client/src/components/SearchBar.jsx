import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, Tag, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const SearchBar = ({ className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.length >= 2) {
                searchPosts();
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const searchPosts = async () => {
        setLoading(true);
        try {
            const response = await apiService.getPosts({ search: query, limit: 5 });
            setResults(response.data.posts || []);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleResultClick = (slug) => {
        navigate(`/blog/${slug}`);
        setIsOpen(false);
        setQuery('');
    };

    const handleClose = () => {
        setIsOpen(false);
        setQuery('');
        setResults([]);
    };

    // Keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            {/* Search Trigger Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className={`flex items-center space-x-2 px-4 py-2 bg-dark-100 dark:bg-dark-800 rounded-full hover:bg-dark-200 dark:hover:bg-dark-700 transition ${className}`}
                whileTap={{ scale: 0.95 }}
            >
                <Search size={18} className="text-dark-500" />
                <span className="text-dark-500 text-sm hidden md:inline">Search...</span>
                <kbd className="hidden md:inline text-xs bg-dark-200 dark:bg-dark-700 px-2 py-0.5 rounded text-dark-500">
                    ⌘K
                </kbd>
            </motion.button>

            {/* Search Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />

                        {/* Search Panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
                        >
                            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl overflow-hidden">
                                {/* Input */}
                                <div className="flex items-center border-b border-dark-100 dark:border-dark-700 px-4">
                                    <Search size={20} className="text-dark-400" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search posts, topics, tags..."
                                        className="flex-1 px-4 py-4 bg-transparent outline-none text-dark-900 dark:text-white placeholder-dark-400"
                                    />
                                    {loading && <Loader2 className="animate-spin text-primary-500" size={20} />}
                                    <button onClick={handleClose} className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-full">
                                        <X size={18} className="text-dark-400" />
                                    </button>
                                </div>

                                {/* Results */}
                                {results.length > 0 && (
                                    <div className="max-h-96 overflow-y-auto py-2">
                                        {results.map((post, index) => (
                                            <motion.button
                                                key={post.id || post._id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => handleResultClick(post.slug)}
                                                className="w-full flex items-start space-x-4 px-4 py-3 hover:bg-dark-50 dark:hover:bg-dark-700 transition text-left"
                                            >
                                                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <FileText className="text-primary-600" size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-dark-900 dark:text-white truncate">
                                                        {post.title}
                                                    </h4>
                                                    <p className="text-sm text-dark-500 dark:text-dark-400 truncate">
                                                        {post.excerpt || post.content?.substring(0, 80).replace(/<[^>]*>/g, '')}
                                                    </p>
                                                    {post.category && (
                                                        <span
                                                            className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full text-white"
                                                            style={{ backgroundColor: post.category.color || '#22c55e' }}
                                                        >
                                                            {post.category.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                )}

                                {/* No results */}
                                {query.length >= 2 && !loading && results.length === 0 && (
                                    <div className="py-12 text-center text-dark-500">
                                        <FileText size={40} className="mx-auto mb-3 opacity-50" />
                                        <p>No posts found for "{query}"</p>
                                    </div>
                                )}

                                {/* Keyboard hints */}
                                <div className="px-4 py-3 bg-dark-50 dark:bg-dark-900/50 border-t border-dark-100 dark:border-dark-700 flex items-center justify-between text-xs text-dark-500">
                                    <span>Type to search</span>
                                    <div className="flex items-center space-x-2">
                                        <kbd className="px-2 py-1 bg-dark-200 dark:bg-dark-700 rounded">↵</kbd>
                                        <span>to select</span>
                                        <kbd className="px-2 py-1 bg-dark-200 dark:bg-dark-700 rounded">esc</kbd>
                                        <span>to close</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default SearchBar;
