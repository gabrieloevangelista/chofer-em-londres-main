"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, MapIcon, Plane, Info, Phone, Search, Menu, X, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchModal } from "./search-modal"
import { Logo } from "./logo"

function HeaderContent() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [currentPath, setCurrentPath] = useState('')

  // Get the current path on the client side
  useEffect(() => {
    setIsMounted(true)
    setCurrentPath(window.location.pathname)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Navigation items
  const navItems = [
    { name: "Início", href: "/", icon: Home },
    { name: "Tours", href: "/tours", icon: MapIcon },
    { name: "Transfer", href: "/transfer", icon: Plane },
    { name: "Sobre", href: "/sobre", icon: Info },
    { name: "Contato", href: "/contato", icon: Phone },
  ]

  // Close mobile menu when a link is clicked
  const handleNavigation = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 bg-white w-full",
          isScrolled ? "shadow-lg border-b border-gray-200" : "border-b border-gray-100",
        )}
      >
        <div className="container-custom" suppressHydrationWarning>
          <div className="flex items-center justify-between h-20" suppressHydrationWarning>
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group cursor-pointer">
<<<<<<< HEAD
              <div className="relative w-[70px] h-[70px] transition-all duration-300 group-hover:scale-105">
                <Logo />
=======
              <div className="relative w-[50px] h-[40px]">
                <Image
                  src="https://static.wixstatic.com/media/e086ef_e7f781063b5a413ea3b962b2fda1a323~mv2.png/v1/fill/w_131,h_106,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/02.png"
                  alt="Chofer em Londres Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  className="transition-all duration-300 group-hover:scale-105"
                  priority
                />
>>>>>>> 836f31ad909de4cd60c3918b6ed9eefa617e8d5c
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-2">
                {navItems.map((item) => {
                  const isActive = currentPath === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "text-sm font-medium transition-all relative py-2 px-3 rounded-md flex items-center cursor-pointer",
                          isActive
                            ? "bg-blue-50 text-primary border border-blue-100 shadow-sm"
                            : "text-gray-900 hover:bg-gray-100 hover:text-primary hover:scale-105"
                        )}
                        prefetch={false}
                      >
                        <item.icon
                          className={cn("w-4 h-4 mr-1.5", isActive ? "text-primary" : "text-gray-900")}
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Actions (Desktop) */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-200 hover:scale-105 transition-all cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/contato"
                className="btn-primary px-4 py-2 rounded-md flex items-center font-medium shadow-lg relative z-20 hover:scale-105 transition-transform cursor-pointer"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Tour
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-all cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/contato"
                className="btn-primary px-3 py-2 rounded-md flex items-center font-medium shadow-lg relative text-sm"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Agendar
              </Link>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-all cursor-pointer"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-[9997] bg-white transition-all duration-300 ease-in-out transform pt-20 px-4 overflow-y-auto",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        suppressHydrationWarning
      >
        <nav className="py-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={handleNavigation}
                    className={cn(
                      "block text-base font-medium transition-all flex items-center px-4 py-3 rounded-lg",
                      isActive
                        ? "bg-blue-50 text-primary"
                        : "text-gray-900 hover:bg-gray-100 hover:text-primary"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 mr-3", isActive ? "text-primary" : "text-gray-900")} />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[9996] bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

export function Header() {
  return <HeaderContent />
}