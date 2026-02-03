import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// Protect routes - verify Supabase JWT token
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Please login.'
            });
        }

        try {
            // Verify token with Supabase
            const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);

            if (error || !supabaseUser) {
                console.error('Token verification failed:', error?.message);
                return res.status(401).json({
                    success: false,
                    message: 'Token is not valid or has expired'
                });
            }

            // Get user profile from Supabase profiles table
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', supabaseUser.id)
                .single();

            if (profileError) {
                console.error('Profile lookup error:', profileError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch user profile'
                });
            }

            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: 'User profile not found'
                });
            }

            // Attach user to request object
            req.user = {
                id: profile.id,
                email: profile.email,
                name: profile.full_name,
                role: profile.role,
                avatar: profile.avatar_url
            };
            req.supabaseUser = supabaseUser;

            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({
                success: false,
                message: 'Token verification failed'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication error occurred'
        });
    }
};

// Admin only middleware
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
};
