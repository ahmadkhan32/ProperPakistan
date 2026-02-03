import { Link } from 'react-router-dom';
import { Calendar, Eye, Clock, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { apiService } from '../services/api';

const PostCard = ({ post }) => {
    const { user } = useAuth();
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleBookmark = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to bookmark posts');
            return;
        }

        try {
            await apiService.toggleBookmark(post._id);
            setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.error('Error bookmarking post:', error);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover animate-fade-in">
            <Link to={`/blog/${post.slug}`}>
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={post.cover_image || post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600'}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600';
                        }}
                    />
                    {/* Category Badge */}
                    {post.category && (
                        <div
                            className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-semibold shadow-lg flex items-center space-x-1"
                            style={{ backgroundColor: post.category.color || '#22c55e' }}
                        >
                            <span>{post.category.icon || '📝'}</span>
                            <span>{post.category.name}</span>
                        </div>
                    )}
                    {/* Bookmark Button */}
                    <button
                        onClick={handleBookmark}
                        className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
                    >
                        <Bookmark
                            size={16}
                            className={isBookmarked ? 'fill-primary-600 text-primary-600' : 'text-dark-600'}
                        />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="text-xl font-bold text-dark-900 mb-2 line-clamp-2 hover:text-primary-600 transition">
                        {post.title}
                    </h3>

                    <p className="text-dark-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt || post.content?.substring(0, 150) + '...'}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-dark-500">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <Calendar size={14} />
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Eye size={14} />
                                <span>{post.views || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Clock size={14} />
                                <span>{post.readingTime || 5} min read</span>
                            </div>
                        </div>
                    </div>

                    {/* Author */}
                    {post.author && (
                        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-dark-100">
                            {post.author.avatar ? (
                                <img
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-primary-600 font-semibold text-xs">
                                        {post.author.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <span className="text-sm font-medium text-dark-700">{post.author.name}</span>
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default PostCard;
