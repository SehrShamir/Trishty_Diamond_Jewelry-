export const colors = {
  // Background colors
  background: {
    primary: "#ffffff",
    secondary: "#fffbf7",
    tertiary: "#f7f7f7",
    muted: "#e0e0e0",
    dark: "#151542",
  },
  
  // Text colors
  text: {
    primary: "#1a1a1a",
    secondary: "#898989",
    tertiary: "#454653",
    inverse: "#ffffff",
    link: "#0066ff",
  },
  
  // Brand colors
  brand: {
    dark: "#111827",
    darkMuted: "#374151",
    accent: "#111827",
    blue: "#0066ff",
    blueBright: "#007aff",
    bluePurple: "#2b21ff",
  },
  
  // Semantic colors
  semantic: {
    success: "#7ec13e",
    error: "#ff407b",
    warning: "#fbd802",
    info: "#13a8e2",
  },
  
  // Border colors
  border: {
    DEFAULT: "#e0e0e0",
    light: "#e4e4e4",
    dark: "#1b1b1b",
  },
} as const

export type Colors = typeof colors
