"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(false)

  // Determine initial state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme")
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      const dark = saved ? saved === "dark" : prefersDark
      setIsDark(dark)
    } catch {
      // ignore
    }
  }, [])

  const applyTheme = useCallback((dark: boolean) => {
    const root = document.documentElement
    if (dark) {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
    setIsDark(dark)
  }, [])

  return (
    <Button
      variant="outline"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => applyTheme(!isDark)}
      className="rounded-md"
    >
      <span className="sr-only">Toggle theme</span>
      {/* Simple icon swap using tokens for contrast */}
      {isDark ? <span aria-hidden="true">☀️</span> : <span aria-hidden="true">🌙</span>}
    </Button>
  )
}
