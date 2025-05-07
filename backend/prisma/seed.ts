import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

// Note: The JSON data has numeric IDs, but our DB schema uses string IDs
// Updated interfaces to use string types to match the DB schema
interface StackoverFauxUser {
  id: string; // Changed from number to string
  name: string;
}

interface StackoverFauxComment {
  id: string; // Changed from number to string
  body: string;
  user: StackoverFauxUser;
}

interface StackoverFauxAnswer {
  id: string; // Changed from number to string
  body: string;
  creation: number;
  score: number;
  user: StackoverFauxUser;
  accepted: boolean;
  comments: StackoverFauxComment[];
}

interface StackoverFauxQuestion {
  id: string; // Changed from number to string
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
  
  // Check if seeding was already done
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log('Database already has data. Skipping seed process.');
    return;
  }
  
  // Read the data file
  const filePath = path.join(__dirname, '../stackoverfaux.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(rawData);
  
  // Convert all numeric IDs to strings
  const questions: StackoverFauxQuestion[] = jsonData.map((q: any) => ({
    ...q,
    id: String(q.id),
    user: { ...q.user, id: String(q.user.id) },
    comments: (q.comments || []).map((c: any) => ({
      ...c, 
      id: String(c.id),
      user: { ...c.user, id: String(c.user.id) }
    })),
    answers: (q.answers || []).map((a: any) => ({
      ...a,
      id: String(a.id),
      user: { ...a.user, id: String(a.user.id) },
      comments: (a.comments || []).map((c: any) => ({
        ...c,
        id: String(c.id),
        user: { ...c.user, id: String(c.user.id) }
      }))
    }))
  }));
  
  console.log(`Loaded ${questions.length} questions from stackoverfaux.json`);
  
  // Create questions and users
  for (const question of questions) { // Removed the slice(0, 25) to include all questions
    try {
      // Create the user
      try {
        await prisma.user.create({
          data: {
            id: question.user.id, // Now this is already a string
            name: question.user.name,
            email: `user_${question.user.id}@example.com`,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      } catch (err) {
        console.log(`User ${question.user.id} already exists, skipping...`);
      }

      // Create the question
      try {
        const createdQuestion = await prisma.question.create({
          data: {
            id: question.id, // Now this is already a string
            title: question.title,
            content: question.body,
            score: question.score || 0,
            userId: question.user.id, // Now this is already a string
            createdAt: new Date(question.creation * 1000),
            updatedAt: new Date(question.creation * 1000)
          }
        });
        console.log(`Created question with ID: ${createdQuestion.id}`);
        
        // Process comments for this question
        if (question.comments && question.comments.length > 0) {
          let commentsAdded = 0;
          
          for (const comment of question.comments) {
            // Create the user for this comment if not exists
            try {
              await prisma.user.create({
                data: {
                  id: comment.user.id, // Now this is already a string
                  name: comment.user.name,
                  email: `user_${comment.user.id}@example.com`,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              });
            } catch (err) {
              console.log(`User ${comment.user.id} already exists, skipping...`);
            }
            
            // Create the comment
            try {
              await prisma.comment.create({
                data: {
                  id: comment.id, // Now this is already a string
                  content: comment.body,
                  userId: comment.user.id, // Now this is already a string
                  questionId: question.id, // Now this is already a string
                  answerId: null,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              });
              commentsAdded++;
            } catch (err) {
              console.log(`Comment ${comment.id} already exists, skipping...`);
            }
          }
          
          console.log(`Added ${commentsAdded} comments to question ${question.id}`);
        }
      
        // Process answers for this question
        if (question.answers && question.answers.length > 0) {
          let answersAdded = 0;
          
          for (const answer of question.answers) {
            // Create the user for this answer if not exists
            try {
              await prisma.user.create({
                data: {
                  id: answer.user.id, // Now this is already a string
                  name: answer.user.name,
                  email: `user_${answer.user.id}@example.com`,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              });
            } catch (err) {
              console.log(`User ${answer.user.id} already exists, skipping...`);
            }
            
            // Create the answer
            try {
              const createdAnswer = await prisma.answer.create({
                data: {
                  id: answer.id, // Now this is already a string
                  content: answer.body,
                  score: answer.score || 0,
                  accepted: answer.accepted || false,
                  userId: answer.user.id, // Now this is already a string
                  questionId: question.id, // Now this is already a string
                  createdAt: new Date(answer.creation * 1000),
                  updatedAt: new Date(answer.creation * 1000)
                }
              });
              answersAdded++;
              
              // Process comments for this answer
              if (answer.comments && answer.comments.length > 0) {
                let answerCommentsAdded = 0;
                
                for (const comment of answer.comments) {
                  // Create the user for this comment if not exists
                  try {
                    await prisma.user.create({
                      data: {
                        id: comment.user.id, // Now this is already a string
                        name: comment.user.name,
                        email: `user_${comment.user.id}@example.com`,
                        createdAt: new Date(),
                        updatedAt: new Date()
                      }
                    });
                  } catch (err) {
                    console.log(`User ${comment.user.id} already exists, skipping...`);
                  }
                  
                  // Create the comment
                  try {
                    await prisma.comment.create({
                      data: {
                        id: comment.id, // Now this is already a string
                        content: comment.body,
                        userId: comment.user.id, // Now this is already a string
                        questionId: null,
                        answerId: answer.id, // Now this is already a string
                        createdAt: new Date(),
                        updatedAt: new Date()
                      }
                    });
                    answerCommentsAdded++;
                  } catch (err) {
                    console.log(`Comment ${comment.id} already exists, skipping...`);
                  }
                }
                
                console.log(`Added ${answerCommentsAdded} comments to answer ${answer.id}`);
              }
            } catch (err) {
              console.log(`Answer ${answer.id} already exists, skipping...`);
            }
          }
          
          console.log(`Added ${answersAdded} answers to question ${question.id}`);
        }
      } catch (err) {
        console.log(`Question ${question.id} already exists, skipping...`);
      }
    } catch (err) {
      console.error(`Error processing question ${question.id}:`, err);
    }
  }
  
  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 