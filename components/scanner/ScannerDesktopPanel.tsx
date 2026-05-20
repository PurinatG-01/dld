"use client"

import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Package,
  Plus,
  ScanLine,
  Trash2,
  X,
} from "lucide-react"
import { CATEGORY_META } from "@/lib/category-meta"
import { useScannerContext } from "./ScannerContext"

export function ScannerDesktopPanel() {
  const {
    isOpen,
    close,
    scanStatus,
    scannedItems,
    simulateScan,
    updateQty,
    removeItem,
    totalUnits,
    clearSession,
  } = useScannerContext()

  if (!isOpen) return null

  const handleApply = () => {
    // TODO: call stock-movement API
    clearSession()
  }

  return (
    <aside className="hidden lg:flex flex-col w-[420px] border-l border-border bg-card h-screen fixed top-0 right-0 z-40 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30 shrink-0">
        <div className="flex items-center gap-2">
          <ScanLine size={18} className="text-primary animate-pulse" />
          <span className="font-semibold text-sm text-foreground">
            Active Scanner
          </span>
        </div>
        <button
          onClick={close}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          aria-label="Close scanner"
        >
          <X size={18} />
        </button>
      </div>

      {/* Camera viewfinder */}
      <div className="px-5 py-4 bg-slate-900 flex flex-col items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 self-start text-[10px] uppercase font-bold text-white/40 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Live Video Stream
        </div>

        <div className="relative w-full max-w-[280px] aspect-[4/3] bg-black rounded-xl overflow-hidden border border-white/10">
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary" />

          {scanStatus !== "success" && (
            <div
              className={[
                "absolute left-3 right-3 h-[2px] bg-primary",
                "shadow-[0_0_12px_rgba(99,102,241,1)]",
                scanStatus === "scanning"
                  ? "animate-[scanner-beam_1.5s_ease-in-out_infinite]"
                  : "top-1/2 opacity-40",
              ].join(" ")}
            />
          )}

          {scanStatus === "success" && (
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 size={36} className="text-green-400" />
            </div>
          )}
        </div>

        <button
          onClick={simulateScan}
          disabled={scanStatus !== "idle"}
          className="w-full max-w-[280px] py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground text-xs font-semibold rounded-lg transition-all"
        >
          {scanStatus === "scanning"
            ? "Processing barcode…"
            : "Simulate Scanner Capture"}
        </button>
      </div>

      {/* Session header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/20 shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Session Items
        </span>
        <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
          {totalUnits} units
        </span>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {scannedItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <Package size={32} className="mb-2 text-primary opacity-20" />
            <p className="text-xs font-bold text-foreground">No items scanned</p>
            <p className="text-[11px] text-muted-foreground mt-1 max-w-[220px]">
              Trigger a scan above to add dental stock to this batch.
            </p>
          </div>
        ) : (
          scannedItems.map((item) => {
            const meta = CATEGORY_META[item.category]
            const Icon = meta?.icon ?? Package
            return (
              <div
                key={item.id}
                className="bg-card border border-border p-2.5 rounded-xl flex items-center gap-2.5 shadow-xs"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${meta?.bg ?? "bg-muted"}`}
                >
                  <Icon
                    size={16}
                    className={meta?.color ?? "text-muted-foreground"}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-xs text-foreground truncate"
                    title={item.name}
                  >
                    {item.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    Stock: {item.total_quantity} · {item.unit_of_measure}
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5 border border-border shrink-0">
                  <button
                    onClick={() =>
                      item.scanQty === 1
                        ? removeItem(item.id)
                        : updateQty(item.id, -1)
                    }
                    className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-destructive rounded-md transition-colors"
                  >
                    {item.scanQty === 1 ? (
                      <Trash2 size={11} className="text-destructive" />
                    ) : (
                      <Minus size={11} />
                    )}
                  </button>
                  <span className="w-4 text-center text-xs font-bold text-foreground">
                    {item.scanQty}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-primary rounded-md transition-colors"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Apply footer */}
      {scannedItems.length > 0 && (
        <div className="p-3 border-t border-border bg-card shrink-0">
          <button
            onClick={handleApply}
            className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors text-xs shadow-sm"
          >
            Review & Apply to Inventory ({scannedItems.length} items)
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </aside>
  )
}
