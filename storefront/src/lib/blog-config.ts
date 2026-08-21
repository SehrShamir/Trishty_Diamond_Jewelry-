/** Avoid stale empty blog pages while Ghost is being set up in Docker dev. */
export const blogRevalidate =
  process.env.NODE_ENV === "development" ? 0 : 60
