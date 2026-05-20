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
      {/* Floating action button — sits above BottomNav (h-16 = 4rem) */}
      <button
        onClick={open}
        aria-label="Open barcode scanner"
        className="md:hidden fixed bottom-20 right-4 z-50 w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-[0_8px_30px_rgba(0,0,0,0.25)] active:scale-95 transition-transform"
      >
        <ScanLine size={24} />
      </button>

      {/* Full-screen overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col bg-slate-950">
          {/* Overlay header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent text-white shrink-0">
            <button
              onClick={close}
              className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
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

          {/* Camera reticle area */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 -mt-16">
            <div className="relative w-64 h-64 max-w-full">
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
              onClick={simulateScan}
              disabled={scanStatus !== "idle"}
              className="px-8 py-3 bg-white/15 hover:bg-white/25 active:scale-95 disabled:opacity-50 text-white border border-white/10 rounded-full font-medium text-sm transition-all"
            >
              Tap to Simulate Scan
            </button>
          </div>

          {/* Bottom sheet */}
          <div
            className={`bg-card rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col transition-[height] duration-300 shrink-0 ${
              scannedItems.length > 0 ? "h-[50vh]" : "h-[15vh]"
            }`}
          >
            <div className="flex justify-center py-3 shrink-0">
              <div className="w-12 h-1.5 bg-muted rounded-full" />
            </div>

            <div className="px-6 pb-4 border-b border-border flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-foreground">Scanned Items</h3>
                <p className="text-xs text-muted-foreground">
                  {scannedItems.length === 0
                    ? "Scan a barcode to begin"
                    : `${totalUnits} total units`}
                </p>
              </div>
            </div>

            {scannedItems.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                <Package size={28} className="mb-1 opacity-40" />
                <p className="text-xs">Cart is empty</p>
              </div>
            )}

            {scannedItems.length > 0 && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {scannedItems.map((item) => {
                    const meta = CATEGORY_META[item.category]
                    const Icon = meta?.icon ?? Package
                    return (
                      <div
                        key={item.id}
                        className="bg-background border border-border p-3 rounded-xl flex items-center gap-3 shadow-xs"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${meta?.bg ?? "bg-muted"}`}
                        >
                          <Icon
                            size={18}
                            className={meta?.color ?? "text-muted-foreground"}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Stock: {item.total_quantity}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 bg-muted rounded-lg p-1 border border-border shrink-0">
                          <button
                            onClick={() =>
                              item.scanQty === 1
                                ? removeItem(item.id)
                                : updateQty(item.id, -1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                          >
                            {item.scanQty === 1 ? (
                              <Trash2 size={15} className="text-destructive" />
                            ) : (
                              <Minus size={15} className="text-muted-foreground" />
                            )}
                          </button>
                          <span className="w-5 text-center font-bold text-sm text-foreground">
                            {item.scanQty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                          >
                            <Plus size={15} className="text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
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
      )}
    </>
  )
}
