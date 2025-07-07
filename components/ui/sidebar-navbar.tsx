import React, { useState, useRef, useEffect } from "react"
import { Menu, X } from "lucide-react"

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

export default function SidebarNavbar() {
  const [open, setOpen] = useState(false)
  const [width, setWidth] = useState(240)
  const [resizing, setResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Show sidebar after scrolling past hero
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("hero")
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      setOpen(rect.bottom < 0)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Drag-to-resize logic
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (resizing) {
        setWidth(Math.max(180, Math.min(e.clientX, 400)))
      }
    }
    const onMouseUp = () => setResizing(false)
    if (resizing) {
      window.addEventListener("mousemove", onMouseMove)
      window.addEventListener("mouseup", onMouseUp)
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [resizing])

  return (
    <>
      {/* Collapse/Expand Button */}
      {!open && (
        <button
          className="fixed top-6 left-4 z-50 bg-blue-900 text-white p-2 rounded-full shadow-lg hover:bg-blue-800 transition-colors"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      )}
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full z-40 bg-white shadow-2xl border-r border-gray-200 transition-transform duration-300 flex flex-col ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width }}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <span className="font-bold text-lg text-blue-900">Menu</span>
          <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-gray-100">
            <X className="h-6 w-6 text-blue-900" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block px-6 py-2 rounded text-blue-900 font-medium hover:bg-blue-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* Drag handle */}
        <div
          className="absolute top-0 right-0 h-full w-2 cursor-ew-resize z-50"
          onMouseDown={() => setResizing(true)}
        />
      </div>
    </>
  )
} 