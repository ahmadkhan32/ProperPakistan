import express from 'express';
import {
    getAllPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
    getRelatedPosts,
    getPostStats
} from '../controllers/postController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/stats/overview', protect, admin, getPostStats);
router.get('/:slug', getPostBySlug);
router.get('/:id/related', getRelatedPosts);

// Protected routes (admin only)
router.post('/', protect, admin, createPost);
router.put('/:id', protect, admin, updatePost);
router.delete('/:id', protect, admin, deletePost);

export default router;
