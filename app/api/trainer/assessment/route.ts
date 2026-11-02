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

    return NextResponse.json({ message: 'Assessment submitted successfully', assessment })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}