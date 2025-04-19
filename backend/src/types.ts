import { Request } from 'express';

export interface TypedRequest<T> extends Request {
  body: T;
}

export interface CreateAnswerBody {
  content: string;
  userId: string;
}

export interface RouteParams {
  id: string;
} 