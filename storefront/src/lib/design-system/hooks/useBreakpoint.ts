"use client"

import { useEffect, useState } from "react"

type Breakpoint = "2xsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge"

export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>("2xsmall")

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      
      if (width >= 1920) setCurrentBreakpoint("2xlarge")
      else if (width >= 1680) setCurrentBreakpoint("xlarge")
      else if (width >= 1440) setCurrentBreakpoint("large")
      else if (width >= 1280) setCurrentBreakpoint("medium")
      else if (width >= 1024) setCurrentBreakpoint("small")
      else if (width >= 512) setCurrentBreakpoint("xsmall")
      else setCurrentBreakpoint("2xsmall")
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return {
    currentBreakpoint,
    isMobile: currentBreakpoint === "2xsmall" || currentBreakpoint === "xsmall",
    isTablet: currentBreakpoint === "small",
    isDesktop: ["medium", "large", "xlarge", "2xlarge"].includes(currentBreakpoint),
  }
}
