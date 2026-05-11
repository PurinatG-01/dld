import { Suspense } from 'react'
import { ScannerView } from '@/components/scan/ScannerView'
import { ScanPageClient } from './ScanPageClient'

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <ScanPageClient />
    </Suspense>
  )
}
