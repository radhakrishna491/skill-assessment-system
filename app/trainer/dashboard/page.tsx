'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, getUser, removeToken } from '@/lib/auth-client'

export default function TrainerDashboard() {
  const router = useRouter()
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  
  // Evaluation Form State
  const [domain, setDomain] = useState('')
  const [feedback, setFeedback] = useState('')
  const [strengths, setStrengths] = useState('')
  const [weaknesses, setWeaknesses] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const user = getUser()

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

    fetch('/api/trainer/students', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.students) setStudents(data.students)
        setLoading(false)
      })
      .catch(() => {
        removeToken()
        router.push('/login')
      })
  }, [router])

  const handleLogout = () => {
    removeToken()
    router.push('/login')
  }

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
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
          studentId: selectedStudent.id,
          domain,
          scores: { overall: 8 }, // Hardcoded for demo simplicity
          feedback,
          strengths,
          weaknesses
        })
      })

      if (res.ok) {
        alert('Evaluation submitted successfully!')
        setSelectedStudent(null)
        setDomain('')
        setFeedback('')
        setStrengths('')
        setWeaknesses('')
      } else {
        alert('Failed to submit evaluation')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-900">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trainer Dashboard</h1>
            <p className="text-gray-500">Welcome, {user?.name}. Select a student to evaluate.</p>
          </div>
          <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition">
            Logout
          </button>
        </div>

        {/* Student List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map(student => (
            <div key={student.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{student.user.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{student.user.email}</p>
              
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {student.skills.map((s: any) => (
                    <span key={s.id} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {s.skillName}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setSelectedStudent(student)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
              >
                Evaluate Student
              </button>
            </div>
          ))}
        </div>

        {/* Evaluation Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Evaluate {selectedStudent.user.name}</h2>
              
              <form onSubmit={handleSubmitEvaluation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domain Assessed</label>
                  <input required value={domain} onChange={e => setDomain(e.target.value)} placeholder="e.g. Data Science" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Strengths</label>
                  <input required value={strengths} onChange={e => setStrengths(e.target.value)} placeholder="e.g. Great at Python" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weaknesses</label>
                  <input required value={weaknesses} onChange={e => setWeaknesses(e.target.value)} placeholder="e.g. Needs work on ML" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                  <textarea required value={feedback} onChange={e => setFeedback(e.target.value)} rows={3} placeholder="Overall assessment..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button type="button" onClick={() => setSelectedStudent(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50">
                    {submitting ? 'Submitting...' : 'Submit Evaluation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}