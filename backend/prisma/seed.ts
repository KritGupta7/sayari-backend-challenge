import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

interface StackoverFauxUser {
  id: number;
  name: string;
}

interface StackoverFauxComment {
  id: number;
  body: string;
  user: StackoverFauxUser;
}

interface StackoverFauxAnswer {
  id: number;
  body: string;
  creation: number;
  score: number;
  user: StackoverFauxUser;
  accepted: boolean;
  comments: StackoverFauxComment[];
}

interface StackoverFauxQuestion {
  id: number;
  title: string;
  body: string;
  creation: number;
  score: number;
  user: StackoverFauxUser;
  comments: StackoverFauxComment[];
  answers: StackoverFauxAnswer[];
}

async function main() {
  console.log('Start seeding...');
  
  // Read the data file
  const filePath = path.join(__dirname, '../../stackoverfaux.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  const questions: StackoverFauxQuestion[] = JSON.parse(rawData);
  
  console.log(`Loaded ${questions.length} questions from stackoverfaux.json`);
  
  // Create a map of processed users
  const processedUsers = new Map<number, string>();
  
  // Process questions
  for (const question of questions.slice(0, 25)) { // Process first 25 questions for demo
    // Check and create user if not exists
    let userId = await processUser(question.user, processedUsers);
    
    // Create question
    const createdQuestion = await prisma.question.create({
      data: {
        title: question.title,
        content: question.body,
        userId,
        createdAt: new Date(question.creation * 1000),
        updatedAt: new Date(question.creation * 1000)
      }
    });
    
    console.log(`Created question with ID: ${createdQuestion.id}`);
    
    // Process answers for this question
    if (question.answers && question.answers.length > 0) {
      for (const answer of question.answers) {
        // Get or create user for this answer
        let answerUserId = await processUser(answer.user, processedUsers);
        
        // Create answer
        await prisma.answer.create({
          data: {
            content: answer.body,
            userId: answerUserId,
            questionId: createdQuestion.id,
            createdAt: new Date(answer.creation * 1000),
            updatedAt: new Date(answer.creation * 1000)
          }
        });
      }
      
      console.log(`Added ${question.answers.length} answers to question ${createdQuestion.id}`);
    }
  }
  
  console.log(`Seeding completed with ${processedUsers.size} unique users.`);
}

// Helper function to process a user and return the ID
async function processUser(user: StackoverFauxUser, processedUsers: Map<number, string>) {
  // Check if we already processed this user
  if (processedUsers.has(user.id)) {
    return processedUsers.get(user.id)!;
  }
  
  // Create the user
  const createdUser = await prisma.user.create({
    data: {
      name: user.name,
      email: `user_${user.id}@example.com`, // Generate a dummy email
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
  
  // Store the mapping
  processedUsers.set(user.id, createdUser.id);
  
  return createdUser.id;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 