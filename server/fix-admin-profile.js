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

async function fixAdminProfile() {
    console.log('🔍 Checking admin user and profile...\n');

    try {
        // Step 1: Get the admin user from auth.users
        console.log('1️⃣ Finding admin user in auth.users...');
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) {
            console.error('❌ Error listing users:', listError);
            return;
        }

        const adminUser = users.find(u => u.email === 'admin@properpakistan.com');

        if (!adminUser) {
            console.error('❌ Admin user not found in auth.users');
            console.log('   Please run: node create-admin.js first');
            return;
        }

        console.log('✅ Admin user found in auth.users');
        console.log('   ID:', adminUser.id);
        console.log('   Email:', adminUser.email);
        console.log('   Created:', adminUser.created_at);

        // Step 2: Check if profile exists
        console.log('\n2️⃣ Checking if profile exists...');
        const { data: existingProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', adminUser.id)
            .single();

        if (existingProfile) {
            console.log('✅ Profile already exists!');
            console.log('   ID:', existingProfile.id);
            console.log('   Name:', existingProfile.full_name);
            console.log('   Role:', existingProfile.role);

            if (existingProfile.role !== 'admin') {
                console.log('\n3️⃣ Updating role to admin...');
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ role: 'admin' })
                    .eq('id', adminUser.id);

                if (updateError) {
                    console.error('❌ Error updating role:', updateError);
                } else {
                    console.log('✅ Role updated to admin!');
                }
            }
        } else {
            // Profile doesn't exist, create it
            console.log('⚠️  Profile does not exist. Creating...');

            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                    id: adminUser.id,
                    full_name: adminUser.user_metadata?.name || 'Admin User',
                    avatar_url: adminUser.user_metadata?.avatar_url || null,
                    role: 'admin'
                })
                .select()
                .single();

            if (createError) {
                console.error('❌ Error creating profile:', createError);
                console.error('   Details:', createError.details);
                console.error('   Hint:', createError.hint);
            } else {
                console.log('✅ Profile created successfully!');
                console.log('   ID:', newProfile.id);
                console.log('   Name:', newProfile.full_name);
                console.log('   Role:', newProfile.role);
            }
        }

        // Step 3: Verify final state
        console.log('\n4️⃣ Final verification...');
        const { data: finalProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', adminUser.id)
            .single();

        if (finalProfile && finalProfile.role === 'admin') {
            console.log('✅ SUCCESS! Admin account is ready!');
            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🎉 You can now login with:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('   Email:    admin@properpakistan.com');
            console.log('   Password: Pakistan@2026');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('\n🔗 Go to: http://localhost:5173/login');
            console.log('   You will redirect to /dashboard\n');
        } else {
            console.error('❌ Something went wrong. Profile state is incorrect.');
        }

    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
}

fixAdminProfile();
