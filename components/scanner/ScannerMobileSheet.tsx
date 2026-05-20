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
import { useScannerContext, type ScannedItem } from "./ScannerContext"

// ─── shared sub-components ────────────────────────────────────────────────────

function CameraViewfinder({
  scanStatus,
  onSimulate,
  mobile = false,
}: {
  scanStatus: ReturnType<typeof useScannerContext>["scanStatus"]
  onSimulate: () => void
  mobile?: boolean
}) {
  const reticleSize = mobile ? "w-64 h-64" : "w-72 h-72"
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 w-full">
      <div className={`relative ${reticleSize} max-w-full`}>
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white/80 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white/80 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white/80 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white/80 rounded-br-xl" />

        {scanStatus !== "success" && (
          <div
            className={[
              "absolute left-3 right-3 h-[2px] bg-primary",
              "shadow-[0_0_20px_2px_rgba(99,102,241,0.8)]",
              scanStatus === "scanning"
                ? "animate-[scanner-beam_1.5s_ease-in-out_infinite]"
                : "top-1/2 opacity-50",
            ].join(" ")}
          />
        )}

        {scanStatus === "success" && (
          <div className="absolute inset-0 border-4 border-green-500 rounded-xl bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 size={48} className="text-green-400 drop-shadow-md" />
          </div>
        )}
      </div>

      <button
        onClick={onSimulate}
        disabled={scanStatus !== "idle"}
        className="px-8 py-3 bg-white/15 hover:bg-white/25 active:scale-95 disabled:opacity-50 text-white border border-white/10 rounded-full font-medium text-sm transition-all"
      >
        Tap to Simulate Scan
      </button>
    </div>
  )
}

function ItemRow({
  item,
  onDecrement,
  onIncrement,
  onRemove,
  compact = false,
}: {
  item: ScannedItem
  onDecrement: () => void
  onIncrement: () => void
  onRemove: () => void
  compact?: boolean
}) {
  const meta = CATEGORY_META[item.category]
  const Icon = meta?.icon ?? Package
  const iconSize = compact ? "w-9 h-9" : "w-10 h-10"
  const controlSize = compact ? "w-7 h-7" : "w-8 h-8"
  const iconInner = compact ? 15 : 18

  return (
    <div className="bg-background border border-border p-3 rounded-xl flex items-center gap-3 shadow-xs">
      <div
        className={`${iconSize} rounded-lg flex items-center justify-center shrink-0 ${meta?.bg ?? "bg-muted"}`}
      >
        <Icon size={iconInner} className={meta?.color ?? "text-muted-foreground"} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground">Stock: {item.total_quantity}</p>
      </div>

      <div className="flex items-center gap-2 bg-muted rounded-lg p-1 border border-border shrink-0">
        <button
          onClick={item.scanQty === 1 ? onRemove : onDecrement}
          className={`${controlSize} flex items-center justify-center rounded-md transition-colors`}
        >
          {item.scanQty === 1 ? (
            <Trash2 size={14} className="text-destructive" />
          ) : (
            <Minus size={14} className="text-muted-foreground" />
          )}
        </button>
        <span className="w-5 text-center font-bold text-sm text-foreground">
          {item.scanQty}
        </span>
        <button
          onClick={onIncrement}
          className={`${controlSize} flex items-center justify-center rounded-md transition-colors`}
        >
          <Plus size={14} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}

// ─── main export ─────────────────────────────────────────────────────────────

export function ScannerMobileSheet() {
  const {
    isOpen,
    open,
    close,
    scanStatus,
    scannedItems,
    simulateScan,
    updateQty,
    removeItem,
    totalUnits,
    clearSession,
  } = useScannerContext()

  const handleApply = () => {
    // TODO: call stock-movement API
    clearSession()
  }

  return (
    <>
      {/* FAB — phone only (md+ uses the sidebar Scan Item button) */}
      <button
        onClick={open}
        aria-label="Open barcode scanner"
        className="md:hidden fixed bottom-20 right-4 z-50 w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-[0_8px_30px_rgba(0,0,0,0.25)] active:scale-95 transition-transform"
      >
        <ScanLine size={24} />
      </button>

      {/* Overlay — visible on phone + tablet, hidden on desktop (lg+) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">

          {/* ── PHONE layout (< md / 768px): vertical stack ── */}
          <div className="md:hidden flex flex-col h-full bg-slate-950">
            {/* header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent text-white shrink-0">
              <button
                onClick={close}
                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close scanner"
              >
                <X size={20} />
              </button>
              <div className="text-sm font-medium text-slate-200">
                {scanStatus === "scanning" ? (
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    Scanning…
                  </span>
                ) : (
                  "Scan barcode"
                )}
              </div>
              <div className="w-10" aria-hidden />
            </div>

            {/* camera */}
            <div className="flex-1 flex flex-col items-center justify-center -mt-16">
              <CameraViewfinder
                scanStatus={scanStatus}
                onSimulate={simulateScan}
                mobile
              />
            </div>

            {/* bottom sheet */}
            <div
              className={`bg-card rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col transition-[height] duration-300 shrink-0 ${
                scannedItems.length > 0 ? "h-[50vh]" : "h-[15vh]"
              }`}
            >
              <div className="flex justify-center py-3 shrink-0">
                <div className="w-12 h-1.5 bg-muted rounded-full" />
              </div>

              <div className="px-6 pb-4 border-b border-border shrink-0">
                <h3 className="font-bold text-foreground">Scanned Items</h3>
                <p className="text-xs text-muted-foreground">
                  {scannedItems.length === 0
                    ? "Scan a barcode to begin"
                    : `${totalUnits} total units`}
                </p>
              </div>

              {scannedItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                  <Package size={28} className="mb-1 opacity-40" />
                  <p className="text-xs">Cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {scannedItems.map((item) => (
                      <ItemRow
                        key={item.id}
                        item={item}
                        onDecrement={() => updateQty(item.id, -1)}
                        onIncrement={() => updateQty(item.id, 1)}
                        onRemove={() => removeItem(item.id)}
                      />
                    ))}
                  </div>
                  <div className="p-4 border-t border-border shrink-0">
                    <button
                      onClick={handleApply}
                      className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      Confirm & Update Stock
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── TABLET layout (md → lg / 768–1023px): 70/30 horizontal split ── */}
          <div className="hidden md:flex flex-row h-full">

            {/* Left — camera (70%) */}
            <div className="flex flex-col w-[70%] h-full bg-slate-950">
              {/* header */}
              <div className="flex items-center gap-3 p-5 bg-gradient-to-b from-black/60 to-transparent text-white shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shrink-0" />
                <div className="text-sm font-medium text-slate-200 flex-1">
                  {scanStatus === "scanning" ? "Scanning…" : "Point camera at barcode"}
                </div>
              </div>

              {/* camera area fills remaining height */}
              <div className="flex-1 flex items-center justify-center">
                <CameraViewfinder scanStatus={scanStatus} onSimulate={simulateScan} />
              </div>
            </div>

            {/* Right — detail panel (30%) */}
            <div className="flex flex-col w-[30%] h-full bg-card border-l border-border">
              {/* panel header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                <div>
                  <h3 className="font-bold text-foreground text-sm">Scanned Items</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {scannedItems.length === 0
                      ? "Scan a barcode to begin"
                      : `${totalUnits} total units`}
                  </p>
                </div>
                <button
                  onClick={close}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  aria-label="Close scanner"
                >
                  <X size={18} />
                </button>
              </div>

              {/* items */}
              {scannedItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                  <Package size={32} className="mb-2 text-primary opacity-20" />
                  <p className="text-xs font-bold text-foreground">No items scanned</p>
                  <p className="text-[11px] mt-1 max-w-[180px]">
                    Simulate a scan on the left to add stock to this batch.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {scannedItems.map((item) => (
                      <ItemRow
                        key={item.id}
                        item={item}
                        compact
                        onDecrement={() => updateQty(item.id, -1)}
                        onIncrement={() => updateQty(item.id, 1)}
                        onRemove={() => removeItem(item.id)}
                      />
                    ))}
                  </div>
                  <div className="p-3 border-t border-border shrink-0">
                    <button
                      onClick={handleApply}
                      className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold flex items-center justify-center gap-1.5 text-xs transition-colors shadow-sm"
                    >
                      Apply to Inventory ({scannedItems.length})
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      )}
    </>
  )
}
