import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL || 'file:./dev.db'
const adapter = new PrismaBetterSqlite3({ url: connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting seed...')
  
  const passwordHash = await bcrypt.hash('password123', 10)

  // 1. Create an Admin
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'System Admin',
      password: passwordHash,
      role: 'ADMIN',
    },
  })

  // 2. Create a Trainer
  await prisma.user.upsert({
    where: { email: 'trainer@test.com' },
    update: {},
    create: {
      email: 'trainer@test.com',
      name: 'Dr. Smith',
      password: passwordHash,
      role: 'TRAINER',
      trainer: {
        create: {
          expertise: 'Data Science, AI/ML',
          bio: 'Expert in Python and Machine Learning',
        }
      }
    },
  })

  // 3. Create a Student
  await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: {},
    create: {
      email: 'student@test.com',
      name: 'Rahul Sharma',
      password: passwordHash,
      role: 'STUDENT',
      student: {
        create: {
          branch: 'Computer Science',
          year: 3,
          skills: {
            create: [
              { skillName: 'Python', domain: 'Data Science', selfLevel: 4 },
              { skillName: 'SQL', domain: 'DBMS', selfLevel: 3 }
            ]
          }
        }
      }
    },
  })

      // 4. Create Teams with WEIGHTS
  await prisma.team.createMany({
    data: [
      { 
        name: 'Alpha Competitive Coders', 
        domain: 'Competitive Coding', 
        requiredSkills: JSON.stringify([
          { skill: "C++", weight: 5 },
          { skill: "DSA", weight: 5 },
          { skill: "Java", weight: 2 }
        ]),
        description: 'Team focused on ACM ICPC and Leetcode.'
      },
      { 
        name: 'Data Wizards', 
        domain: 'Data Science', 
        requiredSkills: JSON.stringify([
          { skill: "Python", weight: 5 },
          { skill: "Pandas", weight: 3 },
          { skill: "Machine Learning", weight: 4 }
        ]),
        description: 'Team focused on Kaggle competitions and analytics.'
      },
      { 
        name: 'Full Stack Ninjas', 
        domain: 'Full Stack', 
        requiredSkills: JSON.stringify([
          { skill: "React", weight: 5 },
          { skill: "Node.js", weight: 4 },
          { skill: "SQL", weight: 3 }
        ]),
        description: 'Builds the college internal tools and web apps.'
      }
    ]
  })}