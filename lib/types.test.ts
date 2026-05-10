import { MOCK_PRODUCTS, MOCK_ITEMS } from './mock-data'
import type { ItemStatus } from './types'

describe('mock data shape', () => {
  it('every product has required fields', () => {
    for (const p of MOCK_PRODUCTS) {
      expect(p.id).toBeDefined()
      expect(p.name).toBeDefined()
      expect(p.category).toBeDefined()
      expect(p.unit).toBeDefined()
      expect(typeof p.price).toBe('number')
      expect(typeof p.minThreshold).toBe('number')
    }
  })

  it('every item has a valid status enum value', () => {
    const validStatuses: ItemStatus[] = ['in_stock', 'dispensed', 'expired', 'damaged']
    for (const item of MOCK_ITEMS) {
      expect(validStatuses).toContain(item.status)
    }
  })

  it('every item references a valid product id', () => {
    const productIds = new Set(MOCK_PRODUCTS.map(p => p.id))
    for (const item of MOCK_ITEMS) {
      expect(productIds.has(item.productId)).toBe(true)
    }
  })

  it('initial stock counts match prototype quantities', () => {
    const countByProduct = MOCK_ITEMS.reduce<Record<string, number>>((acc, item) => {
      if (item.status === 'in_stock') {
        acc[item.productId] = (acc[item.productId] ?? 0) + 1
      }
      return acc
    }, {})
    expect(countByProduct['prod-1']).toBe(12)   // Composite A2
    expect(countByProduct['prod-2']).toBe(45)   // Lidocaine
    expect(countByProduct['prod-3']).toBe(3)    // Suture (low stock)
    expect(countByProduct['prod-4']).toBe(2)    // Implant Kit (low stock)
    expect(countByProduct['prod-5']).toBe(200)  // Sterilization Pouches
  })
})
