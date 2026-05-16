// ---------------------------------------------------------------------------
// DB-aligned types — mirror the Supabase public schema
// ---------------------------------------------------------------------------

export type UserRole = {
  id: string
  name: string
  permissions: Record<string, boolean>
  created_at: string
}

export type User = {
  id: string
  role_id: string
  branch_id: string
  name: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Branch = {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export type BranchLocation = {
  id: string
  branch_id: string
  parent_id: string | null
  name: string
  created_at: string
}

export type Supplier = {
  id: string
  name: string
  licence_number: string | null
  created_at: string
  updated_at: string
}

export type Item = {
  id: string
  branch_id: string
  name: string
  category: string
  unit_of_measure: string
  reorder_point: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ItemStock = {
  id: string
  item_id: string
  branch_location_id: string
  inbound_session_id: string | null
  lot_number: string | null
  expiry_date: string | null
  quantity: number
  unit_cost: number | null
  created_at: string
  updated_at: string
}

export type InboundSession = {
  id: string
  branch_id: string
  supplier_id: string | null
  received_by: string
  notes: string | null
  created_at: string
}

export type MovementType =
  | "INBOUND"
  | "WITHDRAWN"
  | "WASTAGE"
  | "TRANSFER"
  | "ADJUST"
  | "FLAG"
  | "UNFLAG"
  | "AUDIT"
  | "DISPOSE"

export type StockMovement = {
  id: string
  branch_id: string
  user_id: string
  inbound_session_id: string | null
  type: MovementType
  reference_id: string | null
  reference_type: string | null
  notes: string | null
  created_at: string
}

export type StockMovementItem = {
  id: string
  stock_movement_id: string
  item_stock_id: string
  quantity: number
  created_at: string
}
