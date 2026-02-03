import supabase from '../config/supabase.js';
import jwt from 'jsonwebtoken';

// Sync Supabase user with backend
export const syncUser = async (req, res) => {
    try {
        console.log('🔍 Sync user request received:', req.body);
        const { supabaseId, email, name, avatar } = req.body;

        if (!supabaseId || !email) {
            console.error('❌ Missing required fields:', { supabaseId, email });
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: supabaseId and email are required'
            });
        }

        console.log('📝 Checking if profile exists for user:', supabaseId);

        // Try to get the user profile
        const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseId)
            .maybeSingle(); // Use maybeSingle() instead of single() to avoid errors if not found

        console.log('📋 Profile fetch result:', { exists: !!existingProfile, error: fetchError?.message });

        let user = existingProfile;

        // If profile doesn't exist, create it
        if (!existingProfile) {
            console.log('🆕 Profile not found, creating new profile...');

            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                    id: supabaseId,
                    full_name: name || email.split('@')[0],
                    avatar_url: avatar || null,
                    role: 'user' // Default role, admin must be set manually
                })
                .select()
                .single();

            if (createError) {
                console.error('❌ Create error:', createError);
                // If creation fails, it might be because trigger already created it
                // Try fetching one more time
                const { data: retryProfile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', supabaseId)
                    .maybeSingle();

                user = retryProfile;
            } else {
                console.log('✅ Profile created successfully');
                user = newProfile;
            }
        } else {
            // Profile exists, optionally update it
            console.log('✅ Profile found, updating info...');
            const { data: updatedProfile, error: updateError } = await supabase
                .from('profiles')
                .update({
                    full_name: name || existingProfile.full_name,
                    avatar_url: avatar || existingProfile.avatar_url
                })
                .eq('id', supabaseId)
                .select()
                .single();

            if (!updateError && updatedProfile) {
                user = updatedProfile;
                console.log('✅ Profile updated');
            } else {
                // Update failed, use existing profile
                user = existingProfile;
                console.log('⚠️ Update skipped, using existing profile');
            }
        }

        // Final check - do we have a user?
        if (!user) {
            console.error('❌ No user profile available after all attempts');
            return res.status(500).json({
                success: false,
                message: 'Could not create or fetch user profile'
            });
        }

        console.log('✅ User ready:', { id: user.id, name: user.full_name, role: user.role });

        // Instead of creating our own JWT, we'll tell the frontend to use the Supabase token
        // The frontend should send the Supabase access_token in the Authorization header
        // Our protect middleware will validate it with Supabase

        const responseData = {
            success: true,
            user: {
                id: user.id,
                name: user.full_name,
                email: email,
                avatar: user.avatar_url,
                role: user.role
            },
            // Return a dummy token for compatibility
            // Frontend should use Supabase session.access_token instead
            token: 'use-supabase-access-token'
        };

        console.log('✅ Sending success response');
        res.json(responseData);

    } catch (error) {
        console.error('❌ SYNC ERROR:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Internal server error: ' + error.message
        });
    }
};

// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error) throw error;

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                avatar: user.avatar_url,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { name, avatar } = req.body;

        const { data: user, error } = await supabase
            .from('profiles')
            .update({
                full_name: name,
                avatar_url: avatar
            })
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                avatar: user.avatar_url,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle bookmark
export const toggleBookmark = async (req, res) => {
    try {
        const { postId } = req.body;

        // Check if bookmark exists
        const { data: existing } = await supabase
            .from('bookmarks')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', req.user.id)
            .single();

        if (existing) {
            // Remove bookmark
            await supabase
                .from('bookmarks')
                .delete()
                .eq('id', existing.id);

            res.json({ success: true, bookmarked: false });
        } else {
            // Add bookmark
            await supabase
                .from('bookmarks')
                .insert({
                    post_id: postId,
                    user_id: req.user.id
                });

            res.json({ success: true, bookmarked: true });
        }
    } catch (error) {
        console.error('Toggle bookmark error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user bookmarks
export const getUserBookmarks = async (req, res) => {
    try {
        const { data: bookmarks, error } = await supabase
            .from('bookmarks')
            .select(`
        *,
        post:posts(
          *,
          category:categories(*),
          author:profiles(id, full_name, avatar_url)
        )
      `)
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            bookmarks: bookmarks?.map(b => b.post) || []
        });
    } catch (error) {
        console.error('Get bookmarks error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            users: users.map(u => ({
                id: u.id,
                name: u.full_name,
                email: u.email,
                avatar: u.avatar_url,
                role: u.role,
                createdAt: u.created_at
            }))
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
