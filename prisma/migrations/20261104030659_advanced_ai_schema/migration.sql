-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "technologies" TEXT NOT NULL,
    CONSTRAINT "Project_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    CONSTRAINT "Certification_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SkillGap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "targetTeamId" TEXT NOT NULL,
    "missingSkill" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "learningAction" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SkillGap_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StudentSkill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "selfLevel" INTEGER NOT NULL DEFAULT 1,
    "verifiedLevel" INTEGER,
    "source" TEXT NOT NULL DEFAULT 'self',
    CONSTRAINT "StudentSkill_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_StudentSkill" ("domain", "id", "selfLevel", "skillName", "studentId", "verifiedLevel") SELECT "domain", "id", "selfLevel", "skillName", "studentId", "verifiedLevel" FROM "StudentSkill";
DROP TABLE "StudentSkill";
ALTER TABLE "new_StudentSkill" RENAME TO "StudentSkill";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
