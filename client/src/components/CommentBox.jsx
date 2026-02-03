import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { commentsService } from '../services/supabase';
import { Send, Trash2, User } from 'lucide-react';

const CommentBox = ({ postId }) => {
    const { user, supabaseUser } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadComments();

        // Subscribe to real-time comments
        const subscription = commentsService.subscribeToComments(
            postId,
            (payload) => {
                if (payload.eventType === 'INSERT') {
                    setComments((prev) => [payload.new, ...prev]);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [postId]);

    const loadComments = async () => {
        try {
            const { data, error } = await commentsService.getComments(postId);
            if (!error && data) {
                setComments(data);
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !supabaseUser) return;

        try {
            const { data, error } = await commentsService.addComment(
                postId,
                supabaseUser.id,
                newComment
            );

            if (!error) {
                setNewComment('');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;

        try {
            await commentsService.deleteComment(commentId);
            setComments(comments.filter((c) => c.id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-bold text-dark-900 mb-6">
                Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex items-start space-x-3">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                        ) : (
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <User size={20} className="text-primary-600" />
                            </div>
                        )}
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write your comment..."
                                className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                rows="3"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="mt-2 btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={16} />
                                <span>Post Comment</span>
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-8 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                    <p className="text-dark-700">
                        Please <a href="/login" className="text-primary-600 font-semibold">sign in</a> to leave a comment.
                    </p>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <p className="text-dark-500 text-center py-8">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-3 animate-fade-in">
                            {comment.user?.avatar ? (
                                <img
                                    src={comment.user.avatar}
                                    alt={comment.user.name}
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-dark-100 rounded-full flex items-center justify-center">
                                    <User size={20} className="text-dark-600" />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="bg-dark-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-dark-900">
                                            {comment.user?.name || 'Anonymous'}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-dark-500">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                            {supabaseUser?.id === comment.user_id && (
                                                <button
                                                    onClick={() => handleDelete(comment.id)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-dark-700">{comment.text}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentBox;
