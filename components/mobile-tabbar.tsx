"use client"

import { Home, MapIcon, Plane, Phone, Info } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LayoutRouterWrapper } from "./layout-router-wrapper"
import { useSafePathname } from "../hooks/use-safe-pathname"

function MobileTabbarContent() {
  const pathname = useSafePathname()

  const tabs = [
    {
      name: "Início",
      href: "/",
      icon: Home,
    },
    {
      name: "Tours",
      href: "/tours",
      icon: MapIcon,
    },
    {
      name: "Transfer",
      href: "/transfer",
      icon: Plane,
    },
    {
      name: "Sobre",
      href: "/sobre",
      icon: Info,
    },
    {
      name: "Contato",
      href: "/contato",
      icon: Phone,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-primary border-t border-blue-600 flex justify-around items-center h-16 px-2 shadow-lg">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link key={tab.name} href={tab.href} className="flex flex-col items-center justify-center w-full h-full">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full mb-0.5",
                  isActive ? "bg-white text-primary" : "text-white",
                )}
              >
                <tab.icon className="w-5 h-5" />
              </div>
              <span className={cn("text-xs font-medium", isActive ? "text-white" : "text-blue-200")}>{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function MobileTabbar() {
  return (
    <LayoutRouterWrapper fallback={null}>
      <MobileTabbarContent />
    </LayoutRouterWrapper>
  )
}
