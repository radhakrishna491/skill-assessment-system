'use client'

export default function AllocationApprovals() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Allocation Approvals</h1>
        <p className="text-gray-500 mt-1">Review AI-generated team recommendations and grant final institutional approval.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No Pending Approvals</h2>
        <p className="text-gray-500 max-w-md mx-auto">All AI-generated recommendations have been reviewed and approved. You are all caught up!</p>
      </div>
    </div>
  )
}