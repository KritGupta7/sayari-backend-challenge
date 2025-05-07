import { prisma } from '../prisma';
import { CreateUserDto, UpdateUserDto } from '../types';
import { NotFoundError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../generated/prisma';

export class UserService {
  // Get all users with their questions and answers
  async getAllUsers() {
    // TODO: Consider pagination for large datasets
    return prisma.user.findMany({
      include: {
        questions: true,
        answers: true
      }
    });
  }

  // Get a specific user by ID
  async getUserById(id: string): Promise<User> {
    // Find user with nested data
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            answers: true
          }
        },
        answers: true
      }
    });

    // Handle not found case
    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  // Create a new user
  async createUser(data: CreateUserDto) {
    // Basic validation
    if (!data.email || !data.email.includes('@')) {
      throw new Error('Invalid email format');
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Generate a UUID for the user
    const id = uuidv4();

    // Map our DTO to Prisma's expected format
    const prismaUserData = {
      id,
      name: data.username,
      email: data.email
    };

    return prisma.user.create({
      data: prismaUserData
    });
  }

  // Update user details
  async updateUser(id: string, data: UpdateUserDto) {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    // Email uniqueness check if email is being updated
    if (data.email && data.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new Error('Email is already in use');
      }
    }

    // Map DTO fields to Prisma expected fields
    const prismaUpdateData: any = {};
    if (data.email) prismaUpdateData.email = data.email;
    if (data.username) prismaUpdateData.name = data.username;

    return prisma.user.update({
      where: { id },
      data: prismaUpdateData
    });
  }

  // Delete a user and all associated data
  async deleteUser(id: string) {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    // Delete cascade - need to handle manually due to foreign key constraints
    // First delete answers by the user
    await prisma.answer.deleteMany({
      where: { userId: id }
    });

    // Then delete questions
    await prisma.question.deleteMany({
      where: { userId: id }
    });

    // Finally delete the user
    return prisma.user.delete({
      where: { id }
    });
  }
} 