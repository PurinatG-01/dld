import {
  Pill,
  FileText,
  Stethoscope,
  Droplets,
  FlaskConical,
  ShieldCheck,
  Sparkles,
  Scissors,
  type LucideIcon,
} from "lucide-react"

export type CategoryMeta = { icon: LucideIcon; bg: string; color: string }

export const CATEGORY_META: Record<string, CategoryMeta> = {
  "Anesthetics & Pharmaceuticals": {
    icon: Pill,
    bg: "bg-violet-100",
    color: "text-violet-600",
  },
  "Disposables & Office": {
    icon: FileText,
    bg: "bg-slate-100",
    color: "text-slate-500",
  },
  Endodontic: { icon: Stethoscope, bg: "bg-blue-100", color: "text-blue-600" },
  "Hygiene & Preventives": {
    icon: Droplets,
    bg: "bg-cyan-100",
    color: "text-cyan-600",
  },
  "Lab & Prosthodontic": {
    icon: FlaskConical,
    bg: "bg-amber-100",
    color: "text-amber-600",
  },
  "PPE & Infection Control": {
    icon: ShieldCheck,
    bg: "bg-emerald-100",
    color: "text-emerald-600",
  },
  "Restorative & Cosmetic": {
    icon: Sparkles,
    bg: "bg-rose-100",
    color: "text-rose-500",
  },
  "Surgical & Implant": {
    icon: Scissors,
    bg: "bg-orange-100",
    color: "text-orange-600",
  },
}
