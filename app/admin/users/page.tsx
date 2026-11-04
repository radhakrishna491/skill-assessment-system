'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth-client'

export default function StudentDirectory() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) return

    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.users) setUsers(data.users.filter((u: any) => u.role === 'STUDENT'))
        setLoading(false)
      })
  }, [router])

  if (loading) return <div className="text-gray-500">Loading directory...</div>

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Directory & Allocation Management</h1>
          <p className="text-gray-500 mt-1">Trigger AI recommendation pipelines, oversee team placements, and assign specialized faculty trainers.</p>
        </div>
        <div className="relative">
          <input type="text" placeholder="Search students, UIDs, majors..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-72" />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <th className="p-4">Student Name</th>
              <th className="p-4">UID</th>
              <th className="p-4">Program & Branch</th>
              <th className="p-4">Semester</th>
              <th className="p-4">CGPA</th>
              <th className="p-4">Allocated Team</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-bold text-gray-900">{student.name}</td>
                <td className="p-4 text-sm text-gray-500">STU-{student.id.slice(0,4).toUpperCase()}</td>
                <td className="p-4 text-sm text-gray-500">Bachelor of Technology (Computer Science)</td>
                <td className="p-4 text-sm text-gray-500">Sem 6</td>
                <td className="p-4 text-sm text-gray-500">8.85</td>
                <td className="p-4 text-sm font-semibold text-gray-700">Data Science</td>
                <td className="p-4">
                  <span className="bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">approved</span>
                </td>
                <td className="p-4 text-right space-y-1">
                  <button className="block w-full text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded border border-purple-200 transition">AI Match</button>
                  <button className="block w-full text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded border border-blue-200 transition">Allocate</button>
                  <button className="block w-full text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 px-3 py-1.5 rounded border border-gray-300 transition">Assign Trainer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}