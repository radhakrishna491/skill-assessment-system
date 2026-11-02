import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import pdf from 'pdf-parse'

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = verifyToken(authHeader.split(' ')[1])
    if (!payload || payload.role !== 'STUDENT') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const student = await prisma.student.findUnique({ where: { userId: payload.userId } })
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

    // Get file from form data
    const formData = await req.formData()
    const file = formData.get('resume') as File

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    if (file.type !== 'application/pdf') return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })

    // Convert file to Buffer and extract text
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const pdfData = await pdf(buffer)

    // Save extracted text to database
    await prisma.student.update({
      where: { id: student.id },
      data: { resumeText: pdfData.text }
    })

    return NextResponse.json({ 
      message: 'Resume uploaded and parsed successfully',
      textLength: pdfData.text.length
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 })
  }
}