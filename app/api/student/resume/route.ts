import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { extractSkillsFromText } from '@/lib/extractSkills'
// @ts-ignore
import pdf from 'pdf-parse'
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = verifyToken(authHeader.split(' ')[1])
    if (!payload || payload.role !== 'STUDENT') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const student = await prisma.student.findUnique({ where: { userId: payload.userId } })
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

    const formData = await req.formData()
    const file = formData.get('resume') as File
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const pdfData = await pdf(buffer)

    // 🔥 RUN THE AI EXTRACTION
    const extractedSkills = extractSkillsFromText(pdfData.text)

    // Save text to database
    await prisma.student.update({
      where: { id: student.id },
      data: { resumeText: pdfData.text }
    })

    // Save the extracted skills to the DB (marking them as "resume" source)
    if (extractedSkills.length > 0) {
      // Clear old resume-extracted skills to avoid duplicates
      await prisma.studentSkill.deleteMany({
        where: { studentId: student.id, source: "resume" }
      })

      await prisma.studentSkill.createMany({
        data: extractedSkills.map(skill => ({
          studentId: student.id,
          skillName: skill.skillName,
          domain: skill.domain,
          selfLevel: 3, // Default to intermediate until verified
          source: "resume"
        }))
      })
    }

    return NextResponse.json({ 
      message: 'Resume parsed successfully',
      extractedCount: extractedSkills.length,
      skills: extractedSkills
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 })
  }
}