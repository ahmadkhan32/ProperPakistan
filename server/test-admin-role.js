// Test the actual sync endpoint with real admin user ID
const adminUserId = '9e56ed5e-f70d-4d82-b3d7-089823dd35b3';

const testData = {
    supabaseId: adminUserId,
    email: "admin@properpakistan.com",
    name: "Admin User",
    avatar: ""
};

console.log('Testing sync endpoint with admin user...');
console.log('POST http://localhost:5000/api/auth/sync');

fetch('http://localhost:5000/api/auth/sync', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(testData)
})
    .then(response => response.json())
    .then(data => {
        console.log('\n✅ RESPONSE:', JSON.stringify(data, null, 2));

        if (data.success && data.user) {
            console.log('\n🔍 USER ROLE:', data.user.role);

            if (data.user.role === 'admin') {
                console.log('✅ BACKEND IS RETURNING ADMIN ROLE CORRECTLY!');
            } else {
                console.log('❌ BACKEND IS RETURNING WRONG ROLE:', data.user.role);
                console.log('   Expected: admin');
                console.log('   Got:', data.user.role);
            }
        } else {
            console.log('❌ SYNC FAILED:', data.message);
        }
    })
    .catch(error => {
        console.error('\n❌ ERROR:', error.message);
    });
