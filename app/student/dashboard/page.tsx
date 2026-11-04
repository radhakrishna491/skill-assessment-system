'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getToken, getUser } from '@/lib/auth-client'

export default function StudentOverview() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [gapsData, setGapsData] = useState<any>(null)
  const user = getUser()

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` }
        
        const [profileRes, recRes, gapsRes] = await Promise.all([
          fetch('/api/student/profile', { headers }),
          fetch('/api/student/recommendations', { headers }),
          fetch('/api/student/gaps', { headers })
        ])

        if (profileRes.ok) {
          const data = await profileRes.json()
          setStudent(data.student)
        }
        if (recRes.ok) {
          const data = await recRes.json()
          setRecommendations(data.recommendations || [])
        }
        if (gapsRes.ok) {
          const data = await gapsRes.json()
          setGapsData(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) return <div className="text-gray-500">Loading overview...</div>

  const topTeam = recommendations.length > 0 ? recommendations[0] : null
  const totalSkills = student?.skills?.length || 0
  const verifiedSkills = student?.skills?.filter((s: any) => s.source === 'verified').length || 0

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Welcome back, {user?.name}!
            <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full border border-green-200">Active Student</span>
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            {student?.branch || 'Computer Science'} • Semester {student?.year || 3}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-500 mb-2">Profile Completion</p>
          <div className="w-48 bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">85% Complete</p>
        </div>
      </div>

      {/* Official Allocation Banner */}
      {topTeam && (
        <div className="bg-[#1E293B] text-white p-8 rounded-xl shadow-md flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Official Allocation</span>
              <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded border border-green-500/30">APPROVED</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">{topTeam.teamName}</h2>
            <p className="text-gray-400 text-sm mb-4">{topTeam.domain}</p>
            <p className="text-gray-300 text-sm italic">"Allocation confirmed based on {Math.round(topTeam.score * 100)}% skill match and verified profile."</p>
          </div>
          <Link href="/student/teams" className="relative z-10 bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition">
            View Allocation Details
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Registered Skills</p>
          <div className="flex justify-between items-end">
            <p className="text-4xl font-bold text-gray-900">{totalSkills}</p>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{verifiedSkills} verified</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Profile Completion</p>
          <div className="flex justify-between items-end">
            <p className="text-4xl font-bold text-gray-900">85%</p>
            <span className="text-green-500 bg-green-50 px-2 py-1 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recommended Team</p>
          <div className="flex justify-between items-end">
            <p className="text-4xl font-bold text-gray-900">{topTeam ? Math.round(topTeam.score * 100) : 0}%</p>
            <span className="text-purple-500 bg-purple-50 px-2 py-1 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">{topTeam?.domain || 'N/A'}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Skill Gaps</p>
          <div className="flex justify-between items-end">
            <p className="text-4xl font-bold text-gray-900">{gapsData?.skillGaps?.length || 0}</p>
            <span className="text-orange-500 bg-orange-50 px-2 py-1 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Link href="/student/resume" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group">
          <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
             <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Resume Studio & Skill Extraction</h3>
          <p className="text-sm text-gray-500 mb-4">Upload your PDF resume to trigger NLP taxonomy skill parsing and verification.</p>
          <span className="text-blue-600 text-sm font-semibold group-hover:underline flex items-center gap-1">Manage Resume &rarr;</span>
        </Link>

        <Link href="/student/teams" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group">
          <div className="bg-purple-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-100 transition">
             <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Explainable Team Recommendations</h3>
          <p className="text-sm text-gray-500 mb-4">Review your AI matching scores, matched vs missing requirements, and justifications.</p>
          <span className="text-purple-600 text-sm font-semibold group-hover:underline flex items-center gap-1">Explore Teams &rarr;</span>
        </Link>

        <Link href="/student/feedback" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group">
          <div className="bg-green-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition">
             <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Skill Gap Diagnosis & Roadmap</h3>
          <p className="text-sm text-gray-500 mb-4">View trainer rubric feedback, identified competency deltas, and curated learning activities.</p>
          <span className="text-green-600 text-sm font-semibold group-hover:underline flex items-center gap-1">Review Feedback &rarr;</span>
        </Link>
      </div>

    </div>
  )
}