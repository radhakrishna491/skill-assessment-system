import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = verifyToken(authHeader.split(' ')[1])
    if (!payload || payload.role !== 'TRAINER') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Fetch all students with their user info and skills
    const students = await prisma.student.findMany({
      include: {
        user: { select: { name: true, email: true } },
        skills: true
      }
    })

    return NextResponse.json({ students })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}