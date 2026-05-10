import { inventoryReducer, getProductsWithStock } from './inventory-context'
import type { InventoryState } from './inventory-context'
import { MOCK_PRODUCTS, MOCK_ITEMS } from './mock-data'

describe('getProductsWithStock', () => {
  it('computes stockCount as count of in_stock items per product', () => {
    const result = getProductsWithStock(MOCK_PRODUCTS, MOCK_ITEMS)
    const composite = result.find(p => p.id === 'prod-1')!
    expect(composite.stockCount).toBe(12)
  })

  it('marks isLowStock true when stockCount <= minThreshold', () => {
    const result = getProductsWithStock(MOCK_PRODUCTS, MOCK_ITEMS)
    const suture = result.find(p => p.id === 'prod-3')!
    expect(suture.isLowStock).toBe(true)   // 3 <= 10
    const lidocaine = result.find(p => p.id === 'prod-2')!
    expect(lidocaine.isLowStock).toBe(false) // 45 > 20
  })

  it('does not count dispensed items in stockCount', () => {
    const itemsWithDispensed = MOCK_ITEMS.map(item =>
      item.id === 'item-prod-1-1' ? { ...item, status: 'dispensed' as const } : item
    )
    const result = getProductsWithStock(MOCK_PRODUCTS, itemsWithDispensed)
    const composite = result.find(p => p.id === 'prod-1')!
    expect(composite.stockCount).toBe(11)
  })
})

describe('inventoryReducer SCAN_IN', () => {
  it('adds a new in_stock item for the given product', () => {
    const state: InventoryState = { products: MOCK_PRODUCTS, items: MOCK_ITEMS, logs: [] }
    const next = inventoryReducer(state, {
      type: 'SCAN_IN',
      payload: { productId: 'prod-1', newItemId: 'item-new-1' },
    })
    const newItem = next.items.find(i => i.id === 'item-new-1')
    expect(newItem).toBeDefined()
    expect(newItem!.status).toBe('in_stock')
    expect(newItem!.productId).toBe('prod-1')
  })

  it('prepends a log entry of type IN', () => {
    const state: InventoryState = { products: MOCK_PRODUCTS, items: MOCK_ITEMS, logs: [] }
    const next = inventoryReducer(state, {
      type: 'SCAN_IN',
      payload: { productId: 'prod-1', newItemId: 'item-new-1' },
    })
    expect(next.logs[0].type).toBe('IN')
    expect(next.logs[0].productId).toBe('prod-1')
    expect(next.logs[0].itemId).toBe('item-new-1')
  })
})

describe('inventoryReducer SCAN_OUT', () => {
  it('sets the target item status to dispensed', () => {
    const state: InventoryState = { products: MOCK_PRODUCTS, items: MOCK_ITEMS, logs: [] }
    const targetId = MOCK_ITEMS.find(i => i.productId === 'prod-1' && i.status === 'in_stock')!.id
    const next = inventoryReducer(state, {
      type: 'SCAN_OUT',
      payload: { itemId: targetId },
    })
    const updated = next.items.find(i => i.id === targetId)!
    expect(updated.status).toBe('dispensed')
  })

  it('prepends a log entry of type OUT', () => {
    const state: InventoryState = { products: MOCK_PRODUCTS, items: MOCK_ITEMS, logs: [] }
    const targetItem = MOCK_ITEMS.find(i => i.productId === 'prod-1' && i.status === 'in_stock')!
    const next = inventoryReducer(state, {
      type: 'SCAN_OUT',
      payload: { itemId: targetItem.id },
    })
    expect(next.logs[0].type).toBe('OUT')
    expect(next.logs[0].itemId).toBe(targetItem.id)
  })

  it('does not modify other items', () => {
    const state: InventoryState = { products: MOCK_PRODUCTS, items: MOCK_ITEMS, logs: [] }
    const targetId = MOCK_ITEMS.find(i => i.productId === 'prod-1')!.id
    const next = inventoryReducer(state, {
      type: 'SCAN_OUT',
      payload: { itemId: targetId },
    })
    const untouched = next.items.find(i => i.productId === 'prod-2')!
    expect(untouched.status).toBe('in_stock')
  })
})
