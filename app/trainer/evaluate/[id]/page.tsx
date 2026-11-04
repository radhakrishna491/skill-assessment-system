'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getToken } from '@/lib/auth-client'

export default function EvaluateStudent() {
  const router = useRouter()
  const params = useParams()
  const studentId = params.id as string

  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Form State
  const [domain, setDomain] = useState('')
  const [feedback, setFeedback] = useState('')
  const [strengths, setStrengths] = useState('')
  const [weaknesses, setWeaknesses] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) return

    // Fetch all students to find this specific one
    fetch('/api/trainer/students', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.students) {
          const found = data.students.find((s: any) => s.id === studentId)
          setStudent(found)
        }
        setLoading(false)
      })
  }, [studentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const token = getToken()

    try {
      const res = await fetch('/api/trainer/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId,
          domain,
          scores: { overall: 8 },
          feedback,
          strengths,
          weaknesses
        })
      })

      if (res.ok) {
        alert('Evaluation submitted successfully!')
        router.push('/trainer/dashboard')
      } else {
        alert('Failed to submit evaluation')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-gray-500">Loading student details...</div>
  if (!student) return <div className="text-red-500">Student not found.</div>

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Evaluate Student</h1>
        <p className="text-gray-500 mt-1">Submitting a technical assessment for <strong>{student.user.name}</strong>.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Domain Assessed</label>
            <input required value={domain} onChange={e => setDomain(e.target.value)} placeholder="e.g. Data Science" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Strengths</label>
              <textarea required rows={3} value={strengths} onChange={e => setStrengths(e.target.value)} placeholder="e.g. Great at Python" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weaknesses</label>
              <textarea required rows={3} value={weaknesses} onChange={e => setWeaknesses(e.target.value)} placeholder="e.g. Needs work on ML" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Overall Feedback</label>
            <textarea required rows={4} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Detailed qualitative feedback..." className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => router.push('/trainer/dashboard')} className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Evaluation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}