import dotenv from 'dotenv';
import botProtectionService from './src/services/botProtectionService.js';

dotenv.config();

async function testBotProtection() {
  console.log('🔍 Testing Bot Protection Service');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('RECAPTCHA_SECRET_KEY:', process.env.RECAPTCHA_SECRET_KEY ? 'SET' : 'NOT SET');
  
  // Mock request object
  const mockReq = {
    ip: '127.0.0.1',
    connection: { remoteAddress: '127.0.0.1' },
    get: (header) => {
      if (header === 'User-Agent') return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
      return null;
    }
  };
  
  // Test data with valid captcha token
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1234567890',
    captchaToken: 'test-captcha-token-123',
    botProtection: {
      captchaToken: 'test-captcha-token-123',
      behaviorScore: 85,
      honeypotValue: '',
      analytics: {
        formDuration: 45000,
        keystrokes: 150,
        mouseMovements: 25,
        focusEvents: 8
      }
    }
  };
  
  try {
    console.log('\n📊 Running bot protection check...');
    const result = await botProtectionService.performBotProtectionCheck(mockReq, testData);
    
    console.log('\n✅ Bot Protection Result:');
    console.log('Is Bot:', result.isBot);
    console.log('Confidence:', result.confidence);
    console.log('Reason:', result.reason);
    console.log('Suspicion Score:', result.suspicionScore);
    console.log('Checks:', JSON.stringify(result.checks, null, 2));
    
    // Test without captcha token
    console.log('\n\n🚫 Testing without captcha token...');
    const testDataNoToken = { ...testData };
    delete testDataNoToken.captchaToken;
    delete testDataNoToken.botProtection.captchaToken;
    
    const resultNoToken = await botProtectionService.performBotProtectionCheck(mockReq, testDataNoToken);
    console.log('Without Token - Is Bot:', resultNoToken.isBot);
    console.log('Without Token - Confidence:', resultNoToken.confidence);
    console.log('Without Token - Reason:', resultNoToken.reason);
    
  } catch (error) {
    console.error('❌ Error testing bot protection:', error.message);
    console.error(error.stack);
  }
}

testBotProtection();
