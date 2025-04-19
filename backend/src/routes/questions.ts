import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Get all answers for a specific question
// Returns answers with user details, comments and vote count
// GET /questions/:id/answers
router.get('/:id/answers', async (req, res) => {
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
router.post('/:id/answers', async (req, res) => {
  const { content } = req.body;
  const userId = req.body.userId; // Replace with auth middleware

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