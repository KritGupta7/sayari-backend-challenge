import { prisma } from '../prisma';
import { CreateQuestionDto, UpdateQuestionDto } from '../types';
import { NotFoundError } from '../utils/errors';
import { CreateAnswerDto } from '../types/answers';
import { v4 as uuidv4 } from 'uuid';
import { Question, Answer } from '../generated/prisma';

export class QuestionService {
  // Get all questions with related data
  async getAllQuestions(limit?: number, offset?: number) {
    // Support pagination but default to all records if not specified
    try {
      return prisma.question.findMany({
        ...(limit ? { take: limit } : {}),
        ...(offset ? { skip: offset } : {}),
        include: {
          user: true,
          comments: {
            include: {
              user: true
            }
          },
          answers: {
            include: {
              user: true,
              comments: {
                include: {
                  user: true
                }
              }
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
  async getQuestionById(id: string): Promise<Question> {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        user: true,
        comments: {
          include: {
            user: true
          }
        },
        answers: {
          include: {
            user: true,
            comments: {
              include: {
                user: true
              }
            }
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
        comments: {
          include: {
            user: true
          }
        },
        answers: {
          include: {
            user: true,
            comments: {
              include: {
                user: true
              }
            }
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

    // Generate a unique ID for the question
    const id = uuidv4();

    return prisma.question.create({
      data: {
        id,
        title: data.title,
        content: data.content,
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
  async addAnswer(questionId: string, data: CreateAnswerDto): Promise<Answer> {
    // Generate a unique ID for the answer
    const id = uuidv4();

    return prisma.answer.create({
      data: {
        id,
        content: data.content,
        userId: data.userId,
        questionId
      },
      include: {
        user: true
      }
    }) as Promise<Answer>;
  }

  async getAnswersByUserId(userId: string) {
    return prisma.answer.findMany({
      where: { userId },
      include: {
        question: true,
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
} 