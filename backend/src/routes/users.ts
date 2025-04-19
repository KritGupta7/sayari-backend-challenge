import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { RouteParams } from '../types';

const router = Router();

// Get all questions posted by a user
// Returns questions with their answers, tags and votes
// GET /users/:id/questions
router.get('/:id/questions', async (req: Request<RouteParams>, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        questions: {
          include: {
            answers: true,
            tags: true,
            votes: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.questions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a user and all their associated data
// Requires admin privileges
// DELETE /users/:id
router.delete('/:id', async (req: Request<RouteParams>, res: Response) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 