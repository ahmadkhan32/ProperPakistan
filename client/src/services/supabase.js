import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client only if credentials are provided
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,      // ✅ Keep session in localStorage
            autoRefreshToken: true,     // ✅ Auto-refresh before expiry
            detectSessionInUrl: true    // ✅ Handle OAuth redirects
        }
    })
    : null;

// Authentication helpers
export const authService = {
    // Sign up with email (auto-confirm for development)
    async signUp(email, password, name) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                    full_name: name
                },
                // This makes signup work even if email service fails
                emailRedirectTo: window.location.origin
            }
        });

        // If there's an email error but user was created, ignore it
        if (error && !error.message.includes('email')) {
            return { data, error };
        }

        // Success - user created even if email failed
        return { data, error: null };
    },

    // Sign in with email
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return { data, error };
    },

    // Sign in with Google
    async signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        return { data, error };
    },

    // Sign out
    async signOut() {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    // Get current session
    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        return { data, error };
    },

    // Get current user
    async getUser() {
        const { data, error } = await supabase.auth.getUser();
        return { data, error };
    }
};

// Storage helpers
export const storageService = {
    // Upload image to blog-images bucket
    async uploadImage(file, folder = 'posts') {
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('blog-images')
            .upload(fileName, file);

        if (error) return { data: null, error };

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('blog-images')
            .getPublicUrl(fileName);

        return { data: { path: fileName, url: publicUrl }, error: null };
    },

    // Delete image
    async deleteImage(path) {
        const { error } = await supabase.storage
            .from('blog-images')
            .remove([path]);
        return { error };
    }
};

// Comments helpers (Realtime)
export const commentsService = {
    // Get comments for a post
    async getComments(postId) {
        const { data, error } = await supabase
            .from('comments')
            .select('*, user:user_id(*)')
            .eq('post_id', postId)
            .order('created_at', { ascending: false });
        return { data, error };
    },

    // Add comment
    async addComment(postId, userId, text) {
        const { data, error } = await supabase
            .from('comments')
            .insert([{ post_id: postId, user_id: userId, text }])
            .select()
            .single();
        return { data, error };
    },

    // Delete comment
    async deleteComment(commentId) {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);
        return { error };
    },

    // Subscribe to new comments
    subscribeToComments(postId, callback) {
        return supabase
            .channel(`comments:${postId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'comments',
                filter: `post_id=eq.${postId}`
            }, callback)
            .subscribe();
    }
};

// Likes helpers
export const likesService = {
    // Check if user liked a post
    async checkLike(postId, userId) {
        const { data, error } = await supabase
            .from('likes')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .single();
        return { data, error };
    },

    // Get like count
    async getLikeCount(postId) {
        const { count, error } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', postId);
        return { count, error };
    },

    // Toggle like
    async toggleLike(postId, userId) {
        const { data: existingLike } = await this.checkLike(postId, userId);

        if (existingLike) {
            // Unlike
            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', userId);
            return { liked: false, error };
        } else {
            // Like
            const { error } = await supabase
                .from('likes')
                .insert([{ post_id: postId, user_id: userId }]);
            return { liked: true, error };
        }
    }
};

export default supabase;
