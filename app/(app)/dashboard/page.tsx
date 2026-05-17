import { Package, Activity, TrendingUp, AlertCircle } from "lucide-react"
import { StatCard } from "@/components/dashboard/StatCard"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-6 pb-24 md:pb-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live inventory overview
          </p>
        </div>

        {/* Stat Cards — wired to real data in next step */}
        <div className="flex gap-4 overflow-x-auto pb-1">
          <StatCard
            label="Total Items"
            value="—"
            icon={Package}
            color="bg-primary"
          />
          <StatCard
            label="In Stock"
            value="—"
            icon={Activity}
            color="bg-emerald-500"
          />
          <StatCard
            label="Low Stock"
            value="—"
            icon={AlertCircle}
            color="bg-destructive"
          />
          <StatCard
            label="Expiring Soon"
            value="—"
            icon={TrendingUp}
            color="bg-amber-500"
          />
        </div>

        {/* Placeholder — inventory list wired next */}
        <div className="bg-card rounded-xl border border-border p-12 shadow-xs text-center">
          <Package size={36} className="text-muted mx-auto mb-3" />
          <p className="text-sm font-bold text-muted-foreground">
            Stock table — connecting to real data next
          </p>
        </div>
      </div>
    </div>
  )
}
