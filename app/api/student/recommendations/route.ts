import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { calculateTeamMatch } from '@/lib/matching'

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = verifyToken(authHeader.split(' ')[1])
    if (!payload || payload.role !== 'STUDENT') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 1. Get the student and their skills
    const student = await prisma.student.findUnique({
      where: { userId: payload.userId },
      include: { skills: true }
    })

    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

    const studentSkillNames = student.skills.map(s => s.skillName)

    // 2. Get all teams
    const teams = await prisma.team.findMany()

    // 3. Calculate match score for each team
    const recommendations = teams.map(team => {
      // Parse the JSON string of required skills
      const requiredSkills = JSON.parse(team.requiredSkills) as string[]
      
      const match = calculateTeamMatch(studentSkillNames, requiredSkills)

      return {
        teamId: team.id,
        teamName: team.name,
        domain: team.domain,
        description: team.description,
        score: match.score,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        reasons: `Matched ${match.matchedSkills.length} out of ${requiredSkills.length} required skills.`
      }
    })

    // 4. Sort by highest score first
    recommendations.sort((a, b) => b.score - a.score)

    return NextResponse.json({ recommendations })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}