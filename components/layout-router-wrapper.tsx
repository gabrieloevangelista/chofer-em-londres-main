"use client"

import { useEffect, useState } from "react"

interface LayoutRouterWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function LayoutRouterWrapper({ children, fallback = null }: LayoutRouterWrapperProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Wait for the next tick to ensure the component is mounted
    setTimeout(() => {
      setIsReady(true)
    }, 0)
  }, [])

  if (!isReady) {
    return <>{fallback}</>
  }

  return <>{children}</>
}