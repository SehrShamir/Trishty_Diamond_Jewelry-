export * from "./colors"
export * from "./typography"
export * from "./spacing"

// Combined design tokens
import { colors } from "./colors"
import { typography } from "./typography"
import { spacing } from "./spacing"

export const designTokens = {
  colors,
  typography,
  spacing,
} as const

export type DesignTokens = typeof designTokens
