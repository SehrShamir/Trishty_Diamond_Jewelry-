import { Metadata } from "next"
import { getRegion, getDefaultCountryCode } from "@lib/data/regions"
import { notFound } from "next/navigation"
import BuildYourRingClient from "./client"

export const metadata: Metadata = {
  title: "Build Your Ring | Trishty",
  description: "Create your perfect ring by selecting a setting and stone",
}

export default async function BuildYourRingPage() {
  const countryCode = await getDefaultCountryCode()
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  return <BuildYourRingClient countryCode={countryCode} />
}
