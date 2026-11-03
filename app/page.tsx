import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        
        <div className="inline-block bg-blue-100 text-blue-800 font-semibold px-4 py-1.5 rounded-full text-sm mb-4">
          AI-Powered Platform
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Skill Assessment & <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Team Allocation
          </span>
        </h1>
        
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Discover your technical strengths, get matched with the perfect team, and receive evaluations from expert trainers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/login" className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
            Sign In to Portal
          </Link>
          <Link href="/register" className="px-8 py-3.5 bg-white text-gray-700 border border-gray-200 hover:border-gray-300 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  )
}