import { Sparkles } from 'lucide-react'

export function AIAuditor() {
  return (
    <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} />
        <h2 className="text-sm font-bold tracking-tight">DLD Intelligence</h2>
      </div>
      <p className="text-xs text-indigo-100 mb-6 leading-relaxed">
        AI-powered stock auditing coming in Phase 2. Connect Gemini to generate clinical
        replenishment insights and surgery-day readiness reports.
      </p>
      <button
        disabled
        className="w-full bg-white/20 text-white/50 py-3 rounded-2xl text-xs font-bold cursor-not-allowed flex items-center justify-center gap-2"
        title="Available in Phase 2"
      >
        <Sparkles size={14} />
        Analyze Current Stock
      </button>
    </div>
  )
}
