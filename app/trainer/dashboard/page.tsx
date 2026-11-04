'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, getUser } from '@/lib/auth-client'

export default function TrainerConsole() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<any[]>([])
  const [assessments, setAssessments] = useState<any[]>([])
  const user = getUser()

  useEffect(() => {
    const token = getToken()
    if (!token) return

    const fetchData = async () => {
      const headers = { Authorization: `Bearer ${token}` }
      const [studentsRes, assessmentsRes] = await Promise.all([
        fetch('/api/trainer/students', { headers }),
        fetch('/api/trainer/assessment', { headers })
      ])
      if (studentsRes.ok) setStudents((await studentsRes.json()).students)
      if (assessmentsRes.ok) setAssessments((await assessmentsRes.json()).assessments)
      setLoading(false)
    }
    fetchData()
  }, [router])

  if (loading) return <div className="text-gray-500">Loading console...</div>

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            {user?.name}
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 uppercase">Faculty Lead</span>
          </h1>
          <p className="text-gray-500 mt-2">Associate Professor & AI Lab Director • Computer Science & Engineering • 9 Years Exp</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">Domain Specialization:</span>
            <span className="text-sm text-gray-600">Data Science, Machine Learning, Predictive Modeling</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Student Caseload</p>
          <p className="text-4xl font-bold text-gray-900">{students.length} <span className="text-xl text-gray-400">/ 25</span></p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Assigned Students</p>
            <p className="text-4xl font-bold text-gray-900">{students.length}</p>
            <p className="text-xs text-gray-500 mt-1">Under active mentorship</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg"><svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Completed Evaluations</p>
            <p className="text-4xl font-bold text-gray-900">{assessments.length}</p>
            <p className="text-xs text-gray-500 mt-1">Rubrics recorded</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg"><svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Assessments</p>
            <p className="text-4xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting technical review</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg"><svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
        </div>
      </div>

      {/* Assigned Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 uppercase">Assigned Students Cohort ({students.length})</h2>
          <p className="text-sm text-gray-500 mt-1">Conduct domain evaluations, enter skill rubrics, and provide feedback.</p>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-y border-gray-200">
              <th className="p-4">Student Name</th>
              <th className="p-4">UID</th>
              <th className="p-4">Program / Branch</th>
              <th className="p-4">Semester</th>
              <th className="p-4">CGPA</th>
              <th className="p-4">Domain</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-bold text-gray-900">{student.user.name}</td>
                <td className="p-4 text-sm text-gray-500">STU-{student.id.slice(0, 4).toUpperCase()}</td>
                <td className="p-4 text-sm text-gray-500">{student.branch}</td>
                <td className="p-4 text-sm text-gray-500">Sem {student.year}</td>
                <td className="p-4 text-sm text-gray-500">8.85</td>
                <td className="p-4">
                  <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                    Data Science & Machine Learning
                  </span>
                </td>
                <td className="p-4 text-right flex gap-2 justify-end">
                  <button className="text-xs font-semibold text-gray-700 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition">Inspect Profile</button>
                  <button className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded transition">Evaluate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Evaluation History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-lg font-bold text-gray-900 uppercase mb-6">Recent Evaluation History ({assessments.length})</h2>
        <div className="space-y-4">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-gray-900">{assessment.student?.user?.name || 'Student'}</h3>
                  <span className="text-xs text-gray-400">(STU-2024-002)</span>
                  <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded">{assessment.domain}</span>
                </div>
                <p className="text-sm text-gray-500 italic">"{assessment.feedback}"</p>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <p className="text-2xl font-bold text-blue-600">92</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Tech / 100</p>
                </div>
                <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">Recorded</span>
              </div>
            </div>
          ))}
          {assessments.length === 0 && <p className="text-gray-500 text-sm">No evaluations yet.</p>}
        </div>
      </div>
    </div>
  )
}