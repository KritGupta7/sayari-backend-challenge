// Basic types for application
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  questions?: Question[];
  answers?: Answer[];
}

export interface Question {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  answers?: Answer[];
}

export interface CreateQuestionDto {
  title: string;
  content: string;
  userId: string;
}

export interface UpdateQuestionDto {
  title?: string;
  content?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

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