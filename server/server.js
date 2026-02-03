// Environment variables are loaded via -r dotenv/config flag in package.json
// This loads .env BEFORE any module imports
console.log('\n🔍 Environment Variable Check:');
console.log('  SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET ✓' : 'MISSING ✗');
console.log('  SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET ✓' : 'MISSING ✗');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? 'SET ✓' : 'MISSING ✗');
console.log('');

// Import application dependencies
import express from 'express';
import cors from 'cors';
import supabase from './config/supabase.js';
import postRoutes from './routes/postRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'ProperPakistan.com API is running',
        supabase: !!supabase,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`✅ Supabase connected: ${!!supabase}\n`);
});
