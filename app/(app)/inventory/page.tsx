"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Package,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  listItems,
  type InventoryItem,
  type ListItemsMeta,
  type SortBy,
  type SortDir,
} from "@/lib/services/inventory"

const PAGE_SIZE = 20

type Column = {
  key: SortBy | null // null = not sortable (e.g. total_quantity is client-aggregated)
  label: string
  align?: "right"
}

const COLUMNS: Column[] = [
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "unit_of_measure", label: "Unit" },
  { key: null, label: "Qty", align: "right" },
  { key: "reorder_point", label: "Reorder", align: "right" },
]

export default function InventoryPage() {
  const router = useRouter()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [meta, setMeta] = useState<ListItemsMeta | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [query, setQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortBy>("name")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (p: number, q: string, sb: SortBy, sd: SortDir) => {
      setLoading(true)
      setError(null)
      try {
        const result = await listItems({
          page: p,
          limit: PAGE_SIZE,
          search: q || undefined,
          sort_by: sb,
          sort_dir: sd,
        })
        setItems(result.data)
        setMeta(result.meta)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load inventory")
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    load(page, query, sortBy, sortDir)
  }, [page, query, sortBy, sortDir, load])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    setQuery(search)
  }

  function handleSort(col: SortBy) {
    if (col === sortBy) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(col)
      setSortDir("asc")
    }
    setPage(1)
  }

  function SortIcon({ col }: { col: SortBy }) {
    if (col !== sortBy)
      return <ChevronUp size={12} className="opacity-20 ml-1 inline" />
    return sortDir === "asc" ? (
      <ChevronUp size={12} className="ml-1 inline text-primary" />
    ) : (
      <ChevronDown size={12} className="ml-1 inline text-primary" />
    )
  }

  return (
    <div className="min-h-screen bg-background p-6 pb-24 md:pb-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Package size={20} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Inventory
          </h1>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="text"
              placeholder="Search items…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {/* Table */}
        <div className="bg-card rounded-xl shadow-xs border border-border overflow-hidden">
          {error && (
            <div className="p-6 text-center text-sm text-destructive">
              {error}
            </div>
          )}

          {!error && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {COLUMNS.map((col) => (
                    <th
                      key={col.label}
                      className={`px-6 py-4 ${col.align === "right" ? "text-right" : ""} ${
                        col.key
                          ? "cursor-pointer select-none hover:text-foreground"
                          : ""
                      }`}
                      onClick={() => col.key && handleSort(col.key)}
                    >
                      {col.label}
                      {col.key && <SortIcon col={col.key} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="px-6 py-3">
                        <Skeleton className="h-4 w-40" />
                      </td>
                      <td className="px-6 py-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-6 py-3">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Skeleton className="h-4 w-10 ml-auto" />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Skeleton className="h-4 w-10 ml-auto" />
                      </td>
                    </tr>
                  ))}
                {!loading && items.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      No items found
                    </td>
                  </tr>
                )}
                {!loading &&
                  items.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => router.push(`/inventory/${item.id}`)}
                      className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-3 font-medium text-card-foreground">
                        {item.name}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {item.category}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {item.unit_of_measure}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span
                          className={`font-semibold ${
                            item.reorder_point !== null &&
                            item.total_quantity <= item.reorder_point
                              ? "text-destructive"
                              : "text-card-foreground"
                          }`}
                        >
                          {item.total_quantity}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right text-muted-foreground">
                        {item.reorder_point ?? "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {meta && meta.total_pages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>
              {meta.total} items · page {meta.page} of {meta.total_pages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setPage((p) => Math.min(meta.total_pages, p + 1))
                }
                disabled={page === meta.total_pages}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
