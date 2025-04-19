import { Request, Response } from 'express';
import { QuestionService } from '../services/questionService';
import { CreateQuestionDto, UpdateQuestionDto } from '../types';
import { AppError } from '../utils/errors';

// Create a service instance - could be improved with dependency injection later
const questionService = new QuestionService();

export class QuestionController {
  // Get all questions
  async getAllQuestions(_req: Request, res: Response) {
    try {
      const questions = await questionService.getAllQuestions();
      return res.json(questions);
    } catch (err) {
      console.log('Error fetching questions:', err);
      return res.status(500).json({ error: 'Failed to fetch questions' });
    }
  }

  // Get question by ID
  async getQuestionById(req: Request, res: Response) {
    const id = req.params.id;
    
    try {
      const question = await questionService.getQuestionById(id);
      return res.json(question);
    } catch (error) {
      // Check if it's our custom error
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      } 
      return res.status(500).json({ error: 'Failed to fetch question' });
    }
  }

  // Different implementation style - using function expression
  getQuestionsByUserId = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    
    try {
      // Get questions for this user
      const questions = await questionService.getQuestionsByUserId(userId);
      
      // Return empty array if no questions found
      if (!questions.length) {
        return res.json([]);
      }
      
      return res.json(questions);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch user questions' });
    }
  }

  // Create a new question
  async createQuestion(req: Request, res: Response) {
    try {
      // We need a userId and question data
      const { userId, ...questionData } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }
      
      const question = await questionService.createQuestion(questionData, userId);
      return res.status(201).json(question);
    } catch (err) {
      console.error('Create question error:', err);
      return res.status(500).json({ error: 'Failed to create question' });
    }
  }

  async updateQuestion(req: Request, res: Response) {
    const id = req.params.id;
    const updates = req.body;
    
    // No updates provided
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }
    
    try {
      const question = await questionService.updateQuestion(id, updates);
      return res.json(question);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Failed to update question' });
    }
  }

  async deleteQuestion(req: Request, res: Response) {
    try {
      await questionService.deleteQuestion(req.params.id);
      // Return 204 No Content
      return res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Failed to delete question' });
    }
  }

  // Add an answer to a question
  async addAnswer(req: Request, res: Response) {
    const questionId = req.params.id;
    const { content, userId } = req.body;
    
    // Validate request
    if (!content || !userId) {
      return res.status(400).json({ error: 'Content and userId are required' });
    }
    
    try {
      const answer = await questionService.addAnswer(questionId, content, userId);
      return res.status(201).json(answer);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Failed to add answer' });
    }
  }
} 