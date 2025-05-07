# StackOverfaux

A StackOverflow-like Q&A application that allows users to ask questions, post answers, and manage user profiles.

## Project Overview

StackOverfaux is a backend API that simulates the functionality of StackOverflow. It provides endpoints for:

- View a list of questions
- View detailed information about specific questions and their answers
- Add new answers to questions
- Manage user accounts (view, create, delete)

The application consists of a TypeScript-based backend API built with Express and Prisma.

## Installation Instructions

### Option 1: Using Docker (Recommended)

The easiest way to run the application is using Docker and Docker Compose:

1. Make sure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

2. Clone the repository:
   ```
   git clone https://github.com/KritGupta7/sayari-fullstack-challenge.git
   cd sayari-fullstack-challenge
   ```

3. Start the application:
   ```
   docker-compose up
   ```

   This will:
   - Build the backend container
   - Start a PostgreSQL database
   - Run database migrations
   - Seed the database with sample data
   - Start the backend server

The API will be available at http://localhost:3001.

To stop the application:
```
docker-compose down
```

### Option 2: Manual Setup

If you prefer to run the application without Docker, follow these steps:

#### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

#### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/KritGupta7/sayari-fullstack-challenge.git
   cd sayari-fullstack-challenge
   ```

2. Install dependencies:
   ```
   cd backend
   npm install
   ```

3. Create a `.env` file in the `backend` directory with your database connection string:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/stackoverfaux"
   ```

   Replace `username` and `password` with your PostgreSQL credentials. If you haven't created the database yet, you can do so with:
   ```
   createdb stackoverfaux
   ```
   Or use pgAdmin/another PostgreSQL client to create a new database.

4. Set up the database:
   ```
   npx prisma migrate dev --name init
   ```

5. Seed the database with initial data:
   ```
   npx prisma db seed
   ```

6. Start the server:
   ```
   npm run dev
   ```

The server will start on http://localhost:3001.

## API Documentation

The backend provides the following REST API endpoints:

### Questions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/questions` | Get all questions |
| GET | `/questions/:id` | Get a specific question with its answers |
| GET | `/questions/user/:userId` | Get all questions by a specific user |
| GET | `/questions/user/:userId/answers` | Get all answers by a specific user |
| POST | `/questions` | Create a new question |
| PUT | `/questions/:id` | Update a question |
| DELETE | `/questions/:id` | Delete a question |
| POST | `/questions/:id/answers` | Add an answer to a question |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get a specific user |
| POST | `/users` | Create a new user |
| PUT | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user and their associated content |

### Error Responses

All API endpoints return standard HTTP status codes:
- 200: Success
- 400: Bad Request (invalid input)
- 404: Not Found
- 500: Server Error

Error responses follow the format:
```json
{
  "status": 404,
  "message": "User not found"
}
```

## Architecture Decisions

### Backend

- **TypeScript**: Used for type safety and improved developer experience.
- **Express.js**: Lightweight web framework for building the API.
- **Prisma**: ORM for database access with strong typing support.
- **Error Handling**: Centralized error handling with custom `AppError` class.
- **Service/Controller Pattern**: Separation of concerns with services handling business logic and controllers managing HTTP requests/responses.

### Database Schema

The database uses a relational model with the following entities:
- **User**: Represents application users
- **Question**: Contains question data linked to a user
- **Answer**: Represents answers to questions, linked to both questions and users
- **Comment**: Represents comments on questions or answers

### API Design

- REST architecture for predictable endpoints
- JSON for data interchange
- Validation middleware to ensure data integrity



