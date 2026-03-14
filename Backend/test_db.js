import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to: ', process.env.DATABASE_URL.replace(/:[^:]*@/, ':***@'));
  try {
    await prisma.$connect();
    console.log('Successfully connected to database!');
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
