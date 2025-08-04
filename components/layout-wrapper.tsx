"use client"

import type React from "react"
import { Header } from "./header"
import { Footer } from "./footer"
import { MobileTabbar } from "./mobile-tabbar"
import { FloatingContactButton } from "./floating-contact-button"
import { ClientOnly } from "./client-only"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden" suppressHydrationWarning>
      <Header />
      <main className="flex-grow w-full pb-20 md:pb-0">{children}</main>
      <Footer />
      <ClientOnly>
        <MobileTabbar />
        <FloatingContactButton />
      </ClientOnly>
    </div>
  )
}