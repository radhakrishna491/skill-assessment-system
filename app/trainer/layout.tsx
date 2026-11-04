'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getToken, getUser, removeToken } from '@/lib/auth-client'

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = getToken()
    if (!token) {
      router.push('/login')
    } else {
      setUser(getUser())
    }
  }, [router])

  const handleLogout = () => {
    removeToken()
    router.push('/login')
  }

  if (!mounted || !user) return null

  const navItems = [
    { name: 'Trainer Console', path: '/trainer/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Assigned Students', path: '/trainer/students', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Expertise & Profile', path: '/trainer/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-900 text-white p-1.5 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">SkillSync <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded ml-1">AI</span></h1>
            <p className="text-xs text-gray-500">Assessment & Team Allocation</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">TRAINER</span>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition ml-2">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-[#F8FAFC] border-r border-gray-200 p-4 shrink-0 overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Trainer Navigation</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <Link key={item.name} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}>
                  <svg className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                  </svg>
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}