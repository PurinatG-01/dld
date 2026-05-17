"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import {
  Package,
  ChevronLeft,
  AlertTriangle,
  Thermometer,
  ShieldAlert,
  Barcode,
} from "lucide-react"
import {
  getItemStock,
  type GetItemStockResult,
  type ItemStockRecord,
} from "@/lib/services/inventory"

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-700",
  RESERVED: "bg-yellow-100 text-yellow-700",
  QUARANTINE: "bg-orange-100 text-orange-700",
  EXPIRED: "bg-red-100 text-red-700",
  DISPOSED: "bg-slate-100 text-slate-500",
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function isExpiringSoon(expiryDateIso: string | null): boolean {
  if (!expiryDateIso) return false
  const diff = new Date(expiryDateIso).getTime() - Date.now()
  return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000 // within 90 days
}

export default function ItemStockPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [data, setData] = useState<GetItemStockResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getItemStock(id)
      .then(setData)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load stock"),
      )
      .finally(() => setLoading(false))
  }, [id])

  const totalQty =
    data?.stocks.reduce((sum, s) => sum + s.quantity_on_hand, 0) ?? 0

  return (
    <div className="min-h-screen bg-background p-6 pb-24 md:pb-6">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-sm mb-6 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Inventory
        </button>

        {loading && (
          <div className="text-center text-slate-400 py-24">Loading…</div>
        )}

        {error && <div className="text-center text-red-500 py-24">{error}</div>}

        {!loading && !error && data && (
          <>
            {/* Item header card */}
            <div className="bg-white rounded-4xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-indigo-50">
                  <Package size={24} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold text-slate-900">
                      {data.item.name}
                    </h1>
                    {data.item.is_controlled_drug && (
                      <span className="flex items-center gap-1 text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        <ShieldAlert size={11} />
                        Controlled
                      </span>
                    )}
                    {data.item.requires_refrigeration && (
                      <span className="flex items-center gap-1 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        <Thermometer size={11} />
                        Cold chain
                      </span>
                    )}
                  </div>
                  {data.item.generic_name && (
                    <p className="text-sm text-slate-500 mt-0.5">
                      {data.item.generic_name}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-3xl font-bold text-slate-900">
                    {totalQty}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {data.item.unit_of_measure} total
                  </p>
                </div>
              </div>

              {/* Meta grid */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <MetaField label="Category" value={data.item.category} />
                <MetaField
                  label="Subcategory"
                  value={data.item.subcategory ?? "—"}
                />
                <MetaField
                  label="Internal SKU"
                  value={data.item.internal_sku ?? "—"}
                />
                <MetaField
                  label="Barcode / GTIN"
                  value={data.item.barcode_gtin ?? "—"}
                  icon={data.item.barcode_gtin ? <Barcode size={13} /> : null}
                />
                <MetaField
                  label="Reorder point"
                  value={
                    data.item.reorder_point !== null
                      ? String(data.item.reorder_point)
                      : "—"
                  }
                  highlight={totalQty <= (data.item.reorder_point ?? Infinity)}
                />
                <MetaField
                  label="Par level"
                  value={
                    data.item.par_level !== null
                      ? String(data.item.par_level)
                      : "—"
                  }
                />
                <MetaField
                  label="Max level"
                  value={
                    data.item.max_level !== null
                      ? String(data.item.max_level)
                      : "—"
                  }
                />
                <MetaField
                  label="Pack size"
                  value={
                    data.item.pack_size !== null
                      ? String(data.item.pack_size)
                      : "—"
                  }
                />
              </div>
            </div>

            {/* Stock batch table */}
            <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">
                  Stock batches
                  <span className="ml-2 text-sm font-normal text-slate-400">
                    ({data.stocks.length})
                  </span>
                </h2>
              </div>

              {data.stocks.length === 0 ? (
                <div className="px-6 py-12 text-center text-slate-400 text-sm">
                  No stock found at this branch
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Lot / Serial</th>
                      <th className="px-6 py-4">Expiry</th>
                      <th className="px-6 py-4">Received</th>
                      <th className="px-6 py-4 text-right">Qty</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.stocks.map((stock) => (
                      <StockRow key={stock.id} stock={stock} />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function MetaField({
  label,
  value,
  icon,
  highlight,
}: {
  label: string
  value: string
  icon?: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
        {label}
      </p>
      <p
        className={`mt-0.5 font-medium flex items-center gap-1 ${
          highlight ? "text-red-500" : "text-slate-700"
        }`}
      >
        {icon}
        {value}
        {highlight && <AlertTriangle size={13} className="text-red-400" />}
      </p>
    </div>
  )
}

function StockRow({ stock }: { stock: ItemStockRecord }) {
  const expiringSoon = isExpiringSoon(stock.expiry_date)
  const expired = stock.expiry_date && new Date(stock.expiry_date) < new Date()

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
      <td className="px-6 py-3 text-slate-700">
        {stock.location_name ?? stock.location_id}
      </td>
      <td className="px-6 py-3 text-slate-500 font-mono text-xs">
        {stock.lot_number ?? stock.serial_number ?? "—"}
      </td>
      <td className="px-6 py-3">
        <span
          className={
            expired
              ? "text-red-500 font-medium"
              : expiringSoon
                ? "text-orange-500 font-medium"
                : "text-slate-500"
          }
        >
          {formatDate(stock.expiry_date)}
          {expiringSoon && !expired && (
            <AlertTriangle size={12} className="inline ml-1 text-orange-400" />
          )}
        </span>
      </td>
      <td className="px-6 py-3 text-slate-400">
        {formatDate(stock.received_date)}
      </td>
      <td className="px-6 py-3 text-right font-semibold text-slate-800">
        {stock.quantity_on_hand}
      </td>
      <td className="px-6 py-3">
        <span
          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
            STATUS_STYLES[stock.status] ?? "bg-slate-100 text-slate-500"
          }`}
        >
          {stock.status}
        </span>
      </td>
    </tr>
  )
}
