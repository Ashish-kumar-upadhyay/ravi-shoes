import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site-shell";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Treadly" },
      { name: "description", content: "Find answers to your Treadly questions about orders, shipping, returns, and sizing." },
      { property: "og:title", content: "FAQ — Treadly" },
      { property: "og:description", content: "Find answers to your Treadly questions about orders, shipping, returns, and sizing." },
    ],
  }),
  component: FaqPage,
});

const faqs = [
  {
    q: "How do I choose the right shoe size?",
    a: "We recommend measuring your foot length and comparing it to our size chart. If you are between sizes, size up for a more comfortable fit. Our EU sizes are clearly listed on every product page.",
  },
  {
    q: "What is your return policy?",
    a: "You can return any unworn shoes within 30 days of delivery for a full refund or exchange. Items must be in their original packaging with tags attached.",
  },
  {
    q: "Do you offer free shipping?",
    a: "Yes, we offer free standard shipping on all orders. Express delivery is available at checkout for an additional fee.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard shipping usually takes 5-7 business days. Express orders arrive within 2-3 business days. Tracking details are sent once your order ships.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Orders can be modified or cancelled within 1 hour of placing them. Contact our support team immediately for help.",
  },
  {
    q: "Are Treadly shoes true to size?",
    a: "Most of our styles run true to size. For wider feet, we suggest choosing a half size up or checking the product-specific fit notes.",
  },
];

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Shell>
      <div className="px-6 py-10 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-neutral-600">
            Have a question? We have answers. If you cannot find what you are looking for, feel free to
            contact our support team.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`rounded-2xl bg-[#f4f4f4] transition ${isOpen ? "ring-1 ring-black/10" : ""}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-display text-sm font-bold">{f.q}</span>
                  <span
                    className={`ml-3 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white transition ${isOpen ? "rotate-180" : ""}`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40" : "max-h-0"}`}
                >
                  <p className="px-5 pb-4 text-xs leading-relaxed text-neutral-600">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-neutral-900 px-6 py-8 text-center text-white">
          <p className="font-display text-lg font-bold">Still need help?</p>
          <p className="mt-2 text-xs text-neutral-300">
            Our support team is available 24/7 to answer your questions.
          </p>
          <button className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200">
            Contact Support
          </button>
        </div>
      </div>
    </Shell>
  );
}
