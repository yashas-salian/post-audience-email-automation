"use client"

import type { tabs } from "@/pages/dashboard"
import type React from "react"
import { useCallback, useState } from "react"

export interface SidebarMenuItem {
  label: string
  ariaLabel: string
  link: string
}

export interface SidebarSocialItem {
  label: string
  link: string
}

export interface StaggeredSidebarProps {
  position?: "left" | "right"
  colors?: string[]
  items?: SidebarMenuItem[]
  socialItems?: SidebarSocialItem[]
  displaySocials?: boolean
  displayItemNumbering?: boolean
  className?: string
  menuButtonColor?: string
  openMenuButtonColor?: string
  accentColor?: string
  changeMenuColorOnOpen?: boolean
  onMenuOpen?: () => void
  onMenuClose?: () => void
  children?: React.ReactNode,
  setTab: React.Dispatch<React.SetStateAction<tabs>>
}

export const StaggeredSidebar: React.FC<StaggeredSidebarProps> = ({
  position = "right",
  colors = ["#F48120", "#FAAD3F", "#404041"],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,

  menuButtonColor = "#000",
  openMenuButtonColor = "#000",
  changeMenuColorOnOpen = true,
  accentColor = "#F48120",
  onMenuOpen,
  onMenuClose,
  children,
  setTab
}: StaggeredSidebarProps) => {
  const [open, setOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const toggleMenu = useCallback(() => {
    if (isAnimating) return

    setIsAnimating(true)
    const newOpen = !open
    setOpen(newOpen)

    if (newOpen) {
      onMenuOpen?.()
    } else {
      onMenuClose?.()
    }

    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 500)
  }, [open, isAnimating, onMenuOpen, onMenuClose])

  return (
    <>
      {children ? (
        <div onClick={toggleMenu} className="cursor-pointer relative z-50">
          {children}
        </div>
      ) : (
        <button
          className="mt-4 relative inline-flex items-center gap-2 bg-[#F48120] backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 cursor-pointer font-medium leading-none overflow-visible pointer-events-auto z-50 text-white hover:bg-white hover:text-[#F48120] hover:shadow-md transition-all duration-200"
          style={{ color: open && changeMenuColorOnOpen ? openMenuButtonColor : menuButtonColor }}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={toggleMenu}
          type="button"
        >
          <div className="m-1 flex text-white hover:text-[#F48120] gap-x-2">
            <span className="text-sm font-medium">{open ? "Close" : "WorkSpace"}</span>
            <span className="relative w-4 h-4 flex items-center justify-center">
              <span
                className={`absolute w-full h-0.5 bg-current rounded transition-transform duration-300 ${
                  open ? "rotate-45" : "rotate-0"
                }`}
              />
              <span
                className={`absolute w-full h-0.5 bg-current rounded transition-transform duration-300 ${
                  open ? "-rotate-45" : "rotate-90"
                }`}
              />
            </span>
          </div>
        </button>
      )}

      {/* Sidebar overlay and panel */}
      <div
        className={`fixed inset-0 z-40 pointer-events-none transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0"
        }`}
        style={{
          ["--sm-accent" as any]: accentColor,
        }}
        data-position={position}
        data-open={open || undefined}
      >
        {/* Background overlay */}
        <div
          className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleMenu}
        />

        {/* Color layers */}
        <div
          className={`absolute top-0 ${position === "left" ? "left-0" : "right-0"} bottom-0 w-90 max-w-full pointer-events-none`}
        >
          {colors.slice(0, 2).map((color, i) => (
            <div
              key={i}
              className={`absolute top-0 ${position === "left" ? "left-0" : "right-0"} h-full w-full transition-transform duration-500 ease-out ${
                open ? "translate-x-0" : position === "left" ? "-translate-x-full" : "translate-x-full"
              }`}
              style={{
                background: color,
                transitionDelay: `${i * 70}ms`,
              }}
            />
          ))}
        </div>

        {/* Main sidebar panel */}
        <aside
          id="staggered-menu-panel"
          className={`absolute top-0 ${position === "left" ? "left-0" : "right-0"} h-full w-90 max-w-full bg-white flex flex-col px-8 py-12 overflow-y-auto backdrop-blur-xl transition-transform duration-500 ease-out pointer-events-auto ${
            open ? "translate-x-0" : position === "left" ? "-translate-x-full" : "translate-x-full"
          }`}
          style={{
            transitionDelay: open ? "150ms" : "0ms",
            WebkitBackdropFilter: "blur(12px)",
          }}
          aria-hidden={!open}
        >
          <div className="mt-10 flex-1 flex flex-col gap-8">
            <ul className="list-none m-0 p-0 flex flex-col gap-4" role="list">
              {items && items.length ? (
                items.map((item, idx) => (
                  <li
                    key={item.label + idx}
                    className="relative overflow-hidden"
                    style={{
                      transitionDelay: open ? `${300 + idx * 100}ms` : "0ms",
                    }}
                  >
                    <a
                      className={` relative text-black font-bold text-4xl md:text-4xl cursor-pointer leading-tight tracking-tight uppercase transition-all duration-300 ease-out inline-block no-underline hover:text-current py-2 pointer-events-auto ${
                        open ? "translate-y-0 rotate-0 opacity-100" : "translate-y-14 rotate-2 opacity-0"
                      }`}
                      style={{
                        color: "inherit",
                        ["--hover-color" as any]: accentColor,
                      }}
                      href={item.link}
                      aria-label={item.ariaLabel}
                      onClick={()=>{
                        setTab(item.ariaLabel as tabs)
                        toggleMenu()
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = accentColor
                        e.currentTarget.style.cursor = "pointer"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "inherit"
                      }}
                    >
                      {item.label}
                      {displayItemNumbering && (
                        <span
                          className={`absolute top-0 -right-12 text-sm font-normal transition-opacity duration-300 ${
                            open ? "opacity-60" : "opacity-0"
                          }`}
                          style={{
                            color: accentColor,
                            transitionDelay: open ? `${400 + idx * 80}ms` : "0ms",
                          }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      )}
                    </a>
                  </li>
                ))
              ) : (
                <li className="relative overflow-hidden">
                  <span className="relative text-black font-semibold text-4xl leading-tight tracking-tight uppercase">
                    No items
                  </span>
                </li>
              )}
            </ul>

            {displaySocials && socialItems && socialItems.length > 0 && (
              <div className="mt-auto pt-6 border-t border-gray-200 flex flex-col gap-4" aria-label="Social links">
                <h3
                  className={`m-0 text-lg font-semibold transition-opacity duration-300 ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    color: accentColor,
                    transitionDelay: open ? "400ms" : "0ms",
                  }}
                >
                  Connect
                </h3>
                <ul className="list-none m-0 p-0 flex flex-row items-center gap-6 flex-wrap" role="list">
                  {socialItems.map((social, i) => (
                    <li key={social.label + i}>
                      <a
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-base font-medium text-gray-700 no-underline relative inline-block py-2 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300 ease-linear hover:opacity-100 cursor-pointer pointer-events-auto ${
                          open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                        }`}
                        style={{
                          transitionDelay: open ? `${450 + i * 80}ms` : "0ms",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = accentColor
                          e.currentTarget.style.backgroundColor = "#f3f4f6"
                          e.currentTarget.style.cursor = "pointer"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#374151"
                          e.currentTarget.style.backgroundColor = "#f9fafb"
                        }}
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}
