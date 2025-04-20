import { PrismaClient } from './generated/prisma';

// Initialize a singleton PrismaClient instance
const prisma = new PrismaClient();

export { prisma }; 