# SkillSync AI - Student Skill Assessment & Team Allocation

An enterprise-grade AI-powered platform designed to automate student skill discovery, resume parsing, explainable team matching, and trainer evaluations.

## Key Features
- **Role-Based Access Control (RBAC):** Dedicated dashboards for Students, Trainers, and Admins using JWT authentication.
- **NLP Resume Extraction:** Parses PDF resumes to extract technical skills with AI confidence scores.
- **Explainable AI Matching:** Uses Weighted Cosine Similarity to match students to teams based on skill weights and proficiency levels.
- **Skill Gap Analysis:** Automatically generates personalized learning paths and recommends trainers.
- **Trainer Verification:** Trainers can evaluate students, which instantly updates the student's verified skill levels in the database.

## Tech Stack
- **Frontend:** Next.js 16 (React), Tailwind CSS
- **Backend:** Next.js API Routes (Node.js)
- **Database:** SQLite (via Prisma ORM)
- **AI/NLP Engine:** Custom TF-IDF Skill Taxonomy, Weighted Matching Algorithm
- **Auth:** JWT (JSON Web Tokens) + bcryptjs

## How to Run Locally
1. Clone the repo: `git clone https://github.com/YOUR_USERNAME/skill-assessment-system.git`
2. Install dependencies: `npm install`
3. Set up the database: `npx prisma migrate dev --name init`
4. Seed the database: `npx tsx prisma/seed.ts`
5. Start the server: `npm run dev`

## Demo Credentials
- **Admin:** `admin@test.com` / `password123`
- **Trainer:** `trainer@test.com` / `password123`
- **Student:** `student@test.com` / `password123`
