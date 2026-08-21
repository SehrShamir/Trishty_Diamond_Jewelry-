"use client"

import Link from "next/link"
import React from "react"

/**
 * A simple Link wrapper. Country code is no longer part of the URL,
 * so this just renders a standard Next.js <Link />.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: any
}) => {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
