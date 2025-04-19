import { Request } from 'express';

// Extend Request to include typed body
export interface TypedRequest<T> extends Request {
  body: T;
}

// For answer creation
export interface CreateAnswerBody {
  content: string;
  userId: string;
}

// Route params
export interface RouteParams {
  id: string;
}

// Main entity types
export interface Question {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // TODO: Don't return this in responses
  createdAt: Date;
  updatedAt: Date;
}

// DTOs for creation and updates
export interface CreateQuestionDto {
  title: string;
  content: string;
}

export interface UpdateQuestionDto {
  title?: string;
  content?: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
}

// Basic type guards - not perfect but helps with validation
export const isCreateQuestionDto = (body: any): body is CreateQuestionDto => {
  return (
    body && 
    typeof body.title === 'string' && 
    body.title.trim() !== '' &&
    typeof body.content === 'string'
  );
};

export const isUpdateQuestionDto = (body: any): body is UpdateQuestionDto => {
  // Empty updates are valid
  if (!body || Object.keys(body).length === 0) return true;
  
  if (body.title !== undefined && typeof body.title !== 'string') return false;
  if (body.content !== undefined && typeof body.content !== 'string') return false;
  
  return true;
};

export const isCreateUserDto = (body: any): body is CreateUserDto => {
  return (
    body &&
    typeof body.username === 'string' && 
    body.username.trim() !== '' &&
    typeof body.email === 'string' &&
    body.email.includes('@') && // Very basic email check
    typeof body.password === 'string' &&
    body.password.length > 5 // Basic password length check
  );
};

export const isUpdateUserDto = (body: any): body is UpdateUserDto => {
  // Empty updates are valid
  if (!body || Object.keys(body).length === 0) return true;
  
  if (body.username !== undefined && typeof body.username !== 'string') return false;
  if (body.email !== undefined && (typeof body.email !== 'string' || !body.email.includes('@'))) return false;
  if (body.password !== undefined && (typeof body.password !== 'string' || body.password.length <= 5)) return false;
  
  return true;
}; 