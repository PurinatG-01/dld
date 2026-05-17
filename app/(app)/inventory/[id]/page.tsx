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
import { Skeleton } from "@/components/ui/skeleton"
import { CATEGORY_META } from "@/lib/category-meta"
import {
  getItemStock,
  type GetItemStockResult,
  type ItemStockRecord,
} from "@/lib/services/inventory"

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  in_stock: "bg-emerald-100 text-emerald-700",
  partially_used: "bg-amber-100 text-amber-700",
  flagged: "bg-orange-100 text-orange-700",
  transferred: "bg-blue-100 text-blue-700",
  consumed: "bg-muted text-muted-foreground",
  disposed: "bg-destructive/10 text-destructive",
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
          className="flex items-center gap-1 text-muted-foreground hover:text-primary text-sm mb-6 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Inventory
        </button>

        {loading && (
          <>
            {/* Header card skeleton */}
            <div className="bg-card rounded-xl border border-border p-6 mb-6">
              <div className="flex items-start gap-4">
                <Skeleton className="size-14 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-8 w-16 ml-auto" />
                  <Skeleton className="h-3 w-20 ml-auto" />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
            {/* Table skeleton */}
            <div className="bg-card rounded-xl border border-border">
              <div className="px-6 py-4 border-b border-border">
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="px-6 py-3">
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="px-6 py-3">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="px-6 py-3">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="px-6 py-3">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="px-6 py-3">
                          <Skeleton className="h-4 w-10 ml-auto" />
                        </td>
                        <td className="px-6 py-3">
                          <Skeleton className="h-5 w-20 rounded-full" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="text-center text-destructive py-24">{error}</div>
        )}

        {!loading && !error && data && (
          <>
            {/* Item header card */}
            <div className="bg-card rounded-xl shadow-xs border border-border p-6 mb-6">
              <div className="flex items-start gap-4">
                {(() => {
                  const catMeta = CATEGORY_META[data.item.category]
                  if (catMeta) {
                    const Icon = catMeta.icon
                    return (
                      <span
                        className={`inline-flex items-center justify-center size-14 rounded-xl shrink-0 ${catMeta.bg}`}
                      >
                        <Icon size={26} className={catMeta.color} />
                      </span>
                    )
                  }
                  return (
                    <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                      <Package size={24} className="text-primary" />
                    </div>
                  )
                })()}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold text-card-foreground">
                      {data.item.name}
                    </h1>
                    {data.item.is_controlled_drug && (
                      <span className="flex items-center gap-1 text-xs font-medium bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
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
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {data.item.generic_name}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-3xl font-bold text-card-foreground">
                    {totalQty}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
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
            <div className="bg-card rounded-xl shadow-xs border border-border">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-card-foreground">
                  Stock batches
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({data.stocks.length})
                  </span>
                </h2>
              </div>

              {data.stocks.length === 0 ? (
                <div className="px-6 py-12 text-center text-muted-foreground text-sm">
                  No stock found at this branch
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
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
                </div>
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
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        {label}
      </p>
      <p
        className={`mt-0.5 font-medium flex items-center gap-1 ${
          highlight ? "text-destructive" : "text-card-foreground"
        }`}
      >
        {icon}
        {value}
        {highlight && <AlertTriangle size={13} className="text-destructive" />}
      </p>
    </div>
  )
}

function StockRow({ stock }: { stock: ItemStockRecord }) {
  const expiringSoon = isExpiringSoon(stock.expiry_date)
  const expired = stock.expiry_date && new Date(stock.expiry_date) < new Date()

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="px-6 py-3 text-card-foreground">
        {stock.location_name ?? stock.location_id}
      </td>
      <td className="px-6 py-3 text-muted-foreground font-mono text-xs">
        {stock.lot_number ?? stock.serial_number ?? "—"}
      </td>
      <td className="px-6 py-3">
        <span
          className={
            expired
              ? "text-destructive font-medium"
              : expiringSoon
                ? "text-orange-500 font-medium"
                : "text-muted-foreground"
          }
        >
          {formatDate(stock.expiry_date)}
          {expiringSoon && !expired && (
            <AlertTriangle size={12} className="inline ml-1 text-orange-400" />
          )}
        </span>
      </td>
      <td className="px-6 py-3 text-muted-foreground">
        {formatDate(stock.received_date)}
      </td>
      <td className="px-6 py-3 text-right font-semibold text-card-foreground">
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
