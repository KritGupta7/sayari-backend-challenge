import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateBody, validateId } from '../middleware/validate';
import { isCreateUserDto, isUpdateUserDto } from '../types';

// Create router and controller
const router = Router();
const userController = new UserController();

// ROUTES

// GET routes
router.get('/', userController.getAllUsers.bind(userController));
router.get('/:id', validateId, userController.getUserById.bind(userController));

// POST routes
router.post(
  '/',
  validateBody(isCreateUserDto),
  userController.createUser.bind(userController)
);

// PUT routes
router.put(
  '/:id',
  validateId,
  validateBody(isUpdateUserDto),
  userController.updateUser.bind(userController)
);

// DELETE routes
router.delete('/:id', validateId, userController.deleteUser.bind(userController));

export default router; 