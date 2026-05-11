'use client'

import { Package, Activity, TrendingUp, AlertCircle, Plus, Camera } from 'lucide-react'
import { useInventory, getProductsWithStock } from '@/lib/inventory-context'
import { StatCard } from '@/components/dashboard/StatCard'
import { StockTable } from '@/components/dashboard/StockTable'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { AIAuditor } from '@/components/dashboard/AIAuditor'
import { FlashMessage } from '@/components/ui/FlashMessage'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function DashboardContent() {
  const { state } = useInventory()
  const router = useRouter()
  const searchParams = useSearchParams()
  const flash = searchParams.get('flash')

  const products = getProductsWithStock(state.products, state.items)
  const totalProducts = products.length
  const lowStockCount = products.filter(p => p.isLowStock).length
  const totalValue = products.reduce((sum, p) => sum + p.stockCount * p.price, 0)
  const totalItems = state.items.filter(i => i.status === 'in_stock').length

  return (
    <div className="min-h-screen bg-[#F9F9FF] p-6 pb-24 md:pb-6">
      <FlashMessage message={flash} />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-xs text-slate-400 mt-0.5">Live inventory overview</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/scan?mode=in')}
              className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"
            >
              <Plus size={14} />
              Restock
            </button>
            <button
              onClick={() => router.push('/scan?mode=out')}
              className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <Camera size={14} />
              Scan Out
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="flex gap-4 overflow-x-auto pb-1">
          <StatCard
            label="Total Products"
            value={String(totalProducts)}
            icon={Package}
            color="bg-indigo-500"
          />
          <StatCard
            label="Items In Stock"
            value={String(totalItems)}
            icon={Activity}
            trend="+12%"
            color="bg-emerald-500"
          />
          <StatCard
            label="Stock Value"
            value={`฿${totalValue.toLocaleString()}`}
            icon={TrendingUp}
            color="bg-violet-500"
          />
          <StatCard
            label="Low Stock Alerts"
            value={String(lowStockCount)}
            icon={AlertCircle}
            color={lowStockCount > 0 ? 'bg-rose-500' : 'bg-slate-400'}
          />
        </div>

        {/* Stock Table */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 mb-6">Current Stock</h2>
          <StockTable />
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentActivity />
          <AIAuditor />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  )
}
