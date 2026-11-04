'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth-client'

export default function AdminAnalytics() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])

  useEffect(() => {
    const token = getToken()
    if (!token) return

    const fetchData = async () => {
      const headers = { Authorization: `Bearer ${token}` }
      const [usersRes, teamsRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/teams', { headers })
      ])
      if (usersRes.ok) setUsers((await usersRes.json()).users)
      if (teamsRes.ok) setTeams((await teamsRes.json()).teams)
      setLoading(false)
    }
    fetchData()
  }, [router])

  if (loading) return <div className="text-gray-500">Loading analytics...</div>

  const students = users.filter(u => u.role === 'STUDENT').length
  const trainers = users.filter(u => u.role === 'TRAINER').length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Executive Administration & Allocation Command</h1>
        <p className="text-gray-500 mt-1">Institutional overview of student competencies, team allocations, trainer caseloads, and evaluation throughput.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Students</p>
            <p className="text-4xl font-bold text-gray-900">{students}</p>
            <p className="text-xs text-gray-500 mt-1">Active in university portal</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg"><svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Faculty Trainers</p>
            <p className="text-4xl font-bold text-gray-900">{trainers}</p>
            <p className="text-xs text-gray-500 mt-1">Across engineering departments</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg"><svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Technical Teams</p>
            <p className="text-4xl font-bold text-gray-900">{teams.length}</p>
            <p className="text-xs text-gray-500 mt-1">Configured prerequisite criteria</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg"><svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Allocations</p>
            <p className="text-4xl font-bold text-gray-900">1</p>
            <p className="text-xs text-gray-500 mt-1">2 approved</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg"><svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Team Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 uppercase">Team-wise Allocation Distribution</h2>
              <p className="text-xs text-gray-500 mt-1">Approved student placements across specialized technical teams.</p>
            </div>
            <button className="text-blue-600 text-sm font-semibold hover:underline">Manage Teams</button>
          </div>
          <div className="space-y-5">
            {teams.map(team => (
              <div key={team.id}>
                <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                  <span>{team.domain}</span>
                  <span className="text-blue-600 text-xs">1 Students</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Density */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-bold text-gray-900 uppercase mb-6">Skill Domain Density</h2>
          <div className="space-y-5">
             <div>
                <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                  <span>Programming Languages</span>
                  <span className="text-green-600 text-xs">3 Competencies</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                  <span>Web & Full Stack Development</span>
                  <span className="text-green-600 text-xs">6 Competencies</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                  <span>Data Science & Machine Learning</span>
                  <span className="text-green-600 text-xs">5 Competencies</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}