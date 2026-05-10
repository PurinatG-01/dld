import { TrendingUp } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  icon: React.ElementType
  trend?: string
  color: string
}

export function StatCard({ label, value, icon: Icon, trend, color }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex-1">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-xl ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
    </div>
  )
}
