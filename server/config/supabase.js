import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('\n❌ CRITICAL ERROR: Supabase credentials not found!');
    console.error('   SUPABASE_URL:', supabaseUrl || 'MISSING');
    console.error('   SUPABASE_ANON_KEY:', supabaseKey ? 'EXISTS' : 'MISSING');
    console.error('\n   Solutions:');
    console.error('   1. Make sure .env file exists in server/ directory');
    console.error('   2. Verify .env contains SUPABASE_URL and SUPABASE_ANON_KEY');
    console.error('   3. Restart the server with: npm run dev\n');
    throw new Error('Supabase credentials missing');
}

console.log('✅ Supabase client initialized successfully\n');

export const supabase = createClient(supabaseUrl, supabaseKey);

export const handleSupabaseError = (error) => {
    if (error) {
        console.error('Supabase Error:', error.message);
        throw new Error(error.message);
    }
};

export default supabase;
