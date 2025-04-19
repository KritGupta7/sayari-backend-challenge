import { Router } from 'express';
import { QuestionController } from '../controllers/questionController';
import { validateBody, validateId } from '../middleware/validate';
import { isCreateQuestionDto, isUpdateQuestionDto } from '../types';

// Create router and controller instance
const router = Router();
const questionController = new QuestionController();

// ROUTES

// GET routes
router.get('/', questionController.getAllQuestions.bind(questionController));
router.get('/:id', validateId, questionController.getQuestionById.bind(questionController));

// This one is problematic - needs to come after /:id to avoid conflicts
// TODO: Consider moving to /users/:userId/questions
router.get('/user/:userId', questionController.getQuestionsByUserId.bind(questionController));

// POST routes
router.post(
  '/', 
  validateBody(isCreateQuestionDto), 
  questionController.createQuestion.bind(questionController)
);

// PUT routes
router.put(
  '/:id', 
  validateId, 
  validateBody(isUpdateQuestionDto), 
  questionController.updateQuestion.bind(questionController)
);

// DELETE routes
router.delete('/:id', validateId, questionController.deleteQuestion.bind(questionController));

// Answer routes
router.post('/:id/answers', validateId, questionController.addAnswer.bind(questionController));

export default router; 