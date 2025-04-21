import { User, Question } from './index';

export interface CreateAnswerDto {
  content: string;
  userId: string;
}

export interface Answer {
  id: string;
  content: string;
  questionId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  question?: Question;
} 