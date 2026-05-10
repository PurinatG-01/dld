import { CheckCircle2 } from 'lucide-react'

interface FlashMessageProps {
  message: string | null
}

export function FlashMessage({ message }: FlashMessageProps) {
  if (!message) return null

  return (
    <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-right-8 duration-500">
      <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl">
        <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
        <p className="text-sm font-bold">{message}</p>
      </div>
    </div>
  )
}
