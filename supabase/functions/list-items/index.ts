import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const authHeader = req.headers.get("Authorization")
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  // Forward the caller's JWT so queries are scoped by RLS
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  )

  // Verify session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  // Resolve caller's branch
  const { data: profile } = await supabase
    .from("user")
    .select("branch_id")
    .eq("id", user.id)
    .single()

  const url = new URL(req.url)
  const branchId = url.searchParams.get("branch_id") ?? profile?.branch_id

  if (!branchId) {
    return new Response(JSON.stringify({ error: "branch_id not resolved" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  // Pagination params
  const page  = Math.max(1, parseInt(url.searchParams.get("page")  ?? "1"))
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "20")))
  const search = url.searchParams.get("search") ?? ""
  const from = (page - 1) * limit
  const to   = from + limit - 1

  let query = supabase
    .from("item")
    .select(
      `id, name, category, unit_of_measure, reorder_point, is_active, created_at, updated_at,
       item_stock(quantity)`,
      { count: "exact" }
    )
    .eq("branch_id", branchId)
    .eq("is_active", true)
    .order("name", { ascending: true })
    .range(from, to)

  if (search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`)
  }

  const { data, error, count } = await query

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  const items = (data ?? []).map((item: Record<string, unknown>) => ({
    ...item,
    total_quantity: ((item.item_stock as { quantity: number }[]) ?? []).reduce(
      (sum, s) => sum + (s.quantity ?? 0), 0
    ),
    item_stock: undefined,
  }))

  const total = count ?? 0

  return new Response(
    JSON.stringify({
      data: items,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  )
})
