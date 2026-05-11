'use client'

import { useSearchParams } from 'next/navigation'
import { ScannerView } from '@/components/scan/ScannerView'

export function ScanPageClient() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') === 'out' ? 'out' : 'in'
  return <ScannerView mode={mode} />
}
