import supabase from '../config/supabase.js';

// Get all categories with post counts
export const getAllCategories = async (req, res) => {
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) throw error;

        // Get post count for each category
        const categoriesWithCount = await Promise.all(
            (categories || []).map(async (category) => {
                const { count } = await supabase
                    .from('posts')
                    .select('*', { count: 'exact', head: true })
                    .eq('category_id', category.id)
                    .eq('status', 'published');

                return {
                    ...category,
                    postCount: count || 0
                };
            })
        );

        res.json({ success: true, categories: categoriesWithCount });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get category by slug
export const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const { data: category, error } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) throw error;
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Get post count
        const { count } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('status', 'published');

        category.postCount = count || 0;

        res.json({ success: true, category });
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create category (Admin only)
export const createCategory = async (req, res) => {
    try {
        const { name, slug, description, icon, color } = req.body;

        const { data: category, error } = await supabase
            .from('categories')
            .insert({ name, slug, description, icon, color })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, category });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update category (Admin only)
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description, icon, color } = req.body;

        const { data: category, error } = await supabase
            .from('categories')
            .update({ name, slug, description, icon, color })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, category });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete category (Admin only)
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if category has posts
        const { count } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', id);

        if (count > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with existing posts'
            });
        }

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
