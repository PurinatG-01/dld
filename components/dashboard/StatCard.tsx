import { TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  icon: React.ElementType
  trend?: string
  /** Tailwind bg class for the icon pill, e.g. "bg-primary" */
  color: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color,
}: StatCardProps) {
  return (
    <div className="bg-card p-6 rounded-xl shadow-xs border border-border flex-1 min-w-36">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-lg text-primary-foreground", color)}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
      <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">
        {label}
      </p>
      <h3 className="text-2xl font-bold text-card-foreground tracking-tight">
        {value}
      </h3>
    </div>
  )
}
