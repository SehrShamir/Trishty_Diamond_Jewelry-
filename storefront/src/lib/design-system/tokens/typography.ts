export const typography = {
  fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"].join(", "),
    serif: ["Cinzel", "Georgia", "serif"].join(", "),
  },

  fontSize: {
    xs: "0.75rem",    // 12px
    sm: "0.8125rem",  // 13px
    base: "0.875rem", // 14px
    md: "1rem",       // 16px
    lg: "1.25rem",    // 20px
    xl: "1.5rem",     // 24px
    "2xl": "2rem",    // 32px
    "3xl": "2.75rem", // 44px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: "0.875rem",  // 14px
    normal: "1.25rem",  // 20px
    relaxed: "1.625rem", // 26px
    loose: "3.5rem",    // 56px
  },
} as const

export type Typography = typeof typography
