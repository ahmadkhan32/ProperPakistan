import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

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

async function createAdminUser() {
    console.log('🚀 Creating Test Admin Account...\n');

    const testUser = {
        email: 'admin@properpakistan.com',
        password: 'Pakistan@2026',
        name: 'Admin User'
    };

    try {
        // Step 1: Create user using Admin API
        console.log('📝 Creating user in Supabase Auth...');
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: testUser.email,
            password: testUser.password,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
                name: testUser.name,
                full_name: testUser.name
            }
        });

        if (authError) {
            if (authError.message.includes('already registered')) {
                console.log('⚠️  User already exists. Fetching existing user...');

                // Get existing user
                const { data: users } = await supabase.auth.admin.listUsers();
                const existingUser = users.users.find(u => u.email === testUser.email);

                if (existingUser) {
                    console.log('✅ Found existing user:', existingUser.id);

                    // Update to admin role
                    const { error: updateError } = await supabase
                        .from('profiles')
                        .update({ role: 'admin' })
                        .eq('id', existingUser.id);

                    if (updateError) {
                        console.log('⚠️  Profile update error:', updateError.message);
                    } else {
                        console.log('✅ Updated to admin role');
                    }
                }
            } else {
                throw authError;
            }
        } else {
            console.log('✅ User created:', authData.user.id);

            // Step 2: Update profile to admin role
            console.log('\n🔧 Setting admin role...');
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', authData.user.id);

            if (profileError) {
                console.log('⚠️  Profile update error:', profileError.message);
                console.log('   Trying alternative method...');

                // Give it a moment for the trigger to create the profile
                await new Promise(resolve => setTimeout(resolve, 2000));

                const { error: retryError } = await supabase
                    .from('profiles')
                    .update({ role: 'admin' })
                    .eq('id', authData.user.id);

                if (!retryError) {
                    console.log('✅ Admin role set successfully!');
                }
            } else {
                console.log('✅ Admin role set successfully!');
            }
        }

        // Step 3: Verify admin status
        console.log('\n🔍 Verifying admin account...');
        const { data: users } = await supabase.auth.admin.listUsers();
        const user = users.users.find(u => u.email === testUser.email);

        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profile) {
                console.log('✅ Profile verified:');
                console.log('   ID:', profile.id);
                console.log('   Name:', profile.full_name);
                console.log('   Role:', profile.role);
            }
        }

        console.log('\n🎉 SUCCESS! Test Admin Account Ready!\n');
        console.log('━'.repeat(50));
        console.log('📋 LOGIN CREDENTIALS:');
        console.log('━'.repeat(50));
        console.log(`   Email:    ${testUser.email}`);
        console.log(`   Password: ${testUser.password}`);
        console.log('━'.repeat(50));
        console.log('\n🔗 Next Steps:');
        console.log('   1. Go to: http://localhost:5173/login');
        console.log('   2. Click "Sign In"');
        console.log('   3. Enter the credentials above');
        console.log('   4. You will be redirected to /dashboard');
        console.log('\n✨ Enjoy testing your dashboard!\n');

    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        console.error('\n💡 Make sure:');
        console.error('   1. Database tables are created');
        console.error('   2. SUPABASE_SERVICE_KEY is set in .env');
        console.error('   3. Email confirmation is disabled in Supabase Auth settings');
        process.exit(1);
    }
}

createAdminUser();
