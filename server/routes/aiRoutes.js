import express from 'express';
import { generatePost } from '../controllers/aiController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// AI post generation (Admin only)
router.post('/generate-post', protect, admin, generatePost);

export default router;
