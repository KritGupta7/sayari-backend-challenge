import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { CreateUserDto, UpdateUserDto } from '../types';
import { AppError } from '../utils/errors';

// Initialize user service
const userService = new UserService();

export class UserController {
  // Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      
      // Simple response
      return res.json(users);
    } catch (err) {
      // Log error and return generic message
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  // Function expression style
  getUserById = async (req: Request, res: Response) => {
    const id = req.params.id;
    
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    try {
      const user = await userService.getUserById(id);
      return res.json(user);
    } catch (error) {
      // Handle different error types
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      } 
      
      // Default server error
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
  }

  // Create a new user
  async createUser(req: Request, res: Response) {
    // Get user data from body
    const userData = req.body;
    
    try {
      // Create the user and return 201 Created
      const user = await userService.createUser(userData);
      return res.status(201).json(user);
    } catch (err) {
      console.error('Create user error:', err);
      
      // Check error message for known validation issues
      const errMsg = err instanceof Error ? err.message : 'Failed to create user';
      
      if (errMsg.includes('already exists')) {
        return res.status(409).json({ error: errMsg });
      } else if (errMsg.includes('Invalid email')) {
        return res.status(400).json({ error: errMsg });
      }
      
      return res.status(500).json({ error: 'Failed to create user' });
    }
  }

  // Update an existing user
  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const updates = req.body;
    
    // Check if any updates were provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }
    
    try {
      // Update the user
      const updatedUser = await userService.updateUser(id, updates);
      return res.json(updatedUser);
    } catch (error) {
      // Error handling
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      // Handle known validation errors
      const errMsg = error instanceof Error ? error.message : '';
      if (errMsg.includes('already in use')) {
        return res.status(409).json({ error: errMsg });
      }
      
      return res.status(500).json({ error: 'Failed to update user' });
    }
  }

  // Delete a user and their content
  async deleteUser(req: Request, res: Response) {
    const id = req.params.id;
    
    try {
      await userService.deleteUser(id);
      
      // Return 204 No Content
      return res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }
} 