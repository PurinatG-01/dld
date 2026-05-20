"use client"

import { useEffect, useState } from "react"

export type ViewportClass = "phone" | "tablet" | "desktop"

/**
 * Classifies the current viewport using the *shorter* dimension so that
 * orientation doesn't affect the result:
 *   phone   — min(w, h) < 768   (iPhone any orientation)
 *   tablet  — min(w, h) < 1024  (iPad any orientation, portrait or landscape)
 *   desktop — min(w, h) ≥ 1024  (laptop / desktop monitor)
 *
 * Using min() means an iPad Air (820 px in portrait, 1180 px in landscape)
 * always resolves to "tablet" regardless of how it is held.
 */
function classify(w: number, h: number): ViewportClass {
  const shorter = Math.min(w, h)
  if (shorter < 768) return "phone"
  if (shorter < 1024) return "tablet"
  return "desktop"
}

export function useViewportClass(): ViewportClass {
  // Default to "desktop" for SSR — scanner starts closed so no visible flash.
  const [cls, setCls] = useState<ViewportClass>("desktop")

  useEffect(() => {
    const update = () =>
      setCls(classify(window.innerWidth, window.innerHeight))
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return cls
}
