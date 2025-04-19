import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

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

router.post('/:id/answers', async (req, res) => {
  const { content } = req.body;
  const userId = req.body.userId; // TODO: Get from auth token

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