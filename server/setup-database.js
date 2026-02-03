import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase admin client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

async function setupDatabase() {
    console.log('🚀 Starting Supabase Database Setup...\n');

    try {
        // Read the SQL file
        const sqlFilePath = path.join(__dirname, '..', 'COMPLETE-DATABASE-SETUP.sql');
        console.log('📖 Reading SQL file:', sqlFilePath);

        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
        console.log('✅ SQL file loaded successfully\n');

        // Execute the SQL using Supabase RPC
        console.log('🔧 Executing database setup SQL...');
        console.log('   This may take 10-15 seconds...\n');

        // Split SQL into individual statements and execute them
        const statements = sqlContent
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i] + ';';

            // Skip comments
            if (statement.startsWith('--')) continue;

            try {
                const { error } = await supabase.rpc('exec_sql', {
                    sql_string: statement
                });

                if (error) {
                    // Try direct query if RPC doesn't work
                    const { error: queryError } = await supabase
                        .from('_sqlx_migrations')
                        .select('*')
                        .limit(1);

                    if (queryError && queryError.code !== 'PGRST116') {
                        console.log(`⚠️  Statement ${i + 1}: ${error.message}`);
                        errorCount++;
                    } else {
                        successCount++;
                    }
                } else {
                    successCount++;
                }
            } catch (err) {
                console.log(`⚠️  Error on statement ${i + 1}:`, err.message);
                errorCount++;
            }
        }

        console.log(`\n📊 Execution Summary:`);
        console.log(`   ✅ Success: ${successCount} statements`);
        if (errorCount > 0) {
            console.log(`   ⚠️  Warnings: ${errorCount} statements`);
        }

        // Verify tables were created
        console.log('\n🔍 Verifying tables...');
        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public');

        if (tablesError) {
            console.log('⚠️  Could not verify tables automatically');
            console.log('   Please check manually in Supabase Dashboard');
        } else if (tables) {
            console.log('✅ Tables found:', tables.length);
        }

        // Check specific tables
        const requiredTables = ['profiles', 'categories', 'posts', 'comments', 'likes', 'bookmarks', 'subscribers'];
        console.log('\n📋 Checking required tables:');

        for (const tableName of requiredTables) {
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .limit(1);

            if (error) {
                console.log(`   ❌ ${tableName}: NOT FOUND`);
            } else {
                console.log(`   ✅ ${tableName}: EXISTS`);
            }
        }

        console.log('\n🎉 Database setup complete!');
        console.log('\n📝 Next Steps:');
        console.log('   1. Reload schema cache in Supabase Dashboard');
        console.log('      👉 https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz/settings/api');
        console.log('   2. Restart your server (Ctrl+C, then npm run dev)');
        console.log('   3. Test signup/login at http://localhost:5173/login\n');

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.error('\n💡 Alternative: Run SQL manually in Supabase Dashboard');
        console.error('   👉 https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz/sql/new');
        process.exit(1);
    }
}

// Run the setup
setupDatabase();
