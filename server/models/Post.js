import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Post title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Post content is required']
    },
    excerpt: {
        type: String,
        maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    image: {
        type: String, // Supabase Storage URL
        default: ''
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    seoTitle: {
        type: String,
        trim: true,
        maxlength: [60, 'SEO title should be under 60 characters']
    },
    seoDescription: {
        type: String,
        trim: true,
        maxlength: [160, 'SEO description should be under 160 characters']
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for search
postSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Virtual for reading time (assuming 200 words per minute)
postSchema.virtual('readingTime').get(function () {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
});

// Generate slug from title before saving
postSchema.pre('save', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
    next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;
