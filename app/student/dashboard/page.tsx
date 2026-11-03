'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, getUser, removeToken } from '@/lib/auth-client'

interface Skill {
  id: string
  skillName: string
  domain: string
  selfLevel: number
}

interface Recommendation {
  teamId: string
  teamName: string
  domain: string
  description: string
  score: number
  matchedSkills: string[]
  missingSkills: string[]
  reasons: string
}

export default function StudentDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const user = getUser()

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        // Fetch Profile
        const profileRes = await fetch('/api/student/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!profileRes.ok) throw new Error('Failed to fetch profile')
        const profileData = await profileRes.json()
        setStudent(profileData.student)

        // Fetch Recommendations
        const recRes = await fetch('/api/student/recommendations', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (recRes.ok) {
          const recData = await recRes.json()
          setRecommendations(recData.recommendations)
        }

      } catch (err) {
        console.error(err)
        removeToken()
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = () => {
    removeToken()
    router.push('/login')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Loading your dashboard...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
            <p className="text-gray-500">Here is your AI skill assessment overview.</p>
          </div>
          <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Profile & Skills */}
          <div className="space-y-8 md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Your Profile</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Branch:</strong> {student?.branch || 'Not set'}</p>
                <p><strong>Year:</strong> {student?.year || 'Not set'}</p>
              </div>

              <h3 className="text-md font-bold text-gray-800 mt-6 mb-3">Verified Skills</h3>
              <div className="flex flex-wrap gap-2">
                {student?.skills?.length > 0 ? (
                  student.skills.map((skill: Skill) => (
                    <span key={skill.id} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
                      {skill.skillName} (Lvl {skill.selfLevel})
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No skills added yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Recommendations */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-800">AI Team Recommendations</h2>
            
            {recommendations.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                No team recommendations available yet. Upload a resume or add skills!
              </div>
            ) : (
              recommendations.map((rec) => (
                <div key={rec.teamId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{rec.teamName}</h3>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {Math.round(rec.score * 100)}% Match
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{rec.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      {rec.matchedSkills.length > 0 && (
                        <p className="text-green-700">
                          <strong>Matched:</strong> {rec.matchedSkills.join(', ')}
                        </p>
                      )}
                      {rec.missingSkills.length > 0 && (
                        <p className="text-red-500">
                          <strong>Missing:</strong> {rec.missingSkills.join(', ')}
                        </p>
                      )}
                      <p className="text-gray-500 italic mt-2">{rec.reasons}</p>
                    </div>
                  </div>

                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition whitespace-nowrap">
                    Apply to Team
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  )
}