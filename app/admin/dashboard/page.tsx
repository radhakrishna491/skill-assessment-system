'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, getUser, removeToken } from '@/lib/auth-client'

export default function AdminDashboard() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const user = getUser()

  // Create Team Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState([{ skill: '', weight: 5 }])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` }
        
        const [usersRes, teamsRes] = await Promise.all([
          fetch('/api/admin/users', { headers }),
          fetch('/api/admin/teams', { headers })
        ])

        if (usersRes.ok) {
          const data = await usersRes.json()
          setUsers(data.users)
        }
        if (teamsRes.ok) {
          const data = await teamsRes.json()
          setTeams(data.teams)
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

  const handleAddSkillField = () => {
    setSkills([...skills, { skill: '', weight: 5 }])
  }

  const handleSkillChange = (index: number, field: string, value: any) => {
    const newSkills = [...skills]
    newSkills[index] = { ...newSkills[index], [field]: value }
    setSkills(newSkills)
  }

  const handleRemoveSkillField = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const token = getToken()

    try {
      const res = await fetch('/api/admin/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          domain,
          description,
          requiredSkills: skills.filter(s => s.skill.trim() !== '')
        })
      })

      if (res.ok) {
        const data = await res.json()
        setTeams([...teams, data.team])
        setIsModalOpen(false)
        setName('')
        setDomain('')
        setDescription('')
        setSkills([{ skill: '', weight: 5 }])
      } else {
        alert('Failed to create team')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-900">Loading Admin Data...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Control Center</h1>
            <p className="text-gray-500">Manage system users and technical teams.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition">
              + Create Team
            </button>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition">
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">System Users ({users.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Role</th>
                    <th className="p-4 font-medium">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u: any) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition text-gray-900">
                      <td className="p-4 font-medium">{u.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'TRAINER' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">{u.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teams List */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Active Teams ({teams.length})</h2>
            {teams.map(team => (
              <div key={team.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold">
                    {team.domain}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{team.description}</p>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(team.requiredSkills).map((req: any, i: number) => (
                      <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full text-xs font-medium">
                        {req.skill || req} (W: {req.weight || 1})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Create Team Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Create New Team</h2>
              
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                  <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Cloud Engineers" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                  <input required value={domain} onChange={e => setDomain(e.target.value)} placeholder="e.g. Cloud Computing" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input required value={description} onChange={e => setDescription(e.target.value)} placeholder="Builds cloud infrastructure..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills & Weights</label>
                  {skills.map((s, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input required value={s.skill} onChange={e => handleSkillChange(index, 'skill', e.target.value)} placeholder="Skill (e.g. AWS)" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" />
                      <select value={s.weight} onChange={e => handleSkillChange(index, 'weight', parseInt(e.target.value))} className="w-24 px-2 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white">
                        <option value={5}>W: 5</option>
                        <option value={4}>W: 4</option>
                        <option value={3}>W: 3</option>
                        <option value={2}>W: 2</option>
                        <option value={1}>W: 1</option>
                      </select>
                      {skills.length > 1 && (
                        <button type="button" onClick={() => handleRemoveSkillField(index)} className="text-red-500 hover:text-red-700 px-2 font-bold">✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={handleAddSkillField} className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-1">
                    + Add another skill
                  </button>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50">
                    {submitting ? 'Creating...' : 'Create Team'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}