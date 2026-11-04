import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = verifyToken(authHeader.split(' ')[1])
    if (!payload || payload.role !== 'TRAINER') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const trainer = await prisma.trainer.findUnique({ where: { userId: payload.userId } })
    if (!trainer) return NextResponse.json({ error: 'Trainer profile not found' }, { status: 404 })

    const { studentId, domain, scores, feedback, strengths, weaknesses } = await req.json()

    if (!studentId || !domain || !feedback) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Create the Assessment record
    const assessment = await prisma.assessment.create({
      data: {
        studentId,
        trainerId: trainer.id,
        domain,
        scores: JSON.stringify(scores || {}),
        feedback,
        strengths: strengths || '',
        weaknesses: weaknesses || ''
      }
    })

    // 2. Update the Student's Skills to mark them as "verified" based on the assessment
    // We look for skills in that domain and update their verifiedLevel
    const studentSkills = await prisma.studentSkill.findMany({
      where: { studentId, domain: domain }
    })

    if (studentSkills.length > 0) {
      for (const skill of studentSkills) {
        // If the trainer gave an overall score, we use it. Otherwise default to 4.
        const verifiedScore = scores?.overall || 4
        
        await prisma.studentSkill.update({
          where: { id: skill.id },
          data: {
            verifiedLevel: verifiedScore,
            source: "verified" // Mark it as verified!
          }
        })
      }
    }

    return NextResponse.json({ 
      message: 'Assessment submitted and skills verified successfully', 
      assessment 
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}