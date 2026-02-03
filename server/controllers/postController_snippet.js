export const getPosts = async (req, res) => {
    try {
        const { category, featured, search } = req.query;

        console.log('Fetching posts with params:', { category, featured, search });

        let query = supabase
            .from('posts')
            .select(`
                *,
                category:categories(*),
                author:profiles(id, full_name, avatar_url)
            `)
            .eq('status', 'published')
            .order('created_at', { ascending: false });

        if (category) {
            query = query.eq('category.slug', category);
        }

        if (featured === 'true') {
            query = query.eq('featured', true);
        }

        if (search) {
            query = query.ilike('title', `%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
            // SPECIAL HANDLING FOR SCHEMA CACHE ERROR
            if (error.code === 'PGRST205') {
                console.error('🚨 CRITICAL: Supabase Schema Cache Out of Sync!');
                console.error('👉 ACTION REQUIRED: Go to Supabase Dashboard -> Settings -> API -> Click "Reload schema cache"');
                return res.status(503).json({
                    success: false,
                    message: 'Database schema update required. Please contact admin.',
                    code: 'SCHEMA_REFRESH_REQUIRED'
                });
            }
            throw error;
        }

        res.json({
            success: true,
            posts: data || []
        });

    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
