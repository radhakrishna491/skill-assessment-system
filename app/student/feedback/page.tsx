'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth-client'

export default function StudentFeedback() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [assessments, setAssessments] = useState<any[]>([])

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

    // We need to create an API endpoint for this. For now, we will fetch it via a new endpoint
    fetch('/api/student/assessments', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.assessments) setAssessments(data.assessments)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  if (loading) return <div className="text-gray-500">Loading feedback...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assessments, Feedback & Skill Gaps</h1>
        <p className="text-gray-500 mt-1">Review verified trainer evaluations, rubric scorings, qualitative strengths and weaknesses, and personalized remediation paths.</p>
      </div>

      {assessments.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
          You have not received any trainer evaluations yet.
        </div>
      ) : (
        assessments.map(assessment => (
          <div key={assessment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                  {assessment.domain}
                </span>
                <h2 className="text-xl font-bold text-gray-900">Technical Assessment Evaluation</h2>
                <p className="text-sm text-gray-500 mt-1">Evaluator: {assessment.trainer?.user?.name || 'Trainer'}</p>
              </div>
              <div className="text-right flex gap-6">
                <div>
                  <p className="text-2xl font-bold text-blue-600">8/10</p>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Technical</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-indigo-600">9/10</p>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Problem Solving</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                <h3 className="text-sm font-bold text-green-800 mb-2 flex items-center gap-2">
                  <span>✓</span> Identified Strengths
                </h3>
                <p className="text-sm text-green-700">{assessment.strengths}</p>
              </div>
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg">
                <h3 className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-2">
                  <span>⚠</span> Targeted Growth Areas
                </h3>
                <p className="text-sm text-orange-700">{assessment.weaknesses}</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Trainer Qualitative Commentary</h3>
              <p className="text-sm text-gray-600 italic">"{assessment.feedback}"</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}