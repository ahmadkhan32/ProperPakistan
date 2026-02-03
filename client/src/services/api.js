import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Only logout if we're not already on login page
            // This prevents unwanted redirects during session refresh
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/') {
                // Check if token exists - if not, user is already logged out
                const token = localStorage.getItem('token');
                if (!token) {
                    // User is already logged out, just clear and redirect
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    // Use React Router navigation instead of hard redirect
                    // This will be handled by the AuthContext
                    window.location.href = '/login';
                } else {
                    // Token exists but got 401 - might be expired
                    // Don't immediately redirect, let AuthContext handle it
                    localStorage.removeItem('token');
                }
            }
        }
        return Promise.reject(error);
    }
);

// API methods
export const apiService = {
    // Posts
    getPosts: (params) => api.get('/posts', { params }),
    getPostBySlug: (slug) => api.get(`/posts/${slug}`),
    createPost: (data) => api.post('/posts', data),
    updatePost: (id, data) => api.put(`/posts/${id}`, data),
    deletePost: (id) => api.delete(`/posts/${id}`),
    getRelatedPosts: (id) => api.get(`/posts/${id}/related`),
    getPostStats: () => api.get('/posts/stats/overview'),

    // Categories
    getCategories: () => api.get('/categories'),
    getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
    createCategory: (data) => api.post('/categories', data),
    updateCategory: (id, data) => api.put(`/categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/categories/${id}`),

    // Auth
    syncUser: (data) => api.post('/auth/sync', data),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    toggleBookmark: (postId) => api.post(`/auth/bookmark/${postId}`),
    getAllUsers: () => api.get('/auth/users'),

    // AI
    generatePost: (data) => api.post('/ai/generate-post', data),

    // Upload
    uploadPdf: (formData) => api.post('/upload/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    uploadImage: (formData) => api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export default api;
