import { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';
import AnimatedPostCard from '../components/AnimatedPostCard';
import Newsletter from '../components/Newsletter';
import CinematicModeButton from '../components/CinematicModeButton';
import SEO from '../components/SEO';
import { ChevronRight, ArrowRight, Sparkles, Zap, BookOpen, Users } from 'lucide-react';

// Lazy load ThreeHero as it's heavy
const ThreeHero = ({ children }) => {
    // Fallback animated hero when Three.js is not available
    return (
        <div className="relative w-full min-h-[600px] md:min-h-[700px] overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                {/* Floating orbs */}
                <motion.div
                    className="absolute w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    style={{ top: '10%', left: '10%' }}
                />
                <motion.div
                    className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 80, 0],
                        scale: [1, 0.8, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    style={{ bottom: '10%', right: '10%' }}
                />
                <motion.div
                    className="absolute w-48 h-48 bg-purple-500/15 rounded-full blur-2xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 100, 0]
                    }}
                    transition={{ duration: 7, repeat: Infinity }}
                    style={{ top: '50%', left: '50%' }}
                />

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hero-grid)" />
                    </svg>
                </div>

                {/* Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * 700,
                            opacity: 0.2
                        }}
                        animate={{
                            y: [null, Math.random() * -200],
                            opacity: [0.2, 0.8, 0.2]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-20">
                {children}
            </div>
        </div>
    );
};

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [featuredPost, setFeaturedPost] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [selectedCategory]);

    const loadData = async () => {
        try {
            const postsRes = await apiService.getPosts({
                limit: 9,
                category: selectedCategory
            });
            setPosts(postsRes.data.posts || []);

            const featuredRes = await apiService.getPosts({ featured: true, limit: 1 });
            if (featuredRes.data.posts?.length > 0) {
                setFeaturedPost(featuredRes.data.posts[0]);
            }

            const categoriesRes = await apiService.getCategories();
            setCategories(categoriesRes.data.categories || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-dark-50 dark:bg-dark-900">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
                />
                <p className="mt-4 text-dark-600 dark:text-dark-400">Loading amazing content...</p>
            </div>
        );
    }

    return (
        <>
            <SEO />

            {/* 3D Hero Section */}
            <ThreeHero>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm mb-6 border border-white/20"
                    >
                        <Sparkles size={16} className="text-yellow-400" />
                        <span>Pakistan's #1 Tech & Career Blog</span>
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                        <span className="block">Learn, Grow &</span>
                        <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-blue-400 bg-clip-text text-transparent">
                            Succeed in Tech
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Expert tutorials, career guidance, and industry insights for Pakistani developers.
                        From freelancing to study abroad — we've got you covered.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/blog"
                                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-dark-900 font-semibold rounded-full hover:shadow-xl transition"
                            >
                                <span>Explore Articles</span>
                                <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                        <CinematicModeButton />
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/login"
                                className="inline-flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition"
                            >
                                <span>Join Community</span>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap justify-center gap-8 mt-12 text-white"
                    >
                        <div className="flex items-center space-x-2">
                            <BookOpen size={24} className="text-primary-400" />
                            <div className="text-left">
                                <p className="text-2xl font-bold">100+</p>
                                <p className="text-sm text-white/60">Articles</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Users size={24} className="text-blue-400" />
                            <div className="text-left">
                                <p className="text-2xl font-bold">5K+</p>
                                <p className="text-sm text-white/60">Readers</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Zap size={24} className="text-yellow-400" />
                            <div className="text-left">
                                <p className="text-2xl font-bold">50+</p>
                                <p className="text-sm text-white/60">AI Generated</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </ThreeHero>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-dark-900 dark:text-white flex items-center space-x-2">
                            <span>📚</span>
                            <span>Latest Posts</span>
                        </h2>
                        <Link
                            to="/blog"
                            className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                        >
                            <span>View All</span>
                            <ChevronRight size={16} />
                        </Link>
                    </div>

                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-3">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory('')}
                            className={`px-5 py-2 rounded-full font-medium transition ${!selectedCategory
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                : 'bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700'
                                }`}
                        >
                            All
                        </motion.button>
                        {categories.map((cat) => (
                            <motion.button
                                key={cat._id || cat.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory(cat._id || cat.id)}
                                className={`px-5 py-2 rounded-full font-medium transition flex items-center space-x-1 ${selectedCategory === (cat._id || cat.id)
                                    ? 'text-white shadow-lg'
                                    : 'bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700'
                                    }`}
                                style={selectedCategory === (cat._id || cat.id) ? {
                                    backgroundColor: cat.color,
                                    boxShadow: `0 10px 20px ${cat.color}40`
                                } : {}}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {posts.map((post, index) => (
                        <AnimatedPostCard key={post._id || post.id} post={post} index={index} />
                    ))}
                </div>

                {/* No posts */}
                {posts.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-dark-500 text-lg">No posts found in this category.</p>
                    </div>
                )}

                {/* View More Button */}
                {posts.length >= 9 && (
                    <div className="text-center mb-16">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/blog"
                                className="inline-flex items-center space-x-2 px-8 py-4 bg-dark-900 dark:bg-white text-white dark:text-dark-900 font-semibold rounded-full hover:shadow-xl transition"
                            >
                                <span>Load More Articles</span>
                                <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Newsletter Section */}
            <Newsletter />
        </>
    );
};

export default Home;
