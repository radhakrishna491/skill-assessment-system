import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// GET: View all teams
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = verifyToken(authHeader.split(' ')[1])
    if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const teams = await prisma.team.findMany()
    return NextResponse.json({ teams })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create a new team
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = verifyToken(authHeader.split(' ')[1])
    if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, domain, description, requiredSkills } = await req.json()

    if (!name || !domain || !requiredSkills || !Array.isArray(requiredSkills)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate the weighted JSON string
    // Example: [{ skill: "Python", weight: 5 }, ...]
    const team = await prisma.team.create({
      data: {
        name,
        domain,
        description: description || '',
        requiredSkills: JSON.stringify(requiredSkills)
      }
    })

    return NextResponse.json({ message: 'Team created successfully', team })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
