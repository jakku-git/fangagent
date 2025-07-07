import React, { useState } from "react"
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu"
import { Menu } from "lucide-react"

const sections = [
  { id: "hero", label: "Home" },
  { id: "opportunity", label: "Opportunity" },
  { id: "how-it-works", label: "How It Works" },
  { id: "audience-insights", label: "Audience" },
  { id: "distribution-channels", label: "Channels" },
  { id: "pricing-packages", label: "Pricing" },
  { id: "success-stories", label: "Stories" },
  { id: "final-cta", label: "Get Started" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex flex-col items-start">
          <div className="flex items-center">
            <img src="/hero.png" alt="fang.com.au logo" className="h-8 w-8 mr-2" />
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold text-blue-700 tracking-wide">华人找房</span>
              <span className="font-bold text-xl text-blue-900 lowercase">fang.com.au</span>
            </div>
          </div>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)}>
          <Menu className="h-6 w-6" />
        </button>
        <div className={`md:flex flex-1 justify-end items-center space-x-4 ${open ? "block" : "hidden"} md:block`}>  
          <NavigationMenu>
            <NavigationMenuList>
              {sections.map((section) => (
                <NavigationMenuItem key={section.id}>
                  <NavigationMenuLink asChild>
                    <a
                      href={`#${section.id}`}
                      className="px-4 py-2 text-blue-900 hover:text-blue-600 font-medium transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {section.label}
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  )
} 