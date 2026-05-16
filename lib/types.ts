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
  name: string
  generic_name: string | null
  brand: string | null
  internal_sku: string | null
  barcode_gtin: string | null
  category: string
  subcategory: string | null
  unit_of_measure: string
  pack_size: number | null
  default_supplier_id: string | null
  default_unit_cost: number | null
  currency: string | null
  par_level: number | null
  reorder_point: number | null
  max_level: number | null
  lead_time_days: number | null
  is_controlled_drug: boolean
  requires_refrigeration: boolean
  is_serialized: boolean
  created_at: string
  updated_at: string
  created_by: string | null
}

export type ItemStock = {
  id: string
  item_id: string
  location_id: string
  lot_number: string | null
  serial_number: string | null
  expiry_date: string | null
  manufacturing_date: string | null
  received_date: string | null
  quantity_on_hand: number
  unit_cost_at_receipt: number | null
  status: string
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
