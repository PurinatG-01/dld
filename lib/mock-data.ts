import type { Product, Item, ItemStatus, LogEntry } from './types'

export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod-1', name: 'Composite A2 Syringe',     category: 'Restorative', unit: 'pcs',  price: 1250,  minThreshold: 5  },
  { id: 'prod-2', name: 'Lidocaine 2% (Cartridge)',  category: 'Anesthesia',  unit: 'box',  price: 850,   minThreshold: 20 },
  { id: 'prod-3', name: 'Suture Silk 4-0',           category: 'Surgery',     unit: 'box',  price: 420,   minThreshold: 10 },
  { id: 'prod-4', name: 'Dental Implant Kit X1',     category: 'Surgery',     unit: 'set',  price: 15000, minThreshold: 2  },
  { id: 'prod-5', name: 'Sterilization Pouches',     category: 'General',     unit: 'box',  price: 350,   minThreshold: 50 },
]

function makeItems(productId: string, count: number, status: ItemStatus = 'in_stock'): Item[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${productId}-${i + 1}`,
    productId,
    status,
    scannedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
}

export const MOCK_ITEMS: Item[] = [
  ...makeItems('prod-1', 12),   // Composite A2 Syringe
  ...makeItems('prod-2', 45),   // Lidocaine
  ...makeItems('prod-3', 3),    // Suture Silk (below min=10 → low stock)
  ...makeItems('prod-4', 2),    // Implant Kit (at min=2 → low stock)
  ...makeItems('prod-5', 200),  // Sterilization Pouches
]

export const MOCK_LOGS: LogEntry[] = [
  { id: 'log-1', productId: 'prod-2', itemId: 'item-prod-2-45', type: 'OUT', time: '09:45 AM' },
  { id: 'log-2', productId: 'prod-1', itemId: 'item-prod-1-12', type: 'IN',  time: '08:20 AM' },
]
