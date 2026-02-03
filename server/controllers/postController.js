import supabase from '../config/supabase.js';

// Get all posts with filtering, pagination, search
export const getAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, search, featured } = req.query;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('posts')
            .select(`
        *,
        category:categories(*),
        author:profiles(id, full_name, avatar_url)
      `, { count: 'exact' })
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .range(offset, offset + parseInt(limit) - 1);

        // Filter by category slug
        if (category) {
            const { data: categoryData } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', category)
                .single();

            if (categoryData) {
                query = query.eq('category_id', categoryData.id);
            }
        }

        // Filter by featured
        if (featured === 'true') {
            query = query.eq('featured', true);
        }

        // Search functionality
        if (search) {
            query = query.textSearch('search_vector', search);
        }

        const { data: posts, error, count } = await query;

        if (error) throw error;

        // Get like counts for each post
        const postsWithLikes = await Promise.all(
            (posts || []).map(async (post) => {
                const { count: likeCount } = await supabase
                    .from('likes')
                    .select('*', { count: 'exact', head: true })
                    .eq('post_id', post.id);

                return {
                    ...post,
                    likeCount: likeCount || 0
                };
            })
        );

        res.json({
            success: true,
            posts: postsWithLikes,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil((count || 0) / limit),
                totalPosts: count || 0
            }
        });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single post by slug
export const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const { data: post, error } = await supabase
            .from('posts')
            .select(`
        *,
        category:categories(*),
        author:profiles(id, full_name, avatar_url)
      `)
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (error) throw error;
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Increment views
        await supabase.rpc('increment_post_views', { post_id_param: post.id });

        // Get like count
        const { count: likeCount } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

        post.likeCount = likeCount || 0;

        res.json({ success: true, post });
    } catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create new post (Admin only)
export const createPost = async (req, res) => {
    try {
        const { title, slug, content, excerpt, image, categoryId, seoTitle, seoDescription, tags, featured } = req.body;

        const { data: post, error } = await supabase
            .from('posts')
            .insert({
                title,
                slug,
                content,
                excerpt,
                image,
                category_id: categoryId,
                author_id: req.user.id,
                seo_title: seoTitle,
                seo_description: seoDescription,
                tags,
                featured: featured || false,
                status: 'published'
            })
            .select(`
        *,
        category:categories(*),
        author:profiles(id, full_name, avatar_url)
      `)
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, post });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update post (Admin only)
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const { data: post, error } = await supabase
            .from('posts')
            .update({
                title: updateData.title,
                slug: updateData.slug,
                content: updateData.content,
                excerpt: updateData.excerpt,
                image: updateData.image,
                category_id: updateData.categoryId,
                seo_title: updateData.seoTitle,
                seo_description: updateData.seoDescription,
                tags: updateData.tags,
                featured: updateData.featured,
                status: updateData.status
            })
            .eq('id', id)
            .select(`
        *,
        category:categories(*),
        author:profiles(id, full_name, avatar_url)
      `)
            .single();

        if (error) throw error;

        res.json({ success: true, post });
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete post (Admin only)
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get related posts
export const getRelatedPosts = async (req, res) => {
    try {
        const { slug } = req.params;

        // Get current post
        const { data: currentPost } = await supabase
            .from('posts')
            .select('id, category_id')
            .eq('slug', slug)
            .single();

        if (!currentPost) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Get related posts from same category
        const { data: relatedPosts, error } = await supabase
            .from('posts')
            .select(`
        *,
        category:categories(*),
        author:profiles(id, full_name, avatar_url)
      `)
            .eq('category_id', currentPost.category_id)
            .eq('status', 'published')
            .neq('id', currentPost.id)
            .limit(3);

        if (error) throw error;

        res.json({ success: true, posts: relatedPosts || [] });
    } catch (error) {
        console.error('Get related posts error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get post stats (Admin)
export const getPostStats = async (req, res) => {
    try {
        // Total posts
        const { count: totalPosts } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true });

        // Total views
        const { data: viewsData } = await supabase
            .from('posts')
            .select('views');

        const totalViews = viewsData?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;

        // Total likes
        const { count: totalLikes } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true });

        // Total comments
        const { count: totalComments } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true });

        res.json({
            success: true,
            stats: {
                totalPosts: totalPosts || 0,
                totalViews: totalViews,
                totalLikes: totalLikes || 0,
                totalComments: totalComments || 0
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
