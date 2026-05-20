"use client"

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react"

export type ScanStatus = "idle" | "scanning" | "success"

export type ScannedItem = {
  id: string
  name: string
  category: string
  unit_of_measure: string
  total_quantity: number
  reorder_point: number | null
  scanQty: number
}

type ScannerContextType = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  scanStatus: ScanStatus
  scannedItems: ScannedItem[]
  simulateScan: () => void
  updateQty: (id: string, change: number) => void
  removeItem: (id: string) => void
  clearSession: () => void
  totalUnits: number
}

const ScannerContext = createContext<ScannerContextType | null>(null)

export function useScannerContext() {
  const ctx = useContext(ScannerContext)
  if (!ctx) throw new Error("useScannerContext must be inside ScannerProvider")
  return ctx
}

// Placeholder items — replaced with real barcode lookup once camera integration lands
const MOCK_ITEMS: Omit<ScannedItem, "scanQty">[] = [
  {
    id: "1",
    name: "3M Filtek Z350 XT คอมโพสิต เฉดสี A2",
    category: "Restorative & Cosmetic",
    unit_of_measure: "ไซริงค์ (4g)",
    total_quantity: 10,
    reorder_point: 5,
  },
  {
    id: "2",
    name: "3M Filtek Z350 XT คอมโพสิต เฉดสี A3",
    category: "Restorative & Cosmetic",
    unit_of_measure: "ไซริงค์ (4g)",
    total_quantity: 14,
    reorder_point: 5,
  },
  {
    id: "3",
    name: "AH Plus Sealer ซีลเลอร์",
    category: "Endodontic",
    unit_of_measure: "ชุด (4g+4g)",
    total_quantity: 0,
    reorder_point: 3,
  },
  {
    id: "4",
    name: "Articaine 4% + Epinephrine 1:100000 (Septanest)",
    category: "Anesthetics & Pharmaceuticals",
    unit_of_measure: "กล่อง (50 คาร์พูล)",
    total_quantity: 1,
    reorder_point: 2,
  },
  {
    id: "5",
    name: "CaviCide น้ำยาฆ่าเชื้อพื้นผิว",
    category: "PPE & Infection Control",
    unit_of_measure: "ขวด (946 mL)",
    total_quantity: 0,
    reorder_point: 3,
  },
  {
    id: "6",
    name: "GC Fuji IX GP แก้วไอโอโนเมอร์",
    category: "Restorative & Cosmetic",
    unit_of_measure: "ชุด (15g powder + 8mL liquid)",
    total_quantity: 0,
    reorder_point: 3,
  },
  {
    id: "7",
    name: "HVE Tips (ดูดน้ำลายใหญ่)",
    category: "Disposables & Office",
    unit_of_measure: "กล่อง (100 ชิ้น)",
    total_quantity: 0,
    reorder_point: 5,
  },
  {
    id: "8",
    name: "Lidocaine 2% + Epinephrine 1:100000 (Lignospan)",
    category: "Anesthetics & Pharmaceuticals",
    unit_of_measure: "กล่อง (50 คาร์พูล)",
    total_quantity: 4,
    reorder_point: 3,
  },
]

export function ScannerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle")
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  const simulateScan = useCallback(() => {
    if (scanStatus !== "idle") return
    setScanStatus("scanning")
    setTimeout(() => {
      const item = MOCK_ITEMS[Math.floor(Math.random() * MOCK_ITEMS.length)]
      setScannedItems((prev) => {
        const idx = prev.findIndex((i) => i.id === item.id)
        if (idx > -1) {
          const updated = [...prev]
          updated[idx] = { ...updated[idx], scanQty: updated[idx].scanQty + 1 }
          return updated
        }
        return [{ ...item, scanQty: 1 }, ...prev]
      })
      setScanStatus("success")
      setTimeout(() => setScanStatus("idle"), 700)
    }, 1000)
  }, [scanStatus])

  const updateQty = useCallback((id: string, change: number) => {
    setScannedItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, scanQty: Math.max(1, item.scanQty + change) }
          : item,
      ),
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setScannedItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearSession = useCallback(() => {
    setScannedItems([])
    setIsOpen(false)
  }, [])

  const totalUnits = scannedItems.reduce((acc, i) => acc + i.scanQty, 0)

  return (
    <ScannerContext.Provider
      value={{
        isOpen,
        open,
        close,
        toggle,
        scanStatus,
        scannedItems,
        simulateScan,
        updateQty,
        removeItem,
        clearSession,
        totalUnits,
      }}
    >
      {children}
    </ScannerContext.Provider>
  )
}
