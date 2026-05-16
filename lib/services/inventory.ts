'use client'

import { createClient } from '@/lib/supabase/client'

export type InventoryItem = {
  id: string
  name: string
  category: string
  unit_of_measure: string
  reorder_point: number | null
  is_active: boolean
  created_at: string
  updated_at: string
  total_quantity: number
}

export type ListItemsMeta = {
  total: number
  page: number
  limit: number
  total_pages: number
}

export type ListItemsResult = {
  data: InventoryItem[]
  meta: ListItemsMeta
}

export async function listItems(params: {
  page?: number
  limit?: number
  search?: string
  branch_id?: string
}): Promise<ListItemsResult> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) throw new Error('Not authenticated')

  const url = new URL(
    `/functions/v1/list-items`,
    process.env.NEXT_PUBLIC_SUPABASE_URL
  )
  if (params.page)      url.searchParams.set('page',      String(params.page))
  if (params.limit)     url.searchParams.set('limit',     String(params.limit))
  if (params.search)    url.searchParams.set('search',    params.search)
  if (params.branch_id) url.searchParams.set('branch_id', params.branch_id)

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? 'list-items request failed')
  }

  return res.json()
}
