import type { MovementType, Item, ItemStock, StockMovement } from "./types"

describe("DB-aligned types", () => {
  it("MovementType covers all expected variants", () => {
    const types: MovementType[] = [
      "INBOUND",
      "WITHDRAWN",
      "WASTAGE",
      "TRANSFER",
      "ADJUST",
      "FLAG",
      "UNFLAG",
      "AUDIT",
      "DISPOSE",
    ]
    expect(types).toHaveLength(9)
  })

  it("Item type has the expected shape", () => {
    const item: Item = {
      id: "test-id",
      branch_id: "branch-id",
      name: "Test Item",
      category: "PPE",
      unit_of_measure: "box",
      reorder_point: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    expect(item.id).toBeDefined()
    expect(item.branch_id).toBeDefined()
  })

  it("ItemStock type accepts null optional fields", () => {
    const stock: ItemStock = {
      id: "stock-id",
      item_id: "item-id",
      branch_location_id: "loc-id",
      inbound_session_id: null,
      lot_number: null,
      expiry_date: null,
      quantity: 50,
      unit_cost: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    expect(stock.quantity).toBe(50)
  })
})
