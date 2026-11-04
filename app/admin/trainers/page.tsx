'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth-client'

export default function TrainerManagement() {
  const router = useRouter()
  const [trainers, setTrainers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) return

    // We will use the users endpoint and filter by trainer, but for the demo we will mock the extra details
    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.users) setTrainers(data.users.filter((u: any) => u.role === 'TRAINER'))
        setLoading(false)
      })
  }, [router])

  if (loading) return <div className="text-gray-500">Loading trainers...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Faculty Trainer & Evaluator Directory</h1>
        <p className="text-gray-500 mt-1">Monitor domain specializations, student mentorship loads, and departmental affiliations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trainers.map((trainer, idx) => (
          <div key={trainer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{trainer.name}</h2>
                  <p className="text-sm text-gray-500">{idx === 0 ? 'Associate Professor & AI Lab Director' : 'Principal Software Architect & Lead Instructor'}</p>
                </div>
                <div className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 whitespace-nowrap">
                  {idx === 0 ? '9 Yrs' : '11 Yrs'} Exp
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <p className="flex items-center gap-2"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg> Computer Science & Engineering</p>
                <p className="flex items-center gap-2"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> {trainer.email}</p>
                <p className="flex items-center gap-2"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg> +1 (555) 234-5678</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Specialization:</p>
                <p className="text-sm font-medium text-gray-800">{idx === 0 ? 'Data Science, Machine Learning, Predictive Modeling' : 'Full Stack Architecture, Microservices, Cloud Native Systems'}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">Mentorship Load:</span>
              <span className="text-lg font-bold text-gray-900">{idx === 0 ? '1 / 25' : '1 / 20'} Students</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}