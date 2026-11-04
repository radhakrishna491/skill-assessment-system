'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, getUser, removeToken } from '@/lib/auth-client'

interface Skill {
  id: string
  skillName: string
  domain: string
  selfLevel: number
  verifiedLevel: number | null
  source: string
}

export default function StudentDashboard() {
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
        
        // Fetch Profile
        const profileRes = await fetch('/api/student/profile', { headers })
        if (!profileRes.ok) throw new Error('Failed to fetch profile')
        const profileData = await profileRes.json()
        setStudent(profileData.student)

        // Fetch Recommendations
        const recRes = await fetch('/api/student/recommendations', { headers })
        if (recRes.ok) {
          const recData = await recRes.json()
          setRecommendations(recData.recommendations)
        }

        // Fetch Skill Gaps & Trainer
        const gapsRes = await fetch('/api/student/gaps', { headers })
        if (gapsRes.ok) {
          const gapData = await gapsRes.json()
          setGapsData(gapData)
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading AI Analysis...</div>

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
              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <p><strong>Branch:</strong> {student?.branch || 'Not set'}</p>
                <p><strong>Year:</strong> {student?.year || 'Not set'}</p>
              </div>

              <h3 className="text-md font-bold text-gray-800 mb-3">Skills Profile</h3>
              <div className="flex flex-wrap gap-2">
                {student?.skills?.length > 0 ? (
                  student.skills.map((skill: Skill) => (
                    <span key={skill.id} className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${
                      skill.source === 'verified' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {skill.skillName} (Lvl {skill.verifiedLevel || skill.selfLevel})
                      {skill.source === 'verified' && (
                        <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No skills added yet.</p>
                )}
              </div>
            </div>

            {/* AI Skill Gap & Trainer Recommendation */}
            {gapsData && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">AI Learning Path</h2>
                <p className="text-sm text-gray-600 mb-4">
                  To reach 100% match for <strong>{gapsData.recommendedTeam?.name}</strong>, you need to learn:
                </p>
                {gapsData.skillGaps.length > 0 ? (
                  <ul className="space-y-3 mb-6">
                    {gapsData.skillGaps.map((gap: any, idx: number) => (
                      <li key={idx} className="bg-red-50 p-3 rounded-lg border border-red-100">
                        <p className="text-sm font-bold text-red-700">{gap.skill}</p>
                        <p className="text-xs text-red-600 mt-1">{gap.learningAction}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-600 font-medium mb-6">You have all required skills for this team! 🎉</p>
                )}

                {gapsData.recommendedTrainer && (
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="text-sm font-bold text-indigo-900 mb-1">Recommended Trainer</h3>
                    <p className="text-xs text-indigo-700">{gapsData.recommendedTrainer.name}</p>
                    <p className="text-xs text-indigo-500 mt-1">Expertise: {gapsData.recommendedTrainer.expertise}</p>
                  </div>
                )}
              </div>
            )}
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