import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { extractSkillsFromText } from '@/lib/extractSkills'

// @ts-ignore
const PDFParser = require('pdf2json')

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

    // Parse the PDF using pdf2json
    const pdfParser = new PDFParser(null, 1)
    
    const pdfText = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        // Extract text from the parsed JSON data
        let text = ""
        for (const page of pdfData.Pages) {
          for (const textItem of page.Texts) {
            for (const run of textItem.R) {
              text += decodeURIComponent(run.T) + " "
            }
          }
        }
        resolve(text)
      })
      pdfParser.on("pdfParser_dataError", (err: any) => reject(err))
      pdfParser.parseBuffer(buffer)
    })

    // Run the NLP AI Extraction
    const extractedSkills = extractSkillsFromText(pdfText)

    // Save text to database
    await prisma.student.update({
      where: { id: student.id },
      data: { resumeText: pdfText }
    })

    // Save extracted skills
    if (extractedSkills.length > 0) {
      await prisma.studentSkill.deleteMany({
        where: { studentId: student.id, source: "resume" }
      })

      await prisma.studentSkill.createMany({
        data: extractedSkills.map(skill => ({
          studentId: student.id,
          skillName: skill.skillName,
          domain: skill.domain,
          selfLevel: 3,
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
    console.error("PDF Parsing Error:", error)
    return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 })
  }
}