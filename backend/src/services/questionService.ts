import { prisma } from '../prisma';
import { CreateQuestionDto, UpdateQuestionDto } from '../types';
import { NotFoundError } from '../utils/errors';

export class QuestionService {
  // Get all questions with related data
  async getAllQuestions() {
    // TODO: Add pagination
    try {
      return prisma.question.findMany({
        include: {
          user: true,
          answers: {
            include: {
              user: true
            }
          }
        }
      });
    } catch (err) {
      console.error('Error getting questions:', err);
      throw err;
    }
  }

  // Get a single question with details
  async getQuestionById(id: string) {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        user: true,
        answers: {
          include: {
            user: true
          }
        }
      }
    });

    if (!question) {
      throw new NotFoundError('Question');
    }

    return question;
  }

  // Get questions from a specific user
  async getQuestionsByUserId(userId: string) {
    // This could be optimized for larger datasets
    return prisma.question.findMany({
      where: { userId },
      include: {
        user: true,
        answers: {
          include: {
            user: true
          }
        }
      }
    });
  }

  // Create a new question
  async createQuestion(data: CreateQuestionDto, userId: string) {
    // Make sure we have required fields
    if (!data.title || !data.content) {
      throw new Error('Missing required fields');
    }

    return prisma.question.create({
      data: {
        ...data,
        userId
      },
      include: {
        user: true
      }
    });
  }

  // Update an existing question
  async updateQuestion(id: string, data: UpdateQuestionDto) {
    // Check if question exists first
    const question = await prisma.question.findUnique({
      where: { id }
    });

    if (!question) {
      throw new NotFoundError('Question');
    }

    // Apply updates
    return prisma.question.update({
      where: { id },
      data,
      include: {
        user: true
      }
    });
  }

  // Delete a question and its answers
  async deleteQuestion(id: string) {
    // First check if question exists
    const question = await prisma.question.findUnique({
      where: { id }
    });

    if (!question) {
      throw new NotFoundError('Question');
    }

    // Need to delete answers first (database constraint)
    await prisma.answer.deleteMany({
      where: { questionId: id }
    });

    // Then delete the question
    return prisma.question.delete({
      where: { id }
    });
  }

  // Add a new answer to a question
  async addAnswer(questionId: string, content: string, userId: string) {
    // Make sure question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      throw new NotFoundError('Question');
    }

    // Create the answer
    return prisma.answer.create({
      data: {
        content,
        userId,
        questionId
      },
      include: {
        user: true
      }
    });
  }
} 