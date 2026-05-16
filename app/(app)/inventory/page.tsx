'use client'

import { useEffect, useState, useCallback } from 'react'
import { Package, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { listItems, type InventoryItem, type ListItemsMeta } from '@/lib/services/inventory'

const PAGE_SIZE = 20

export default function InventoryPage() {
  const [items, setItems]     = useState<InventoryItem[]>([])
  const [meta, setMeta]       = useState<ListItemsMeta | null>(null)
  const [page, setPage]       = useState(1)
  const [search, setSearch]   = useState('')
  const [query, setQuery]     = useState('')   // debounced / committed search
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const load = useCallback(async (p: number, q: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await listItems({ page: p, limit: PAGE_SIZE, search: q || undefined })
      setItems(result.data)
      setMeta(result.meta)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(page, query) }, [page, query, load])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    setQuery(search)
  }

  return (
    <div className="min-h-screen bg-[#F9F9FF] p-6 pb-24 md:pb-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Package size={20} className="text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory</h1>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search items…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          {error && (
            <div className="p-6 text-center text-sm text-red-500">{error}</div>
          )}

          {!error && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Unit</th>
                  <th className="px-6 py-4 text-right">Qty</th>
                  <th className="px-6 py-4 text-right">Reorder</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading…</td>
                  </tr>
                )}
                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No items found</td>
                  </tr>
                )}
                {!loading && items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-800">{item.name}</td>
                    <td className="px-6 py-3 text-slate-500">{item.category}</td>
                    <td className="px-6 py-3 text-slate-500">{item.unit_of_measure}</td>
                    <td className="px-6 py-3 text-right">
                      <span className={`font-semibold ${
                        item.reorder_point !== null && item.total_quantity <= item.reorder_point
                          ? 'text-red-500'
                          : 'text-slate-800'
                      }`}>
                        {item.total_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right text-slate-400">
                      {item.reorder_point ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {meta && meta.total_pages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
            <span>{meta.total} items · page {meta.page} of {meta.total_pages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
                disabled={page === meta.total_pages}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
