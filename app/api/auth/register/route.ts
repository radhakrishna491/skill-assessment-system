import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'STUDENT', // Default to student
      },
    })

    const token = signToken({ userId: user.id, role: user.role, email: user.email })

    return NextResponse.json({ 
      message: 'User created successfully', 
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}