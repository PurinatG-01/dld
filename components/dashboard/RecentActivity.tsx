'use client'

import { ArrowUpRight, ArrowDownLeft, Clock, Activity } from 'lucide-react'
import { useInventory } from '@/lib/inventory-context'

export function RecentActivity() {
  const { state } = useInventory()
  const productMap = new Map(state.products.map(p => [p.id, p]))

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-slate-400" />
          <h2 className="text-sm font-bold text-slate-900">Recent Activity</h2>
        </div>
        <Activity size={14} className="text-slate-300" />
      </div>

      {state.logs.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">No activity yet</p>
      ) : (
        <div className="space-y-5">
          {state.logs.slice(0, 4).map(log => {
            const product = productMap.get(log.productId)
            return (
              <div key={log.id} className="flex gap-4 items-start group">
                <div className={`p-2 rounded-lg shrink-0 ${
                  log.type === 'IN'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-orange-50 text-orange-600'
                }`}>
                  {log.type === 'IN' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                </div>
                <div className="flex-1 border-b border-slate-50 pb-3 group-last:border-0">
                  <div className="flex justify-between items-start">
                    <p className="text-[11px] font-bold text-slate-800">
                      {product?.name ?? 'Unknown item'}
                    </p>
                    <span className="text-[9px] text-slate-400 font-medium uppercase">{log.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {log.type === 'IN' ? 'Restocked' : 'Dispensed'} 1 unit
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
