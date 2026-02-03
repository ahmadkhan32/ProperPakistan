import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Eye, Clock, Bookmark, Heart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { apiService } from '../services/api';

const AnimatedPostCard = ({ post, index = 0 }) => {
    const { user } = useAuth();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes_count || 0);

    const handleBookmark = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            alert('Please login to bookmark posts');
            return;
        }
        try {
            await apiService.toggleBookmark(post._id || post.id);
            setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.error('Error bookmarking post:', error);
        }
    };

    const handleLike = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            alert('Please login to like posts');
            return;
        }
        setIsLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);
        // API call would go here
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden group"
        >
            <Link to={`/blog/${post.slug}`}>
                {/* Image with overlay */}
                <div className="relative h-52 overflow-hidden">
                    <motion.img
                        src={post.cover_image || post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600'}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600';
                        }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category Badge */}
                    {post.category && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-semibold shadow-lg flex items-center space-x-1 backdrop-blur-sm"
                            style={{ backgroundColor: `${post.category.color || '#22c55e'}dd` }}
                        >
                            <span>{post.category.icon || '📝'}</span>
                            <span>{post.category.name}</span>
                        </motion.div>
                    )}

                    {/* Action buttons */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <motion.button
                            onClick={handleBookmark}
                            whileTap={{ scale: 0.8 }}
                            className="w-9 h-9 bg-white/90 dark:bg-dark-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
                        >
                            <Bookmark
                                size={16}
                                className={isBookmarked ? 'fill-primary-600 text-primary-600' : 'text-dark-600 dark:text-dark-300'}
                            />
                        </motion.button>
                        <motion.button
                            onClick={handleLike}
                            whileTap={{ scale: 0.8 }}
                            className="w-9 h-9 bg-white/90 dark:bg-dark-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
                        >
                            <Heart
                                size={16}
                                className={isLiked ? 'fill-red-500 text-red-500' : 'text-dark-600 dark:text-dark-300'}
                            />
                        </motion.button>
                    </div>

                    {/* Featured badge */}
                    {post.featured && (
                        <div className="absolute bottom-4 left-4 bg-yellow-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                            <span>⭐</span>
                            <span>Featured</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {post.title}
                    </h3>

                    <p className="text-dark-600 dark:text-dark-400 text-sm mb-4 line-clamp-2">
                        {post.excerpt || post.content?.substring(0, 120).replace(/<[^>]*>/g, '') + '...'}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-dark-500 dark:text-dark-400">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <Calendar size={14} />
                                <span>{new Date(post.created_at || post.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Eye size={14} />
                                <span>{post.views || 0}</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{post.reading_time || post.readingTime || 5} min</span>
                        </div>
                    </div>

                    {/* Author */}
                    {post.author && (
                        <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-dark-100 dark:border-dark-700">
                            {post.author.avatar || post.author.avatar_url ? (
                                <img
                                    src={post.author.avatar || post.author.avatar_url}
                                    alt={post.author.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-xs">
                                        {post.author.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <span className="text-sm font-medium text-dark-700 dark:text-dark-300">
                                {post.author.name}
                            </span>
                        </div>
                    )}
                </div>
            </Link>
        </motion.div>
    );
};

export default AnimatedPostCard;
