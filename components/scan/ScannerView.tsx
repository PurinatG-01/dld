'use client'

import { useState } from 'react'
import { X, CheckCircle, AlertCircle, Camera } from 'lucide-react'
import { useInventory } from '@/lib/inventory-context'
import { useRouter } from 'next/navigation'

type ScanMode = 'in' | 'out'

interface ScannerViewProps {
  mode: ScanMode
}

type ScanState = 'idle' | 'scanning' | 'success' | 'error'

export function ScannerView({ mode }: ScannerViewProps) {
  const { state, dispatch } = useInventory()
  const router = useRouter()
  const [scanState, setScanState] = useState<ScanState>('idle')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [message, setMessage] = useState('')

  const inStockItems = state.items.filter(i => i.status === 'in_stock')
  const productMap = new Map(state.products.map(p => [p.id, p]))

  function handleScan() {
    if (!selectedProductId) {
      setMessage('Select a product to scan')
      setScanState('error')
      return
    }

    setScanState('scanning')

    setTimeout(() => {
      if (mode === 'in') {
        dispatch({ type: 'SCAN_IN', payload: { productId: selectedProductId, newItemId: `item-${Date.now()}` } })
        setMessage('Item restocked successfully')
        setScanState('success')
      } else {
        const item = inStockItems.find(i => i.productId === selectedProductId)
        if (!item) {
          setMessage('No in-stock items found for this product')
          setScanState('error')
          return
        }
        dispatch({ type: 'SCAN_OUT', payload: { itemId: item.id } })
        setMessage('Item dispensed successfully')
        setScanState('success')
      }
    }, 600)
  }

  function handleClose() {
    router.push('/dashboard')
  }

  function handleReset() {
    setScanState('idle')
    setMessage('')
    setSelectedProductId('')
  }

  const isIn = mode === 'in'

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col text-white" data-testid="scanner-view">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-safe">
        <div>
          <h1 className="text-lg font-bold">
            {isIn ? 'Scan In' : 'Scan Out'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isIn ? 'Add stock to inventory' : 'Dispense from inventory'}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close scanner"
        >
          <X size={20} />
        </button>
      </div>

      {/* Viewfinder */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <div className="w-64 h-64 rounded-3xl border-2 border-dashed border-white/30 flex items-center justify-center bg-white/5">
          {scanState === 'scanning' ? (
            <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          ) : scanState === 'success' ? (
            <CheckCircle size={56} className="text-emerald-400" />
          ) : scanState === 'error' ? (
            <AlertCircle size={56} className="text-rose-400" />
          ) : (
            <Camera size={56} className="text-white/30" />
          )}
        </div>

        {message && (
          <p className={`text-sm font-medium text-center ${
            scanState === 'success' ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {message}
          </p>
        )}

        {/* Product selector */}
        {(scanState === 'idle' || scanState === 'error') && (
          <div className="w-full max-w-sm space-y-3">
            <label className="text-xs text-slate-400 uppercase tracking-wider">
              Select Product
            </label>
            <select
              value={selectedProductId}
              onChange={e => {
                setSelectedProductId(e.target.value)
                setScanState('idle')
                setMessage('')
              }}
              className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-indigo-400"
            >
              <option value="" className="bg-slate-800">Choose product…</option>
              {state.products.map(p => {
                const stockCount = inStockItems.filter(i => i.productId === p.id).length
                return (
                  <option key={p.id} value={p.id} className="bg-slate-800">
                    {p.name} {mode === 'out' ? `(${stockCount} in stock)` : ''}
                  </option>
                )
              })}
            </select>
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="p-6 pb-safe space-y-3">
        {scanState === 'success' ? (
          <button
            onClick={handleReset}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-colors"
          >
            Scan Another
          </button>
        ) : (
          <button
            onClick={handleScan}
            disabled={scanState === 'scanning'}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-colors"
          >
            {scanState === 'scanning' ? 'Processing…' : isIn ? 'Confirm Restock' : 'Confirm Dispense'}
          </button>
        )}
        <button
          onClick={handleClose}
          className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
