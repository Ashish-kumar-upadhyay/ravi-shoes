import { Cart } from "@/models/Cart";
import type { ICartItem } from "@/types";

type PopulatedCartItem = ICartItem & {
  product: { slug: string; name: string; price: number; img: string };
};

export async function getPopulatedCart(userId: string) {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) return { items: [], subtotal: 0, count: 0 };

  const items = (cart.items as PopulatedCartItem[]).map((item) => {
    const p = item.product;
    return {
      id: p.slug,
      name: p.name,
      price: p.price,
      img: p.img,
      qty: item.qty,
      size: item.size,
      color: item.color,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return { items, subtotal, count };
}

export function mergeCartItem(
  items: ICartItem[],
  productId: unknown,
  qty: number,
  size?: number,
  color?: string,
) {
  const existing = items.find(
    (i) =>
      String(i.product) === String(productId) &&
      i.size === size &&
      i.color === color,
  );

  if (existing) {
    existing.qty += qty;
  } else {
    items.push({ product: productId as ICartItem["product"], qty, size, color });
  }
}
