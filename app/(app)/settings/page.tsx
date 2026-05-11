import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F9F9FF] p-6 pb-24 md:pb-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Settings size={20} className="text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        </div>
        <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-slate-100 text-center">
          <Settings size={40} className="text-slate-200 mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-400">Clinic settings and configuration coming in Phase 2</p>
        </div>
      </div>
    </div>
  )
}
