"use client"

import { useEffect, useState } from "react"

interface NavigationWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function NavigationWrapper({ children, fallback = null }: NavigationWrapperProps) {
  const [mounted, setMounted] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Aguarda um tick para garantir que o componente está completamente montado
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  // Se não estiver no cliente, retorna o fallback
  if (!isClient) {
    return <>{fallback}</>
  }

  // Se não estiver montado, retorna o fallback
  if (!mounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
} 