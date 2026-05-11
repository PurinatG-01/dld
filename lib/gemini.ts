import type { ProductWithStock } from '@/lib/types'

export interface AuditReport {
  summary: string
  lowStockAlerts: string[]
  recommendations: string[]
}

// Phase 2: replace with real Gemini API call using @google/generative-ai
export async function generateAuditReport(
  _products: ProductWithStock[]
): Promise<AuditReport> {
  throw new Error('Gemini integration not yet configured. Coming in Phase 2.')
}
