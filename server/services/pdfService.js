import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import supabase from '../config/supabase.js';

/**
 * PDF Processing Service
 * Extracts text from PDF files and optionally summarizes with AI
 */

// Extract text from PDF buffer
export const extractTextFromPdf = async (pdfBuffer) => {
    try {
        const data = await pdfParse(pdfBuffer);
        return {
            success: true,
            text: data.text,
            numPages: data.numpages,
            info: data.info
        };
    } catch (error) {
        console.error('PDF extraction error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Upload file to Supabase Storage
export const uploadToStorage = async (file, bucket = 'post-documents') => {
    try {
        const fileName = `${Date.now()}-${file.originalname}`;

        const { data, error } = await supabase
            .storage
            .from(bucket)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600'
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from(bucket)
            .getPublicUrl(fileName);

        return {
            success: true,
            url: publicUrl,
            path: data.path
        };
    } catch (error) {
        console.error('Storage upload error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Clean extracted text (remove extra whitespace, etc.)
export const cleanText = (text) => {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim();
};

export default {
    extractTextFromPdf,
    uploadToStorage,
    cleanText
};
