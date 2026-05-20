"use client"

import { useEffect, useState } from "react"

/** true when width > height (landscape), false when portrait. */
export function useIsLandscape(): boolean {
  const [landscape, setLandscape] = useState(false)

  useEffect(() => {
    const update = () => setLandscape(window.innerWidth > window.innerHeight)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return landscape
}
