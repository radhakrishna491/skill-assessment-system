import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Helper to get student from token
async function getStudent(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  
  const payload = verifyToken(authHeader.split(' ')[1])
  if (!payload || payload.role !== 'STUDENT') return null

  return prisma.student.findUnique({
    where: { userId: payload.userId },
    include: { user: { select: { name: true, email: true } }, skills: true }
  })
}

export async function GET(req: Request) {
  const student = await getStudent(req)
  if (!student) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return NextResponse.json({ student })
}

export async function PUT(req: Request) {
  const student = await getStudent(req)
  if (!student) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { branch, year, skills } = await req.json()

    // Update basic details
    const updatedStudent = await prisma.student.update({
      where: { id: student.id },
      data: { branch, year }
    })

    // If skills provided, replace existing skills
    if (skills && Array.isArray(skills)) {
      await prisma.studentSkill.deleteMany({ where: { studentId: student.id } })
      await prisma.studentSkill.createMany({
        data: skills.map((s: any) => ({
          studentId: student.id,
          skillName: s.skillName,
          domain: s.domain,
          selfLevel: s.selfLevel || 1
        }))
      })
    }

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}