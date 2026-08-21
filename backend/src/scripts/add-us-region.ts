import { createRegionsWorkflow } from "@medusajs/medusa/core-flows"

export default async function myScript({ container }) {
  await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "United States",
          currency_code: "usd",
          countries: ["us"],
        }
      ]
    }
  })
}
