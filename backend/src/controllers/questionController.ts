import { Request, Response, NextFunction } from 'express';
import { QuestionService } from '../services/questionService';
import { CreateQuestionDto, UpdateQuestionDto } from '../types';
import { CreateAnswerDto } from '../types/answers';
import { AppError } from '../utils/errors';

// Create a service instance - could be improved with dependency injection later
const questionService = new QuestionService();

export class QuestionController {
  // Get all questions
  async getAllQuestions(req: Request, res: Response) {
    try {
      // Extract pagination parameters from query
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      
      const questions = await questionService.getAllQuestions(limit, offset);
      res.json(questions);
    } catch (err) {
      console.log('Error fetching questions:', err);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  }

  // Get question by ID
  async getQuestionById(req: Request, res: Response) {
    const id = req.params.id;
    
    try {
      const question = await questionService.getQuestionById(id);
      res.json(question);
    } catch (error) {
      // Check if it's our custom error
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch question' });
      }
    }
  }

  //implementation style - using function expression
  getQuestionsByUserId = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    
    try {
      // Get questions for this user
      const questions = await questionService.getQuestionsByUserId(userId);
      
      // Return empty array if no questions found
      if (!questions.length) {
        res.json([]);
        return;
      }
      
      res.json(questions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch user questions' });
    }
  }

  // Create a new question
  async createQuestion(req: Request, res: Response) {
    try {
      // We need a userId and question data
      const { userId, ...questionData } = req.body;
      
      if (!userId) {
        res.status(400).json({ error: 'userId is required' });
        return;
      }
      
      const question = await questionService.createQuestion(questionData, userId);
      res.status(201).json(question);
    } catch (err) {
      console.error('Create question error:', err);
      res.status(500).json({ error: 'Failed to create question' });
    }
  }

  async updateQuestion(req: Request, res: Response) {
    const id = req.params.id;
    const updates = req.body;
    
    // No updates provided
    if (!updates || Object.keys(updates).length === 0) {
      res.status(400).json({ error: 'No updates provided' });
      return;
    }
    
    try {
      const question = await questionService.updateQuestion(id, updates);
      res.json(question);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update question' });
      }
    }
  }

  async deleteQuestion(req: Request, res: Response) {
    try {
      await questionService.deleteQuestion(req.params.id);
      // Return 204 No Content
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete question' });
      }
    }
  }

  // Add an answer to a question
  async addAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.id;
      const { content, userId } = req.body;
      
      const answer = await questionService.addAnswer(questionId, { content, userId });
      res.status(201).json(answer);
    } catch (error) {
      next(error);
    }
  }

  async getAnswersByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const answers = await questionService.getAnswersByUserId(userId);
      res.json(answers);
    } catch (error) {
      next(error);
    }
  }
} 