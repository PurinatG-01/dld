'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { Product, Item, LogEntry, ProductWithStock } from './types'
import { MOCK_PRODUCTS, MOCK_ITEMS, MOCK_LOGS } from './mock-data'

export type InventoryState = {
  products: Product[]
  items: Item[]
  logs: LogEntry[]
}

type Action =
  | { type: 'SCAN_IN'; payload: { productId: string; newItemId: string } }
  | { type: 'SCAN_OUT'; payload: { itemId: string } }

export const initialState: InventoryState = {
  products: MOCK_PRODUCTS,
  items: MOCK_ITEMS,
  logs: MOCK_LOGS,
}

export function getProductsWithStock(products: Product[], items: Item[]): ProductWithStock[] {
  return products.map(product => {
    const stockCount = items.filter(
      item => item.productId === product.id && item.status === 'in_stock'
    ).length
    return {
      ...product,
      stockCount,
      isLowStock: stockCount <= product.minThreshold,
    }
  })
}

export function inventoryReducer(state: InventoryState, action: Action): InventoryState {
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  switch (action.type) {
    case 'SCAN_IN': {
      const { productId, newItemId } = action.payload
      const newItem: Item = {
        id: newItemId,
        productId,
        status: 'in_stock',
        scannedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        productId,
        itemId: newItemId,
        type: 'IN',
        time: now,
      }
      return {
        ...state,
        items: [...state.items, newItem],
        logs: [newLog, ...state.logs],
      }
    }

    case 'SCAN_OUT': {
      const { itemId } = action.payload
      const target = state.items.find(i => i.id === itemId)
      if (!target) return state
      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        productId: target.productId,
        itemId,
        type: 'OUT',
        time: now,
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === itemId
            ? { ...item, status: 'dispensed', updatedAt: new Date().toISOString() }
            : item
        ),
        logs: [newLog, ...state.logs],
      }
    }

    default:
      return state
  }
}

type InventoryContextValue = {
  state: InventoryState
  dispatch: React.Dispatch<Action>
}

const InventoryContext = createContext<InventoryContextValue | null>(null)

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialState)
  return (
    <InventoryContext.Provider value={{ state, dispatch }}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory(): InventoryContextValue {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be used inside InventoryProvider')
  return ctx
}
