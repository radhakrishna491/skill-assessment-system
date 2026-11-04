'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth-client'

export default function StudentResume() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setError('')
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file first.')
      return
    }

    setLoading(true)
    setError('')
    const token = getToken()

    const formData = new FormData()
    formData.append('resume', file)

    try {
      const res = await fetch('/api/student/resume', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to parse resume.')
      }
    } catch (err) {
      setError('An error occurred during upload.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resume Studio & NLP Skill Extraction</h1>
        <p className="text-gray-500 mt-1">Upload your resume PDF to extract technical competencies, verify accuracy, and align with team requirements.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 pt-4 flex gap-6">
          <button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-semibold text-sm">
            Upload PDF Document
          </button>
          <button className="pb-3 border-b-2 border-transparent text-gray-500 font-medium text-sm hover:text-gray-700">
            Paste Resume / Text Sandbox
          </button>
        </div>

        <div className="p-8">
          {/* Dropzone */}
          <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-12 flex flex-col items-center justify-center text-center mb-6">
            <div className="bg-white p-3 rounded-full shadow-sm mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Choose your resume in PDF format</h3>
            <p className="text-gray-500 text-sm mb-6">Maximum file size: 5MB</p>
            
            <label className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 px-6 py-2.5 rounded-lg font-medium cursor-pointer transition">
              Browse PDF File
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
            </label>

            {file && (
              <p className="mt-4 text-sm text-green-600 font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end">
            <button 
              onClick={handleUpload} 
              disabled={loading || !file}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Extracting...' : (
                <>
                  <span>✨</span> Run AI Skill Extraction
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Extraction Results */}
      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-green-500">✓</span> Extraction Complete
          </h2>
          <p className="text-gray-600 mb-6 text-sm">Found <strong>{result.extractedCount}</strong> skills in your resume.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {result.skills.map((skill: any, idx: number) => (
              <div key={idx} className="bg-gray-50 border border-gray-100 p-4 rounded-lg">
                <p className="font-bold text-gray-900 text-sm">{skill.skillName}</p>
                <p className="text-xs text-gray-500 mt-1">{skill.domain}</p>
                <div className="mt-2 text-xs font-semibold text-blue-600">
                  Confidence: {Math.round(skill.confidence * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}