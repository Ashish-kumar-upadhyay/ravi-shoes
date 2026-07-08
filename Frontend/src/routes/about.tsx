import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site-shell";
import { ShieldCheck, Truck, Headphones, Award, Users } from "lucide-react";
import { buildPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    buildPageMeta({
      title: "About Luxury Shoes — Premium Footwear Store",
      description:
        "Learn about Luxury Shoes — India's trusted online store for premium designer footwear, luxury sneakers and formal shoes.",
      path: "/about",
    }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Shell>
      <div className="px-6 py-10 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            About Luxury Shoes
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-600">
            We believe luxury shoes are the foundation of confidence. Our mission is to bring premium
            designer footwear — blending style, comfort, and performance in every pair.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-[#f4f4f4] p-6">
            <h2 className="font-display text-2xl font-bold">Our Story</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Founded with a simple idea: footwear should look good and feel even better. What started
              as a small passion project grew into a brand loved by athletes, commuters, and style
              lovers around the world.
            </p>
          </div>
          <div className="rounded-2xl bg-[#f4f4f4] p-6">
            <h2 className="font-display text-2xl font-bold">Our Promise</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Every shoe we sell is tested for comfort, durability, and style. We use premium materials,
              responsible sourcing, and bold designs that keep you moving forward.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, label: "Trusted Quality", desc: "Rigorous checks on every product." },
            { icon: Truck, label: "Free Shipping", desc: "Fast delivery at no extra cost." },
            { icon: Headphones, label: "24/7 Support", desc: "Always here to help you out." },
            { icon: Award, label: "Top Rated", desc: "Loved by thousands of customers." },
          ].map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f4f4f4]">
                <Icon className="h-5 w-5 text-neutral-700" />
              </div>
              <div>
                <p className="font-display text-sm font-bold">{label}</p>
                <p className="mt-0.5 text-xs text-neutral-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-neutral-900 px-6 py-10 text-center text-white">
          <Users className="mx-auto h-8 w-8" />
          <h2 className="mt-4 font-display text-2xl font-bold">Join the Treadly family</h2>
          <p className="mx-auto mt-2 max-w-md text-xs text-neutral-300">
            Be the first to know about new drops, exclusive deals, and style tips.
          </p>
        </div>
      </div>
    </Shell>
  );
}
