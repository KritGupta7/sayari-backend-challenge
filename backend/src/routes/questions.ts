import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { CreateAnswerBody, RouteParams } from '../types';

const router = Router();

// Get all answers for a specific question
// Returns answers with user details, comments and vote count
// GET /questions/:id/answers
router.get('/:id/answers', async (req: Request<RouteParams>, res: Response) => {
  try {
    const answers = await prisma.question.findUnique({
      where: { id: req.params.id },
      include: {
        answers: {
          include: {
            user: true,
            comments: true,
            votes: true
          }
        }
      }
    });

    if (!answers) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(answers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new answer to a question
// Requires: content in request body and user authentication
// POST /questions/:id/answers
router.post('/:id/answers', async (req: Request<RouteParams, {}, CreateAnswerBody>, res: Response) => {
  const { content, userId } = req.body;

  try {
    const answer = await prisma.answer.create({
      data: {
        content,
        userId,
        questionId: req.params.id
      },
      include: {
        user: true
      }
    });

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 