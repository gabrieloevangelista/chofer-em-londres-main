"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

/**
 * A hook to safely get the pathname on the client side, preventing Next.js router errors
 * during server-side rendering or before the client has fully mounted.
 */
export function useSafePathname() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return pathname
}