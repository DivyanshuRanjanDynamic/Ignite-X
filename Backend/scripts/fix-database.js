import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function fixDatabase() {
  try {
    console.log('🔧 Starting database cleanup and migration...');

    // Connect to database
    await prisma.$connect();
    console.log('✅ Connected to database');

    // Check for existing users with duplicate phone numbers
    console.log('🔍 Checking for duplicate phone numbers...');
    
    // First, let's see what users exist
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });

    console.log(`Found ${users.length} existing users:`);
    users.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Phone: ${user.phone || 'none'} - Role: ${user.role}`);
    });

    // Check for phone duplicates
    const phoneGroups = {};
    users.forEach(user => {
      if (user.phone) {
        if (!phoneGroups[user.phone]) {
          phoneGroups[user.phone] = [];
        }
        phoneGroups[user.phone].push(user);
      }
    });

    // Fix duplicates by setting phone to null for duplicate entries (keeping the first one)
    for (const [phone, userGroup] of Object.entries(phoneGroups)) {
      if (userGroup.length > 1) {
        console.log(`🔧 Found duplicate phone ${phone} for ${userGroup.length} users`);
        
        // Keep first user's phone, remove from others
        for (let i = 1; i < userGroup.length; i++) {
          await prisma.user.update({
            where: { id: userGroup[i].id },
            data: { phone: null }
          });
          console.log(`   - Removed phone from user: ${userGroup[i].email}`);
        }
      }
    }

    // Clean up duplicate refresh tokens
    console.log('🔍 Checking for duplicate refresh tokens...');
    
    const refreshTokens = await prisma.refreshToken.findMany({
      select: { id: true, token: true, userId: true }
    });

    const tokenGroups = {};
    refreshTokens.forEach(token => {
      if (!tokenGroups[token.token]) {
        tokenGroups[token.token] = [];
      }
      tokenGroups[token.token].push(token);
    });

    // Delete duplicate refresh tokens (keep the first one)
    for (const [tokenValue, tokenGroup] of Object.entries(tokenGroups)) {
      if (tokenGroup.length > 1) {
        console.log(`🔧 Found duplicate token for ${tokenGroup.length} entries`);
        
        // Delete all but the first token
        for (let i = 1; i < tokenGroup.length; i++) {
          await prisma.refreshToken.delete({
            where: { id: tokenGroup[i].id }
          });
          console.log(`   - Deleted duplicate token for user: ${tokenGroup[i].userId}`);
        }
      }
    }

    console.log('✅ Database cleanup completed');
    console.log('🚀 Schema changes ready to be pushed...');

    await prisma.$disconnect();
    console.log('📋 Schema push ready. Please run: npm run prisma:push');
    
  } catch (error) {
    console.error('❌ Database fix failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixDatabase()
  .then(() => {
    console.log('🎉 Database fix completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database fix failed:', error);
    process.exit(1);
  });
