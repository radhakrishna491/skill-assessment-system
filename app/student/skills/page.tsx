'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth-client'

export default function SkillIntelligence() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<any>(null)

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
        if (data.student) setStudent(data.student)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  if (loading) return <div className="text-gray-500">Loading skills...</div>

  const skillsByDomain = student?.skills?.reduce((acc: any, skill: any) => {
    if (!acc[skill.domain]) acc[skill.domain] = []
    acc[skill.domain].push(skill)
    return acc
  }, {}) || {}

  const totalSkills = student?.skills?.length || 0
  const verifiedSkills = student?.skills?.filter((s: any) => s.verifiedLevel !== null).length || 0
  const selfDeclared = student?.skills?.filter((s: any) => s.source === 'self').length || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Skill Intelligence & Distribution</h1>
        <p className="text-gray-500 mt-1">Objective breakdown of your technical competencies across self-declaration, resume parsing, and verified trainer evaluations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Self-Declared Only</p>
            <span className="bg-gray-50 p-1.5 rounded text-gray-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg></span>
          </div>
          <p className="text-4xl font-bold text-gray-900">{selfDeclared}</p>
          <p className="text-xs text-gray-500 mt-2">Awaiting resume or assessment verification.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Resume Grounded</p>
            <span className="bg-blue-50 p-1.5 rounded text-blue-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>
          </div>
          <p className="text-4xl font-bold text-blue-600">{totalSkills}</p>
          <p className="text-xs text-gray-500 mt-2">Cross-referenced in projects or work history.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold text-green-500 uppercase tracking-wider">Trainer Assessed</p>
            <span className="bg-green-50 p-1.5 rounded text-green-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></span>
          </div>
          <p className="text-4xl font-bold text-green-600">{verifiedSkills}</p>
          <p className="text-xs text-gray-500 mt-2">Gold-standard verified by technical evaluators.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(skillsByDomain).map(domain => (
          <div key={domain} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
              <h2 className="text-md font-bold text-gray-900">{domain}</h2>
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded">{skillsByDomain[domain].length} Skills</span>
            </div>
            
            <div className="space-y-4">
              {skillsByDomain[domain].map((skill: any) => {
                const level = skill.verifiedLevel || skill.selfLevel || 1
                const percentage = (level / 10) * 100
                
                return (
                  <div key={skill.id}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-gray-800 text-sm">{skill.skillName}</p>
                      <div className="flex gap-2">
                        {skill.verifiedLevel && <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase border border-green-200">Assessed: {skill.verifiedLevel}/10</span>}
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase">{level}/10</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`h-2 rounded-full ${skill.verifiedLevel ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}