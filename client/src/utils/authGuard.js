import { supabase } from '../services/supabase';

/**
 * Session Guard - Checks if user has a valid Supabase session
 * This prevents dashboard from loading before session is restored
 * 
 * @returns {Promise<{session: Session | null, error: Error | null}>}
 */
export const checkUserSession = async () => {
    if (!supabase) {
        console.warn('Supabase not configured');
        return { session: null, error: new Error('Supabase not configured') };
    }

    try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.log('Session error:', error.message);
            return { session: null, error };
        }

        return { session: data.session, error: null };
    } catch (error) {
        console.error('Error checking session:', error);
        return { session: null, error };
    }
};

/**
 * Wait for session to be available with retries
 * Useful when session is being restored from localStorage
 * 
 * @param {number} maxRetries - Maximum number of retries (default: 5)
 * @param {number} delay - Delay between retries in ms (default: 200)
 * @returns {Promise<{session: Session | null, error: Error | null}>}
 */
export const waitForSession = async (maxRetries = 5, delay = 200) => {
    for (let i = 0; i < maxRetries; i++) {
        const { session, error } = await checkUserSession();
        
        if (session) {
            return { session, error: null };
        }

        // If it's the last retry, return the error
        if (i === maxRetries - 1) {
            return { session: null, error: error || new Error('Session not found after retries') };
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    return { session: null, error: new Error('Session check timeout') };
};

