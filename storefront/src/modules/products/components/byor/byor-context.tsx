"use client"

import { createContext, useContext, useCallback, useMemo } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export type BYORState = {
  currentStep: number
  settingProductId: string | null
  settingVariantId: string | null
  stoneProductId: string | null
  stoneVariantId: string | null
  isActive: boolean
}

type BYORContextType = BYORState & {
  setStep: (step: number) => void
  selectSetting: (productId: string, variantId: string) => void
  selectStone: (productId: string, variantId: string) => void
  preselectStone: (productId: string, variantId: string) => void
  reset: () => void
  goToStep: (step: number) => void
}

const BYORContext = createContext<BYORContextType | null>(null)

export function useBYOR() {
  const context = useContext(BYORContext)
  if (!context) {
    throw new Error("useBYOR must be used within a BYORProvider")
  }
  return context
}

export function useBYOROptional() {
  return useContext(BYORContext)
}

export function BYORProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const state = useMemo<BYORState>(() => {
    const step = parseInt(searchParams.get("step") || "0", 10)
    return {
      currentStep: step || 0,
      settingProductId: searchParams.get("setting_pid"),
      settingVariantId: searchParams.get("setting_vid"),
      stoneProductId: searchParams.get("stone_pid"),
      stoneVariantId: searchParams.get("stone_vid"),
      isActive: step > 0,
    }
  }, [searchParams])

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }
      router.push(pathname + "?" + params.toString())
    },
    [router, pathname, searchParams]
  )

  const setStep = useCallback(
    (step: number) => {
      updateParams({ step: step.toString() })
    },
    [updateParams]
  )

  const selectSetting = useCallback(
    (productId: string, variantId: string) => {
      updateParams({
        step: "2",
        setting_pid: productId,
        setting_vid: variantId,
      })
    },
    [updateParams]
  )

  const selectStone = useCallback(
    (productId: string, variantId: string) => {
      updateParams({
        step: "3",
        stone_pid: productId,
        stone_vid: variantId,
      })
    },
    [updateParams]
  )

  // Pre-select stone without advancing to step 3 (for auto-selection UX)
  const preselectStone = useCallback(
    (productId: string, variantId: string) => {
      updateParams({
        stone_pid: productId,
        stone_vid: variantId,
      })
    },
    [updateParams]
  )

  const goToStep = useCallback(
    (step: number) => {
      updateParams({ step: step.toString() })
    },
    [updateParams]
  )

  const reset = useCallback(() => {
    updateParams({
      step: null,
      setting_pid: null,
      setting_vid: null,
      stone_pid: null,
      stone_vid: null,
    })
  }, [updateParams])

  const value = useMemo<BYORContextType>(
    () => ({
      ...state,
      setStep,
      selectSetting,
      selectStone,
      preselectStone,
      goToStep,
      reset,
    }),
    [state, setStep, selectSetting, selectStone, preselectStone, goToStep, reset]
  )

  return <BYORContext.Provider value={value}>{children}</BYORContext.Provider>
}
