import { useState, useEffect } from 'react';
import { authService, supabase } from '../services/supabase';
import { apiService } from '../services/api';
import { AuthContext } from './AuthContextValue';

// AuthProvider component - provides authentication context to the app
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [supabaseUser, setSupabaseUser] = useState(null);
    const [authTimeout, setAuthTimeout] = useState(false);

    useEffect(() => {
        // Timeout fallback - if auth takes too long, show app anyway
        const timeoutId = setTimeout(() => {
            if (loading) {
                console.warn('⏰ Auth timeout - loading app anyway');
                setAuthTimeout(true);
                setLoading(false);
            }
        }, 5000); // 5 second timeout

        // Check if Supabase is configured
        if (!supabase) {
            console.warn('Supabase not configured. Authentication features will be disabled.');
            setLoading(false);
            clearTimeout(timeoutId);
            return;
        }

        // Check for existing session
        checkUser();

        return () => clearTimeout(timeoutId);

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('🔔 Auth state change:', event, session?.user?.email || 'no user');

                // Handle token refresh
                if (event === 'TOKEN_REFRESHED' && session?.user) {
                    console.log('🔄 Token refreshed, re-syncing user');
                    await syncUserWithBackend(session.user);
                    return;
                }

                // Handle sign out
                if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setSupabaseUser(null);
                    localStorage.removeItem('token');
                    return;
                }

                // Handle user session
                if (session?.user) {
                    // Store Supabase token FIRST before syncing
                    if (session.access_token) {
                        localStorage.setItem('token', session.access_token);
                        console.log('✅ Supabase token stored from auth state change');
                    }
                    await syncUserWithBackend(session.user);
                } else if (!session && event !== 'TOKEN_REFRESHED') {
                    // Only clear if no session and it's not a token refresh
                    // This prevents clearing during token refresh operations
                    setUser(null);
                    setSupabaseUser(null);
                    localStorage.removeItem('token');
                }
            }
        );

        return () => subscription?.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkUser = async () => {
        try {
            const { data: { session } } = await authService.getSession();
            if (session?.user) {
                // CRITICAL: Store Supabase token FIRST before any API calls
                if (session.access_token) {
                    localStorage.setItem('token', session.access_token);
                    console.log('✅ Supabase token stored from checkUser');
                }
                await syncUserWithBackend(session.user);
            }
        } catch (error) {
            console.error('Error checking user:', error);
        } finally {
            // IMPORTANT: Only set loading false AFTER sync completes
            // This prevents redirect loop during session restore
            setLoading(false);
        }
    };

    const syncUserWithBackend = async (supabaseUserData) => {
        console.log('🔄 Starting sync for user:', supabaseUserData.email);

        try {
            setSupabaseUser(supabaseUserData);

            // Get the Supabase access token for API requests
            const { data: { session } } = await authService.getSession();
            const supabaseToken = session?.access_token;

            if (supabaseToken) {
                // Store the Supabase token for API requests
                localStorage.setItem('token', supabaseToken);
                console.log('✅ Supabase access token stored');
            }

            console.log('📡 Calling backend sync API...');
            const response = await apiService.syncUser({
                supabaseId: supabaseUserData.id,
                email: supabaseUserData.email,
                name: supabaseUserData.user_metadata?.name || supabaseUserData.email.split('@')[0],
                avatar: supabaseUserData.user_metadata?.avatar_url || ''
            });

            console.log('✅ Backend response received:', response.data);

            if (response.data.success) {
                console.log('✅ Sync successful! User role:', response.data.user.role);
                setUser(response.data.user);
                console.log('✅ User state updated with role:', response.data.user.role);
                return; // Exit early on success
            } else {
                console.warn('⚠️ Backend returned success:false');
            }
        } catch (error) {
            console.error('❌ Error syncing user:', error);
            console.error('❌ Error type:', error.constructor.name);
            console.error('❌ Error message:', error.message);

            // Check if we have a response despite the error
            if (error.response?.data?.success) {
                console.log('✅ Found valid response in error object!');
                setUser(error.response.data.user);
                console.log('✅ User set from error response with role:', error.response.data.user.role);
                return;
            }

            console.warn('⚠️ Using fallback user data (role will be "user")');
            // IMPORTANT: Even if backend sync fails, set user from Supabase data
            // This prevents redirect loops when backend has issues
            const fallbackUser = {
                id: supabaseUserData.id,
                email: supabaseUserData.email,
                name: supabaseUserData.user_metadata?.name || supabaseUserData.email.split('@')[0],
                avatar: supabaseUserData.user_metadata?.avatar_url || '',
                role: 'user' // Default role, will be updated when backend sync works
            };

            setUser(fallbackUser);
        }
    };

    const signUp = async (email, password, name) => {
        const { data, error } = await authService.signUp(email, password, name);
        if (error) throw error;
        return data;
    };

    const signIn = async (email, password) => {
        const { data, error } = await authService.signIn(email, password);
        if (error) throw error;
        return data;
    };

    const signInWithGoogle = async () => {
        const { data, error } = await authService.signInWithGoogle();
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        await authService.signOut();
        setUser(null);
        setSupabaseUser(null);
        localStorage.removeItem('token');
    };

    const value = {
        user,
        supabaseUser,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        isAdmin: user?.role === 'admin'
    };

    // Debug logging to track auth state changes
    useEffect(() => {
        console.log('👤 Auth State:', {
            loading,
            hasUser: !!user,
            userRole: user?.role,
            isAdmin: user?.role === 'admin'
        });
    }, [loading, user]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
