// Quick test script to debug sync endpoint
const testData = {
    supabaseId: "b5c8e9d5-7f3a-4e1b-9c2d-8a4f6e3b1c7e", // Test admin user ID
    email: "admin@properpakistan.com",
    name: "Admin User",
    avatar: ""
};

console.log('Testing sync endpoint...');
console.log('POST http://localhost:5000/api/auth/sync');
console.log('Body:', JSON.stringify(testData, null, 2));

fetch('http://localhost:5000/api/auth/sync', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(testData)
})
    .then(response => {
        console.log('\nResponse status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('\nResponse data:', JSON.stringify(data, null, 2));
    })
    .catch(error => {
        console.error('\nError:', error.message);
    });
