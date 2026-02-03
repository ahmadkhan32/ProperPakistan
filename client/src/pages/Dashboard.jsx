import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { apiService } from '../services/api';
import { storageService } from '../services/supabase';
import { waitForSession } from '../utils/authGuard';
import RichTextEditor from '../components/RichTextEditor';
import SEO from '../components/SEO';
import PostCreationModal from '../components/PostCreationModal';
import {
    LayoutDashboard,
    FileText,
    Users,
    BarChart3,
    Plus,
    Edit2,
    Trash2,
    Eye,
    Upload
} from 'lucide-react';

const Dashboard = () => {
    const { user, isAdmin, loading: authLoading, supabaseUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [posts, setPosts] = useState([]);
    const [stats, setStats] = useState({});
    const [categories, setCategories] = useState([]);
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [sessionChecked, setSessionChecked] = useState(false);
    const [showPostForm, setShowPostForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        image: '',
        seoTitle: '',
        seoDescription: '',
        tags: '',
        status: 'published',
        featured: false
    });
    const [uploading, setUploading] = useState(false);
    const [showAiModal, setShowAiModal] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState({ topic: '', keywords: '' });
    const [showCreationModal, setShowCreationModal] = useState(false);

    // Define loadData with useCallback to avoid dependency issues
    const loadData = useCallback(async () => {
        // Wait for token to be available (backend sync might still be in progress)
        let token = localStorage.getItem('token');
        let retries = 0;
        const maxRetries = 10;

        while (!token && retries < maxRetries) {
            console.log(`⏳ Waiting for token... (attempt ${retries + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 200));
            token = localStorage.getItem('token');
            retries++;
        }

        if (!token) {
            console.error('❌ No token available after waiting');
            alert('Authentication token not available. Please try logging in again.');
            navigate('/login', { replace: true });
            setDashboardLoading(false);
            return;
        }

        console.log('✅ Token found, loading dashboard data...');

        try {
            const [postsRes, statsRes, categoriesRes] = await Promise.all([
                apiService.getPosts({ limit: 100 }),
                apiService.getPostStats(),
                apiService.getCategories()
            ]);

            setPosts(postsRes.data.posts || []);
            setStats(statsRes.data.stats || {});
            setCategories(categoriesRes.data.categories || []);
        } catch (error) {
            console.error('Error loading data:', error);

            // If we get a 401, try to re-sync the user
            if (error.response?.status === 401) {
                console.log('🔄 401 error - token might be expired, attempting to re-sync...');
                // Check if we have a Supabase session to re-sync
                if (supabaseUser) {
                    // The AuthContext will handle re-syncing on the next auth state change
                    console.log('⚠️ Token expired. Please wait for re-authentication...');
                    // Don't show alert, let the auth system handle it
                } else {
                    // No Supabase session, redirect to login
                    navigate('/login', { replace: true });
                }
            } else {
                alert('Failed to load dashboard data. Please try refreshing the page.');
            }
        } finally {
            setDashboardLoading(false);
        }
    }, [navigate, supabaseUser]);

    // SESSION GUARD: Wait for Supabase session before showing dashboard
    useEffect(() => {
        const guardDashboard = async () => {
            console.log('🛡️ Session Guard: Checking Supabase session...');

            // Wait for session to be available (with retries for localStorage restore)
            const { session } = await waitForSession(5, 200);

            if (!session) {
                console.log('❌ Session Guard: No session found, redirecting to login');
                navigate('/login', { replace: true });
                return;
            }

            console.log('✅ Session Guard: Session confirmed for', session.user.email);
            setSessionChecked(true);
        };

        guardDashboard();
    }, [navigate]);

    useEffect(() => {
        // CRITICAL: Wait for both session check AND auth context to finish loading
        if (!sessionChecked || authLoading) {
            console.log('⏳ Dashboard waiting for session check and auth to load...');
            return; // Don't do anything while session/auth is initializing
        }

        // If no user at all, redirect to login
        if (!user) {
            console.log('❌ No user found, redirecting to login');
            navigate('/login', { replace: true });
            return;
        }

        // If user exists but not admin, redirect to home (not login)
        // This prevents logout loop when a regular user tries to access dashboard
        if (!isAdmin) {
            console.log('⚠️ User is not admin, redirecting to home');
            navigate('/', { replace: true });
            return;
        }

        // User is authenticated AND admin, load dashboard data
        console.log('✅ Admin user authenticated, loading dashboard data');
        loadData();
    }, [isAdmin, authLoading, user, navigate, sessionChecked, loadData]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const { data, error } = await storageService.uploadImage(file);
            if (error) throw error;
            setFormData({ ...formData, image: data.url });
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const postData = {
                title: formData.title,
                slug: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                content: formData.content,
                excerpt: formData.excerpt,
                image: formData.image,
                categoryId: formData.category, // Frontend uses 'category', backend expects 'categoryId'
                seoTitle: formData.seoTitle,
                seoDescription: formData.seoDescription,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                featured: formData.featured,
                status: formData.status
            };

            if (editingPost) {
                await apiService.updatePost(editingPost._id, postData);
                alert('Post updated successfully!');
            } else {
                await apiService.createPost(postData);
                alert('Post created successfully!');
            }

            setShowPostForm(false);
            setEditingPost(null);
            setFormData({
                title: '',
                content: '',
                excerpt: '',
                category: '',
                image: '',
                seoTitle: '',
                seoDescription: '',
                tags: '',
                status: 'published',
                featured: false
            });
            loadData();
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Failed to save post');
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || '',
            category: post.category._id,
            image: post.image || '',
            seoTitle: post.seoTitle || '',
            seoDescription: post.seoDescription || '',
            tags: post.tags?.join(', ') || '',
            status: post.status,
            featured: post.featured || false
        });
        setShowPostForm(true);
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await apiService.deletePost(postId);
            alert('Post deleted successfully!');
            loadData();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
        }
    };

    const handleAiGenerate = async () => {
        if (!formData.title || !aiPrompt.topic) {
            alert('Please enter a title and topic for AI generation');
            return;
        }

        if (!formData.category) {
            alert('Please select a category first');
            return;
        }

        setGenerating(true);
        try {
            const categoryName = categories.find(c => c._id === formData.category)?.name || '';

            const response = await apiService.generatePost({
                title: formData.title,
                topic: aiPrompt.topic,
                keywords: aiPrompt.keywords,
                categoryName: categoryName
            });

            // Auto-fill form with generated content
            setFormData({
                ...formData,
                content: response.data.data.content,
                excerpt: response.data.data.excerpt,
                seoTitle: response.data.data.seoTitle,
                seoDescription: response.data.data.seoDescription,
                tags: response.data.data.tags
            });

            setShowAiModal(false);
            setAiPrompt({ topic: '', keywords: '' });
            alert('✅ AI post generated successfully! Review and save when ready.');
        } catch (error) {
            console.error('AI generation error:', error);
            const errorMsg = error.response?.data?.message || 'Failed to generate post with AI';
            alert(`❌ ${errorMsg}`);
        } finally {
            setGenerating(false);
        }
    };

    // Show loader until session is confirmed AND auth is loaded
    if (!sessionChecked || authLoading || dashboardLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-dark-50">
                <div className="spinner mb-4"></div>
                <p className="text-dark-600 text-sm">
                    {!sessionChecked ? 'Checking session...' :
                        authLoading ? 'Loading authentication...' :
                            'Loading dashboard...'}
                </p>
            </div>
        );
    }

    return (
        <>
            <SEO title="Admin Dashboard" />

            <div className="flex min-h-screen bg-dark-50">
                {/* Sidebar */}
                <div className="w-64 bg-dark-900 text-white">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold">Admin Panel</h2>
                        <p className="text-dark-400 text-sm mt-1">{user?.name}</p>
                    </div>
                    <nav className="space-y-1 px-3">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'overview' ? 'bg-primary-600' : 'hover:bg-dark-800'
                                }`}
                        >
                            <LayoutDashboard size={20} />
                            <span>Overview</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'posts' ? 'bg-primary-600' : 'hover:bg-dark-800'
                                }`}
                        >
                            <FileText size={20} />
                            <span>Posts</span>
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    {activeTab === 'overview' && (
                        <div>
                            <h1 className="text-3xl font-bold text-dark-900 mb-8">Dashboard Overview</h1>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white rounded-xl p-6 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-dark-600 text-sm">Total Posts</p>
                                            <p className="text-3xl font-bold text-dark-900 mt-1">{stats.totalPosts || 0}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <FileText className="text-primary-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-dark-600 text-sm">Published</p>
                                            <p className="text-3xl font-bold text-dark-900 mt-1">{stats.publishedPosts || 0}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Eye className="text-green-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-dark-600 text-sm">Total Views</p>
                                            <p className="text-3xl font-bold text-dark-900 mt-1">{stats.totalViews || 0}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <BarChart3 className="text-blue-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-dark-600 text-sm">Drafts</p>
                                            <p className="text-3xl font-bold text-dark-900 mt-1">{stats.draftPosts || 0}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                            <FileText className="text-yellow-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-md">
                                <h2 className="text-xl font-bold text-dark-900 mb-4">Quick Actions</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <button
                                        onClick={() => setShowCreationModal(true)}
                                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
                                    >
                                        <Plus className="text-primary-600 mb-2" size={32} />
                                        <span className="font-semibold text-dark-900">New Post</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'posts' && !showPostForm && (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-3xl font-bold text-dark-900">Manage Posts</h1>
                                <button
                                    onClick={() => setShowPostForm(true)}
                                    className="btn btn-primary flex items-center space-x-2"
                                >
                                    <Plus size={20} />
                                    <span>New Post</span>
                                </button>
                            </div>

                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-dark-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-dark-700 uppercase">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-dark-700 uppercase">Category</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-dark-700 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-dark-700 uppercase">Views</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-dark-700 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dark-100">
                                        {posts.map((post) => (
                                            <tr key={post._id} className="hover:bg-dark-50">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-dark-900">{post.title}</div>
                                                    <div className="text-sm text-dark-600">{post.slug}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {post.category && (
                                                        <span
                                                            className="px-2 py-1 rounded-full text-white text-xs"
                                                            style={{ backgroundColor: post.category.color }}
                                                        >
                                                            {post.category.name}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${post.status === 'published'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {post.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-dark-700">{post.views || 0}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(post)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(post._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {showPostForm && (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-3xl font-bold text-dark-900">
                                    {editingPost ? 'Edit Post' : 'Create New Post'}
                                </h1>
                                <button
                                    onClick={() => {
                                        setShowPostForm(false);
                                        setEditingPost(null);
                                    }}
                                    className="btn bg-dark-200 text-dark-700"
                                >
                                    Cancel
                                </button>
                            </div>

                            {/* AI Generation Modal */}
                            {showAiModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                                        <h3 className="text-2xl font-bold text-dark-900 mb-4">🤖 Generate with AI</h3>
                                        <p className="text-dark-600 mb-6">Let AI create a professional blog post for you!</p>

                                        <div className="space-y-4 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium text-dark-700 mb-2">
                                                    Topic / Description *
                                                </label>
                                                <textarea
                                                    value={aiPrompt.topic}
                                                    onChange={(e) => setAiPrompt({ ...aiPrompt, topic: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                                    rows="3"
                                                    placeholder="e.g., Discuss the benefits of renewable energy for Pakistan's economy..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-dark-700 mb-2">
                                                    Keywords (optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={aiPrompt.keywords}
                                                    onChange={(e) => setAiPrompt({ ...aiPrompt, keywords: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                                    placeholder="renewable energy, solar power, Pakistan"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={handleAiGenerate}
                                                disabled={generating || !aiPrompt.topic}
                                                className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {generating ? (
                                                    <>
                                                        <div className="spinner inline-block mr-2"></div>
                                                        Generating...
                                                    </>
                                                ) : '✨ Generate Post'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowAiModal(false);
                                                    setAiPrompt({ topic: '', keywords: '' });
                                                }}
                                                disabled={generating}
                                                className="btn bg-dark-200 text-dark-700"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-md space-y-6">
                                {/* AI Generation Button */}
                                {!editingPost && (
                                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-lg font-bold text-dark-900 mb-1">✨ AI-Powered Writing</h4>
                                                <p className="text-sm text-dark-600">Let AI generate a professional blog post for you</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowAiModal(true)}
                                                className="btn btn-primary flex items-center space-x-2"
                                            >
                                                <span>🤖 Generate with AI</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-2">Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-2">Content *</label>

                                    {/* AI Generate Button */}
                                    {!editingPost && (
                                        <button
                                            type="button"
                                            onClick={() => setShowAiModal(true)}
                                            className="mb-3 btn bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 flex items-center space-x-2"
                                            disabled={!formData.title || !formData.category}
                                        >
                                            <span>🤖</span>
                                            <span>Generate with AI</span>
                                        </button>
                                    )}

                                    <RichTextEditor
                                        value={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
                                        className="bg-white"
                                        theme="snow"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-2">Excerpt</label>
                                    <textarea
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                        rows="3"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-dark-700 mb-2">Category *</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                            required
                                        >
                                            <option value="">Select category</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-dark-700 mb-2">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-2">Featured Image</label>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="btn btn-secondary flex items-center space-x-2 cursor-pointer"
                                        >
                                            <Upload size={16} />
                                            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                                        </label>
                                        {formData.image && (
                                            <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded" />
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-2">SEO Title</label>
                                    <input
                                        type="text"
                                        value={formData.seoTitle}
                                        onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                        maxLength={60}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-2">SEO Description</label>
                                    <textarea
                                        value={formData.seoDescription}
                                        onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                        rows="2"
                                        maxLength={160}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-2">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="react, javascript, tutorial"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-4 h-4 text-primary-600"
                                    />
                                    <label className="ml-2 text-sm font-medium text-dark-700">Featured Post</label>
                                </div>

                                <button type="submit" className="btn btn-primary w-full">
                                    {editingPost ? 'Update Post' : 'Create Post'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Generation Modal */}
            {showAiModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full m-4 shadow-2xl">
                        <h3 className="text-2xl font-bold text-dark-900 mb-4 flex items-center space-x-2">
                            <span>🤖</span>
                            <span>AI Post Generator</span>
                        </h3>
                        <p className="text-dark-600 mb-6">
                            Let AI write a professional blog post for you!
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">
                                    Title (already set)
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    disabled
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">
                                    Topic / Description *
                                </label>
                                <textarea
                                    value={aiPrompt.topic}
                                    onChange={(e) => setAiPrompt({ ...aiPrompt, topic: e.target.value })}
                                    placeholder="E.g., Latest tech trends, benefits of AI, travel tips for Pakistan..."
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">
                                    Keywords (optional)
                                </label>
                                <input
                                    type="text"
                                    value={aiPrompt.keywords}
                                    onChange={(e) => setAiPrompt({ ...aiPrompt, keywords: e.target.value })}
                                    placeholder="E.g., AI, technology, innovation"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowAiModal(false);
                                    setAiPrompt({ topic: '', keywords: '' });
                                }}
                                className="flex-1 btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                                disabled={generating}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAiGenerate}
                                className="flex-1 btn bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                                disabled={generating || !aiPrompt.topic}
                            >
                                {generating ? '🤖 Generating...' : '✨ Generate'}
                            </button>
                        </div>

                        {generating && (
                            <div className="mt-4 text-center text-sm text-gray-600">
                                <p>⏳ AI is writing your post... This may take 10-30 seconds</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Post Creation Modal - for AI chatbot and PDF upload */}
            <PostCreationModal
                isOpen={showCreationModal}
                onClose={() => setShowCreationModal(false)}
                onContentReady={(content) => {
                    setShowCreationModal(false);
                    setActiveTab('posts');
                    setShowPostForm(true);

                    if (content) {
                        // Pre-fill form with generated content
                        setFormData({
                            ...formData,
                            title: content.title || formData.title,
                            content: content.content || '',
                            excerpt: content.excerpt || '',
                            seoTitle: content.seoTitle || content.title || '',
                            seoDescription: content.seoDescription || content.excerpt || '',
                            tags: Array.isArray(content.tags) ? content.tags.join(', ') : (content.tags || '')
                        });
                    }
                }}
            />
        </>
    );
};

export default Dashboard;
