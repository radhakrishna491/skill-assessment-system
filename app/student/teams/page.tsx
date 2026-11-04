'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth-client'

export default function TeamRecommendations() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

    fetch('/api/student/recommendations', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.recommendations) setRecommendations(data.recommendations)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  if (loading) return <div className="text-gray-500">Loading AI recommendations...</div>

  const topMatch = recommendations.length > 0 ? recommendations[0] : null
  const alternatives = recommendations.length > 1 ? recommendations.slice(1) : []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Explainable Team Recommendations</h1>
        <p className="text-gray-500 mt-1">Algorithmic matchmaking comparing student verified competencies against technical team prerequisites.</p>
      </div>

      {topMatch && (
        <div className="border-2 border-blue-500 rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                  Top Recommended Team (Rank #1)
                </span>
                <h2 className="text-3xl font-bold text-gray-900">{topMatch.teamName}</h2>
                <p className="text-gray-500 mt-1">{topMatch.domain}</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-4xl font-extrabold text-blue-600">{Math.round(topMatch.score * 100)}%</p>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Explainable Match Score</p>
              </div>
            </div>

            {/* Justification Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span className="text-orange-500">✨</span> Recommendation Justification:
              </p>
              <p className="text-sm text-gray-600">{topMatch.reasons}</p>
            </div>

            {/* Matched vs Missing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                  <span>✓</span> Demonstrated Prerequisite Skills ({topMatch.matchedSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topMatch.matchedSkills.map((skill: string, idx: number) => (
                    <span key={idx} className="bg-white border border-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                <h3 className="text-sm font-bold text-orange-800 mb-3 flex items-center gap-2">
                  <span>⚠</span> Identified Competency Gaps ({topMatch.missingSkills.length})
                </h3>
                {topMatch.missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {topMatch.missingSkills.map((skill: string, idx: number) => (
                      <span key={idx} className="bg-white border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-orange-600 italic">All prerequisites met.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alternatives */}
      <div className="pt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider">Alternative Suitable Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alternatives.map((alt, idx) => (
            <div key={alt.teamId} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Rank #{idx + 2}</span>
                <span className="text-lg font-bold text-gray-900">{Math.round(alt.score * 100)}%</span>
              </div>
              <h3 className="font-bold text-gray-900 mt-2">{alt.teamName}</h3>
              <p className="text-xs text-gray-500 mb-4">{alt.domain}</p>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">{alt.reasons}</p>
              <button className="text-blue-600 text-sm font-semibold hover:underline">View Details &rarr;</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}