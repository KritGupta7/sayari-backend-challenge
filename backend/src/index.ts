import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import questionRoutes from './routes/questions';
import userRoutes from './routes/users';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/errors';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Set up middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/questions', questionRoutes);
app.use('/users', userRoutes);

// 404 handler for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`404 Not Found: ${req.method} ${req.path}`);
  next(new AppError(404, 'Route not found'));
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`Error: ${err.message}`);
  errorHandler(err, req, res, next);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 