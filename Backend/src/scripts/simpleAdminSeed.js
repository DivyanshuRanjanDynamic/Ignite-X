// Simple Admin Seeding Script - SECURE VERSION
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { getAuthorizedAdminEmails } from '../middleware/adminAuth.js';

const prisma = new PrismaClient();

// SECURITY: Only these pre-defined admins are allowed - matches adminAuth.js whitelist
const PREDEFINED_ADMINS = [
  {
    firstName: 'Divyanshu',
    lastName: 'Ranjan',
    email: 'divyanshuchannel2@gmail.com',
    password: '914214dD*',
    phone: '+91-9955823240',
    department: 'Administration',
    designation: 'Lead Administrator',
  },
  {
    firstName: 'System',
    lastName: 'Manager',
    email: 'singhmanvi5983@gmail.com', 
    password: 'singhmanvi5983@gmail.com',
    phone: '+91-9876543211',
    department: 'IT Operations',
    designation: 'System Manager',
  },
  {
    firstName: 'Data',
    lastName: 'Analyst',
    email: 'analyst@pminternship.gov.in',
    password: 'DataAnalyst@2024!PM#',
    phone: '+91-9876543212',
    department: 'Analytics',
    designation: 'Data Analyst',
  },
  {
    firstName: 'Operations',
    lastName: 'Manager',
    email: 'operations@pminternship.gov.in',
    password: 'OpsManager@2024!PM#',
    phone: '+91-9876543213',
    department: 'Operations',
    designation: 'Operations Manager',
  }
];

// Validate that all seeded admins are in the authorized whitelist
const authorizedEmails = getAuthorizedAdminEmails();
const seedEmails = PREDEFINED_ADMINS.map(admin => admin.email.toLowerCase());
const unauthorizedSeeds = seedEmails.filter(email => !authorizedEmails.includes(email));

if (unauthorizedSeeds.length > 0) {
  console.error('❌ SECURITY ERROR: Seeded admin emails not in authorized whitelist:', unauthorizedSeeds);
  console.error('Update the adminAuth.js whitelist to include these emails or remove them from seeding.');
  process.exit(1);
}

async function seedAdmins() {
  console.log('🌱 Starting admin account seeding...');

  for (const adminData of PREDEFINED_ADMINS) {
    try {
      // Check if admin already exists
      const existingAdmin = await prisma.user.findUnique({
        where: { email: adminData.email.toLowerCase() }
      });

      if (existingAdmin) {
        console.log(`⚡ Admin already exists, updating: ${adminData.email}`);
        
        // Hash password
        const hashedPassword = await bcryptjs.hash(adminData.password, 12);
        
        // Update existing admin
        await prisma.user.update({
          where: { id: existingAdmin.id },
          data: {
            firstName: adminData.firstName,
            lastName: adminData.lastName,
            password: hashedPassword,
            role: 'ADMIN',
            phone: adminData.phone,
            status: 'ACTIVE',
            isVerified: true,
            isActive: true,
            emailVerifiedAt: new Date(),
          }
        });
        
        // Update or create profile
        const existingProfile = await prisma.profile.findUnique({
          where: { userId: existingAdmin.id }
        });
        
        if (existingProfile) {
          await prisma.profile.update({
            where: { userId: existingAdmin.id },
            data: {
              bio: `${adminData.designation} in ${adminData.department}`,
            }
          });
        } else {
          await prisma.profile.create({
            data: {
              userId: existingAdmin.id,
              bio: `${adminData.designation} in ${adminData.department}`,
              skills: [],
              interests: [],
              languages: ['English'],
            }
          });
        }
        
        console.log(`✅ Updated admin: ${adminData.email} (${adminData.designation})`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcryptjs.hash(adminData.password, 12);

      // Create admin user
      const newAdmin = await prisma.user.create({
        data: {
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email.toLowerCase(),
          password: hashedPassword,
          role: 'ADMIN',
          phone: adminData.phone,
          status: 'ACTIVE',
          isVerified: true,
          isActive: true,
          emailVerifiedAt: new Date(),
        },
      });

      // Create admin profile
      await prisma.profile.create({
        data: {
          userId: newAdmin.id,
          bio: `${adminData.designation} in ${adminData.department}`,
          skills: [],
          interests: [],
          languages: ['English'],
        },
      });

      console.log(`✅ Created admin: ${adminData.email} (${adminData.designation})`);

    } catch (adminError) {
      console.error(`❌ Failed to create admin ${adminData.email}:`, adminError.message);
    }
  }

  console.log('🎉 Admin seeding completed!');
}

// Run the seeder
seedAdmins()
  .then(async () => {
    await prisma.$disconnect();
    console.log('🏁 Admin seeding script completed');
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('💀 Admin seeding script failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
