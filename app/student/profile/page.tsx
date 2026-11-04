'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth-client'

export default function StudentProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [student, setStudent] = useState<any>(null)

  // Form State
  const [branch, setBranch] = useState('')
  const [year, setYear] = useState('')

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

    fetch('/api/student/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.student) {
          setStudent(data.student)
          setBranch(data.student.branch || '')
          setYear(data.student.year?.toString() || '')
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const token = getToken()

    try {
      const res = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          branch,
          year: parseInt(year) || null
        })
      })

      if (res.ok) {
        alert('Profile saved successfully!')
      } else {
        alert('Failed to save profile.')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-gray-500">Loading profile...</div>

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Profile & Competencies</h1>
        <p className="text-gray-500 mt-1">Manage academic identity, declared technical skills, project portfolio, and certifications.</p>
      </div>

      {/* Academic Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div className="bg-blue-50 p-2 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">ACADEMIC & CONTACT INFORMATION</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Legal Name</label>
              <input type="text" disabled value={student?.user?.name || ''} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Degree Program</label>
              <input type="text" disabled value="Bachelor of Technology" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch / Major</label>
              <input type="text" required value={branch} onChange={e => setBranch(e.target.value)} placeholder="e.g. Computer Science" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Semester</label>
              <input type="number" required value={year} onChange={e => setYear(e.target.value)} placeholder="e.g. 3" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cumulative CGPA / GPA</label>
              <input type="text" disabled value="8.85" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
              <input type="text" disabled value="https://linkedin.com/in/rahul" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Academic Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Skills Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">TECHNICAL SKILLS PORTFOLIO ({student?.skills?.length || 0})</h2>
              <p className="text-xs text-gray-500">Separates self-declared proficiency from resume extraction and trainer assessment ground truth.</p>
            </div>
          </div>
          <button className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-semibold transition border border-blue-100 flex items-center gap-2">
            + Add Skill
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="pb-3 px-4">Skill Name</th>
                <th className="pb-3 px-4">Domain Category</th>
                <th className="pb-3 px-4 text-center">Self-Declared Level</th>
                <th className="pb-3 px-4 text-center">Extracted from Resume</th>
                <th className="pb-3 px-4 text-center">Assessed Competency</th>
                <th className="pb-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {student?.skills?.map((skill: any) => (
                <tr key={skill.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-4 text-sm font-bold text-gray-900">{skill.skillName}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{skill.domain}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      level {skill.selfLevel}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {skill.source === 'resume' || skill.source === 'verified' ? (
                      <span className="text-sm text-gray-700 flex items-center justify-center gap-1">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Verified in Resume
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Not Found</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {skill.verifiedLevel ? (
                      <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                        Assessed: {skill.verifiedLevel}/10
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Pending Trainer Evaluation</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button className="text-gray-400 hover:text-red-500 transition">
                      <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {(!student?.skills || student.skills.length === 0) && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500 text-sm">
                    No skills added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}