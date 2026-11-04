'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth-client'

export default function TechnicalTeams() {
  const router = useRouter()
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) return

    fetch('/api/admin/teams', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.teams) setTeams(data.teams)
        setLoading(false)
      })
  }, [router])

  if (loading) return <div className="text-gray-500">Loading teams...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Technical Teams & Configurable Requirements</h1>
        <p className="text-gray-500 mt-1">Define domain-specific prerequisites, proficiency thresholds, and mandatory requirements driving AI matching.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {teams.map((team) => (
          <div key={team.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{team.domain}</p>
                <h2 className="text-xl font-bold text-gray-900">{team.name}</h2>
              </div>
              <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Configure Criteria
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">{team.description}</p>
            
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-800 uppercase mb-3">Configured Requirements</p>
              <div className="space-y-2">
                {JSON.parse(team.requiredSkills).map((req: any, idx: number) => {
                  const skillName = typeof req === 'string' ? req : req.skill
                  const weight = typeof req === 'string' ? 1 : req.weight
                  return (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{skillName}</span>
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 uppercase">Mandatory</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">Weight: {weight}/5</span>
                        <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">advanced</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-auto border-t border-gray-100 pt-4 flex justify-between items-center text-sm">
              <span className="text-gray-500 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> 1 Students Allocated</span>
              <span className="text-gray-500">Capacity: 4 - 15</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}