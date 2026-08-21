import { retrieveCart } from "@lib/data/cart"
import CartDropdown from "../cart-dropdown"

export async function CartButton() {
  const cart = await retrieveCart().catch(() => null)

  return <CartDropdown cart={cart} />
}
