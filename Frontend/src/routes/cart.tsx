import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/site-shell";
import { useStore, useAuth } from "@/lib/store";
import { api } from "@/lib/api";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart — Treadly" }] }),
  component: CartPage,
});

function CartPage() {
  const { cart, removeFromCart, cartTotal, addToCart, clearCart } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const handleCheckout = async () => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    setCheckingOut(true);
    setCheckoutError("");
    try {
      await api.createOrder({
        name: user.name,
        email: user.email,
        address: "123 Main Street",
        city: "Mumbai",
        zip: "400001",
      });
      clearCart();
      setOrderDone(true);
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  if (orderDone) {
    return (
      <Shell>
        <section className="grid min-h-[50vh] place-items-center px-6">
          <div className="text-center">
            <p className="font-display text-3xl font-bold">Order placed!</p>
            <p className="mt-2 text-sm text-neutral-500">Thank you for shopping with Treadly.</p>
            <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white">
              Continue Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </Shell>
    );
  }

  return (
    <Shell>
      <section className="px-6 pb-16 md:px-10">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Your Bag</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {cart.length === 0
            ? "Your bag is empty — time to lace up."
            : `${cart.length} product${cart.length > 1 ? "s" : ""} ready to ship.`}
        </p>

        {cart.length === 0 ? (
          <div className="mt-10 grid place-items-center rounded-3xl bg-[#f4f4f4] py-24">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-white ring-1 ring-black/10">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <p className="mt-4 font-display text-xl font-bold">Nothing here yet</p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500"
            >
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl bg-[#f4f4f4] p-4 transition hover:bg-white hover:shadow-md hover:ring-1 hover:ring-black/5"
                >
                  <div className="grid h-24 w-28 shrink-0 place-items-center rounded-xl bg-white">
                    <img src={item.img} alt={item.name} className="h-full w-full object-contain p-2" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      Shoes
                    </p>
                    <p className="truncate font-display font-bold">{item.name}</p>
                    <p className="mt-1 text-sm text-neutral-600">Qty {item.qty}</p>
                  </div>
                  <p className="font-display font-bold">${item.price * item.qty}</p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white"
                    >
                      + Add
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="grid h-8 w-full place-items-center rounded-full bg-white text-neutral-500 ring-1 ring-black/10 transition hover:bg-red-500 hover:text-white"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-3xl bg-[#f4f4f4] p-6">
              <p className="font-display text-lg font-bold">Order Summary</p>
              <div className="mt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={`$${cartTotal}`} />
                <Row label="Shipping" value="Free" />
                <Row label="Tax" value={`$${Math.round(cartTotal * 0.05)}`} />
                <div className="my-3 h-px bg-neutral-300" />
                <Row label="Total" value={`$${cartTotal + Math.round(cartTotal * 0.05)}`} bold />
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-60"
              >
                {checkingOut ? "Processing..." : user ? "Checkout" : "Sign in to Checkout"}{" "}
                <ArrowRight className="h-4 w-4" />
              </button>
              {checkoutError && (
                <p className="mt-2 text-center text-xs text-red-500">{checkoutError}</p>
              )}
              <p className="mt-3 text-center text-xs text-neutral-500">Free shipping on all orders.</p>
            </aside>
          </div>
        )}
      </section>
    </Shell>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-display text-lg font-bold" : "text-neutral-600"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
