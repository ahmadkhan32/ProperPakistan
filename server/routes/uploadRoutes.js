import express from 'express';
import multer from 'multer';
import { extractTextFromPdf, uploadToStorage, cleanText } from '../services/pdfService.js';
import { protect, admin } from '../middleware/auth.js';
import OpenAI from 'openai';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and DOCX files are allowed'), false);
        }
    }
});

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * @route   POST /api/upload/pdf
 * @desc    Upload PDF and extract text
 * @access  Admin only
 */
router.post('/pdf', protect, admin, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Extract text from PDF
        const extractResult = await extractTextFromPdf(req.file.buffer);

        if (!extractResult.success) {
            return res.status(400).json({
                success: false,
                message: 'Failed to extract text from PDF',
                error: extractResult.error
            });
        }

        // Clean the extracted text
        const cleanedText = cleanText(extractResult.text);

        // Upload original file to storage
        const uploadResult = await uploadToStorage(req.file);

        // Optional: Summarize with AI if requested
        let summary = null;
        let blogPost = null;

        if (req.body.summarize === 'true' || req.body.convertToBlog === 'true') {
            const prompt = req.body.convertToBlog === 'true'
                ? `Convert the following document text into a well-structured blog post with HTML formatting. Include a compelling title, introduction, main sections with headers, and a conclusion:\n\n${cleanedText.substring(0, 4000)}`
                : `Summarize the following document in a concise paragraph:\n\n${cleanedText.substring(0, 4000)}`;

            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a professional content writer who creates engaging blog posts.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 2000
            });

            if (req.body.convertToBlog === 'true') {
                blogPost = completion.choices[0].message.content;
            } else {
                summary = completion.choices[0].message.content;
            }
        }

        res.json({
            success: true,
            data: {
                extractedText: cleanedText,
                numPages: extractResult.numPages,
                fileUrl: uploadResult.success ? uploadResult.url : null,
                summary,
                blogPost
            }
        });

    } catch (error) {
        console.error('PDF upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing PDF',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/upload/image
 * @desc    Upload image to storage
 * @access  Admin only
 */
router.post('/image', protect, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image uploaded'
            });
        }

        const uploadResult = await uploadToStorage(req.file, 'post-images');

        if (!uploadResult.success) {
            return res.status(400).json({
                success: false,
                message: 'Failed to upload image',
                error: uploadResult.error
            });
        }

        res.json({
            success: true,
            data: {
                url: uploadResult.url,
                path: uploadResult.path
            }
        });

    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading image',
            error: error.message
        });
    }
});

export default router;
