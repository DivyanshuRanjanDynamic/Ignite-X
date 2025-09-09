// Test script to verify admin OAuth whitelist functionality
import { isAuthorizedAdmin } from './src/middleware/adminAuth.js';

console.log('🧪 Testing Admin OAuth Whitelist...\n');

// Test authorized admin emails
const authorizedEmails = [
  'divyanshuchannel2@gmail.com',
  'singhmanvi5983@gmail.com',
  'analyst@pminternship.gov.in', 
  'operations@pminternship.gov.in'
];

// Test unauthorized emails
const unauthorizedEmails = [
  'random@example.com',
  'student@university.edu',
  'hacker@malicious.com',
  'admin@fake.com'
];

console.log('✅ AUTHORIZED ADMIN EMAILS:');
authorizedEmails.forEach(email => {
  const isAuth = isAuthorizedAdmin(email);
  console.log(`   ${email}: ${isAuth ? '✅ ALLOWED' : '❌ DENIED'}`);
});

console.log('\n❌ UNAUTHORIZED EMAILS:');  
unauthorizedEmails.forEach(email => {
  const isAuth = isAuthorizedAdmin(email);
  console.log(`   ${email}: ${isAuth ? '⚠️  ALLOWED (ERROR!)' : '✅ CORRECTLY DENIED'}`);
});

console.log('\n📊 TEST RESULTS:');
const authResults = authorizedEmails.map(email => isAuthorizedAdmin(email));
const unauthResults = unauthorizedEmails.map(email => isAuthorizedAdmin(email));

const authPassed = authResults.every(result => result === true);
const unauthPassed = unauthResults.every(result => result === false);

console.log(`   Authorized emails test: ${authPassed ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`   Unauthorized emails test: ${unauthPassed ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`   Overall: ${authPassed && unauthPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

if (authPassed && unauthPassed) {
  console.log('\n🎉 Admin OAuth whitelist is working correctly!');
  console.log('✅ Only seeded admin emails can use OAuth for admin login.');
} else {
  console.log('\n🚨 Admin OAuth whitelist has issues!');
  console.log('⚠️  Please check the adminAuth.js whitelist configuration.');
  process.exit(1);
}
