import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Mail, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import heroShoe from "@/assets/hero-shoe.png";
import { useAuth } from "@/lib/store";
import { buildPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/signup")({
  head: () =>
    buildPageMeta({
      title: "Create Account — Luxury Shoes",
      description: "Create your Luxury Shoes account to shop premium footwear.",
      path: "/signup",
      noindex: true,
    }),
  component: SignupPage,
});

function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="min-h-screen bg-[#efeeea] font-sans">
      <div className="grid min-h-screen bg-white lg:grid-cols-2">
        <div className="flex items-center justify-center px-6 py-12 md:px-16">
          <div className="w-full max-w-md animate-[fadeIn_0.5s_ease-out]">
            <Link to="/" className="mb-8 inline-flex items-center gap-2 font-display text-lg font-bold">
              <Lock className="h-4 w-4" />
              Treadly
            </Link>
            <h1 className="font-display text-4xl font-extrabold tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Join Treadly to save favorites, track orders and unlock member drops.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                setSubmitting(true);
                try {
                  await signUp(name, email, pw);
                  navigate({ to: "/" });
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Registration failed");
                } finally {
                  setSubmitting(false);
                }
              }}
              className="mt-8 space-y-4"
            >
              {error && (
                <p className="rounded-full bg-red-50 px-4 py-2 text-center text-sm text-red-600 ring-1 ring-red-200">
                  {error}
                </p>
              )}
              <Field label="Name" icon={User}>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ashish Kumar"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500"
                />
              </Field>
              <Field label="Email" icon={Mail}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500"
                />
              </Field>
              <Field label="Password" icon={Lock}>
                <input
                  type={show ? "text" : "password"}
                  required
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="text-neutral-500 hover:text-neutral-900"
                  aria-label="Toggle password"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </Field>

              <label className="flex cursor-pointer items-start gap-2 text-xs text-neutral-600">
                <input type="checkbox" required className="mt-0.5 accent-neutral-900" />
                I agree to Treadly's Terms of Service and Privacy Policy.
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-60"
              >
                {submitting ? "Creating account..." : "Create Account"}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-neutral-900 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="relative hidden overflow-hidden bg-[#f4f4f4] lg:block">
          <p
            className="pointer-events-none absolute inset-x-0 top-1/4 text-center font-display text-[120px] font-extrabold leading-none tracking-tight text-neutral-900"
            aria-hidden
          >
            OWN
            <br />
            THE
          </p>
          <img
            src={heroShoe}
            alt=""
            className="absolute inset-x-0 top-1/2 mx-auto w-[85%] -translate-y-1/3 rotate-[-8deg] drop-shadow-2xl"
            style={{ animation: "floaty 6s ease-in-out infinite" }}
          />
          <p
            className="pointer-events-none absolute inset-x-0 bottom-16 text-center font-display text-[100px] font-extrabold leading-none tracking-tight text-neutral-200/80"
            aria-hidden
          >
            WALK
          </p>
          <style>{`@keyframes floaty { 0%,100%{transform:translateY(-33%) rotate(-8deg)} 50%{transform:translateY(-38%) rotate(-6deg)} }`}</style>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">{label}</label>
      <div className="flex items-center gap-2 rounded-full bg-[#f4f4f4] px-4 py-3 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900">
        <Icon className="h-4 w-4 text-neutral-500" />
        {children}
      </div>
    </div>
  );
}
