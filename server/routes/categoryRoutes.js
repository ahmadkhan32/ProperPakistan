import express from 'express';
import {
    getAllCategories,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:slug', getCategoryBySlug);

// Protected routes (admin only)
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
