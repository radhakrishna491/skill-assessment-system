import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = verifyToken(authHeader.split(' ')[1])
    if (!payload || payload.role !== 'STUDENT') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const student = await prisma.student.findUnique({
      where: { userId: payload.userId },
      include: { skills: true }
    })

    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

    const studentSkillNames = student.skills.map(s => s.skillName.toLowerCase())

    // 1. Find the best team for this student
    const teams = await prisma.team.findMany()
    let bestTeam = null
    let maxMatch = -1

    for (const team of teams) {
      const reqSkills = JSON.parse(team.requiredSkills)
      let matches = 0
      for (const req of reqSkills) {
        const skillName = typeof req === 'string' ? req : req.skill
        if (studentSkillNames.includes(skillName.toLowerCase())) matches++
      }
      const matchPercentage = matches / reqSkills.length
      if (matchPercentage > maxMatch) {
        maxMatch = matchPercentage
        bestTeam = team
      }
    }

    // 2. Generate Skill Gaps for the best team
    const gaps: any[] = []
    if (bestTeam) {
      const reqSkills = JSON.parse(bestTeam.requiredSkills)
      for (const req of reqSkills) {
        const skillName = typeof req === 'string' ? req : req.skill
        if (!studentSkillNames.includes(skillName.toLowerCase())) {
          gaps.push({
            skill: skillName,
            severity: "Critical",
            learningAction: `Take an online course or project in ${skillName} to qualify for ${bestTeam.name}.`
          })
        }
      }
    }

    // 3. Find a matching Trainer based on the best team's domain
    let recommendedTrainer = null
    if (bestTeam) {
      // Find a trainer whose expertise string contains the domain (e.g., "Data Science")
      const trainers = await prisma.trainer.findMany({
        include: { user: { select: { name: true, email: true } } }
      })
      
      const matchedTrainer = trainers.find(t => 
        t.expertise.toLowerCase().includes(bestTeam!.domain.toLowerCase())
      )
      
      if (matchedTrainer) {
        recommendedTrainer = {
          name: matchedTrainer.user.name,
          expertise: matchedTrainer.expertise,
          email: matchedTrainer.user.email
        }
      }
    }

    return NextResponse.json({
      recommendedTeam: bestTeam ? { name: bestTeam.name, domain: bestTeam.domain } : null,
      skillGaps: gaps,
      recommendedTrainer: recommendedTrainer
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}