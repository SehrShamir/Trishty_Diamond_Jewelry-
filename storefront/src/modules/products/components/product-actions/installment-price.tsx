import { convertToLocale } from "@lib/util/money"

type InstallmentPriceProps = {
  amount: number
  currencyCode: string
  months?: number
}

const InstallmentPrice = ({
  amount,
  currencyCode,
  months = 4,
}: InstallmentPriceProps) => {
  if (!amount || amount <= 0) return null

  const monthly = amount / months
  const formatted = convertToLocale({ amount: monthly, currency_code: currencyCode })

  return (
    <p className="text-xs text-gray-500 font-light tracking-wide">
      Pay in {months} interest-free installments of{" "}
      <span className="text-gray-700">{formatted}</span> each
    </p>
  )
}

export default InstallmentPrice
