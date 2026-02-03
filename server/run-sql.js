import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Supabase Database Migration Script\n');

// Initialize Supabase admin client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env file');
    process.exit(1);
}

console.log('✅ Supabase credentials loaded');
console.log(`   URL: ${supabaseUrl}\n`);

// Read SQL file
const sqlFile = path.join(__dirname, '..', 'COMPLETE-DATABASE-SETUP.sql');
console.log('📖 Reading SQL file...');
const sql = fs.readFileSync(sqlFile, 'utf8');
console.log(`✅ Loaded ${sql.length} characters\n`);

// Execute SQL via HTTP
async function executeSql() {
    try {
        console.log('🔧 Executing SQL via Supabase REST API...\n');

        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ query: sql })
        });

        if (response.ok) {
            console.log('✅ SQL executed successfully!');
        } else {
            const error = await response.text();
            console.log('⚠️  Response:', response.status, error);
            console.log('\n📝 Trying alternative method: Creating tables individually...\n');
            await createTablesDirectly();
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n📝 Trying alternative method...\n');
        await createTablesDirectly();
    }
}

async function createTablesDirectly() {
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('📋 Creating tables using Supabase client...\n');

    // Verify connection
    const { data, error } = await supabase.from('_metadata').select('*').limit(1);

    if (error && error.code === 'PGRST116') {
        console.log('✅ Supabase connection successful\n');
    }

    // Check if tables exist
    const tables = ['profiles', 'categories', 'posts', 'comments', 'likes', 'bookmarks'];

    for (const table of tables) {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`❌ Table "${table}" does not exist`);
        } else {
            console.log(`✅ Table "${table}" exists`);
        }
    }

    console.log('\n💡 Since direct API creation is limited, please run SQL manually:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz/sql/new');
    console.log('   2. Copy content from: COMPLETE-DATABASE-SETUP.sql');
    console.log('   3. Paste and click RUN');
    console.log('   4. Reload schema cache in API settings\n');
}

// Run
executeSql();
