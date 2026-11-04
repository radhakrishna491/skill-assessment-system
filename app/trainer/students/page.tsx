'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth-client'

export default function AssignedStudents() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<any[]>([])

  useEffect(() => {
    const token = getToken()
    if (!token) return

    fetch('/api/trainer/students', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.students) setStudents(data.students)
        setLoading(false)
      })
  }, [router])

  if (loading) return <div className="text-gray-500">Loading students...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assigned Students</h1>
        <p className="text-gray-500 mt-1">Conduct domain evaluations, enter skill rubrics, and provide feedback.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <th className="p-4">Student Name</th>
              <th className="p-4">UID</th>
              <th className="p-4">Program / Branch</th>
              <th className="p-4">Semester</th>
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
                <td className="p-4">
                  <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                    Data Science & ML
                  </span>
                </td>
                <td className="p-4 text-right flex gap-2 justify-end">
                  <button 
                    onClick={() => router.push(`/trainer/evaluate/${student.id}`)} 
                    className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded transition"
                  >
                    Evaluate
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No students assigned yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}