'use client'

import { Package } from 'lucide-react'
import { useInventory, getProductsWithStock } from '@/lib/inventory-context'

export function StockTable() {
  const { state } = useInventory()
  const products = getProductsWithStock(state.products, state.items)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-slate-400 text-[11px] uppercase tracking-widest border-b border-slate-50">
            <th className="pb-4 font-bold">Product</th>
            <th className="pb-4 font-bold">Stock</th>
            <th className="pb-4 font-bold">Status</th>
            <th className="pb-4 font-bold text-right">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {products.map(p => (
            <tr key={p.id} className="group hover:bg-slate-50/50 transition-all duration-300">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    p.isLowStock ? 'bg-rose-50 text-rose-400' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{p.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase">{p.category}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 text-xs font-bold">
                <span className={p.isLowStock ? 'text-rose-600' : 'text-slate-800'}>
                  {p.stockCount} {p.unit}
                </span>
              </td>
              <td className="py-4">
                <span className={`text-[10px] px-3 py-1 rounded-full font-bold ${
                  p.isLowStock
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {p.isLowStock ? 'Low Stock' : 'In Stock'}
                </span>
              </td>
              <td className="py-4 text-right text-xs font-bold text-slate-900">
                ฿{(p.stockCount * p.price).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
