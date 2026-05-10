export type ItemStatus = 'in_stock' | 'dispensed' | 'expired' | 'damaged'

export type Product = {
  id: string
  name: string
  category: string
  unit: string
  price: number
  minThreshold: number
}

export type Item = {
  id: string
  productId: string
  status: ItemStatus
  scannedAt: string
  updatedAt: string
}

// Derived — computed from Item[], never stored in state or DB
export type ProductWithStock = Product & {
  stockCount: number   // count of items where status === 'in_stock'
  isLowStock: boolean  // stockCount <= minThreshold
}

export type LogEntry = {
  id: string
  productId: string
  itemId: string
  type: 'IN' | 'OUT'
  time: string
}
