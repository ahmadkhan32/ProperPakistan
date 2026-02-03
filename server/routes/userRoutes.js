import express from 'express';
import {
    syncUser,
    getCurrentUser,
    updateProfile,
    toggleBookmark,
    getUserBookmarks,
    getAllUsers
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/sync', syncUser);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.post('/bookmark/:postId', protect, toggleBookmark);
router.get('/bookmarks', protect, getUserBookmarks);

// Admin routes
router.get('/users', protect, admin, getAllUsers);

export default router;
