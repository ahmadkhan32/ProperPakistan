import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { likesService } from '../services/supabase';
import { useAuth } from '../context/useAuth';
import CommentBox from '../components/CommentBox';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import { Calendar, Eye, Clock, Heart, Share2, Bookmark, Facebook, Twitter, Linkedin } from 'lucide-react';

const BlogDetail = () => {
    const { slug } = useParams();
    const { user, supabaseUser } = useAuth();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPost();
    }, [slug]);

    const loadPost = async () => {
        try {
            const res = await apiService.getPostBySlug(slug);
            if (res.data.success) {
                setPost(res.data.post);

                // Load related posts
                const relatedRes = await apiService.getRelatedPosts(res.data.post._id);
                setRelatedPosts(relatedRes.data.posts || []);

                // Check if user liked this post
                if (supabaseUser) {
                    const { data } = await likesService.checkLike(res.data.post._id, supabaseUser.id);
                    setLiked(!!data);
                }

                // Get like count
                const { count } = await likesService.getLikeCount(res.data.post._id);
                setLikeCount(count || 0);
            }
        } catch (error) {
            console.error('Error loading post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!supabaseUser) {
            alert('Please login to like posts');
            return;
        }

        try {
            const { liked: newLikedState } = await likesService.toggleLike(post._id, supabaseUser.id);
            setLiked(newLikedState);
            setLikeCount((prev) => newLikedState ? prev + 1 : prev - 1);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const shareUrl = window.location.href;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h1 className="text-4xl font-bold text-dark-900 mb-4">Post Not Found</h1>
                <Link to="/" className="btn btn-primary">
                    Go Home
                </Link>
            </div>
        );
    }

    return (
        <>
            <SEO
                title={post.seoTitle || post.title}
                description={post.seoDescription || post.excerpt}
                image={post.image}
                type="article"
            />

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Category Badge */}
                {post.category && (
                    <div className="mb-4">
                        <Link
                            to={`/category/${post.category.slug}`}
                            className="inline-block px-4 py-2 rounded-full text-white font-semibold text-sm"
                            style={{ backgroundColor: post.category.color }}
                        >
                            {post.category.icon} {post.category.name}
                        </Link>
                    </div>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4 animate-fade-in">
                    {post.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-dark-600 mb-8">
                    <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Eye size={16} />
                        <span>{post.views} views</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock size={16} />
                        <span>{post.readingTime || 5} min read</span>
                    </div>
                </div>

                {/* Author */}
                {post.author && (
                    <div className="flex items-center space-x-3 mb-8 p-4 bg-dark-50 rounded-lg">
                        {post.author.avatar ? (
                            <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full" />
                        ) : (
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-600 font-bold text-lg">
                                    {post.author.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-dark-900">{post.author.name}</p>
                            <p className="text-sm text-dark-600">Author</p>
                        </div>
                    </div>
                )}

                {/* Featured Image */}
                {post.image && (
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full rounded-2xl shadow-lg mb-8 animate-slide-up"
                    />
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between mb-8 p-4 bg-white rounded-lg shadow-md">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleLike}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${liked
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
                                }`}
                        >
                            <Heart size={20} className={liked ? 'fill-current' : ''} />
                            <span>{likeCount}</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-dark-100 text-dark-700 hover:bg-dark-200 transition">
                            <Bookmark size={20} />
                            <span>Save</span>
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-dark-600 text-sm">Share:</span>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                        >
                            <Facebook size={18} />
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${post.title}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition"
                        >
                            <Twitter size={18} />
                        </a>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                        >
                            <Linkedin size={18} />
                        </a>
                    </div>
                </div>

                {/* Content */}
                <div
                    className="blog-content prose prose-lg max-w-none mb-12"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-xl font-bold text-dark-900 mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Comments */}
                <CommentBox postId={post._id} />

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="mt-16">
                        <h3 className="text-2xl font-bold text-dark-900 mb-6">Related Posts</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <PostCard key={relatedPost._id} post={relatedPost} />
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </>
    );
};

export default BlogDetail;
