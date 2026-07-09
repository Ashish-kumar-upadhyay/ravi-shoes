import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, User, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/store";
import { API_URL } from "@/lib/api";
import { buildPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/complete-profile")({
  head: () =>
    buildPageMeta({
      title: "Complete Profile — Luxury Shoes",
      description: "Complete your profile to continue shopping.",
      path: "/complete-profile",
      noindex: true,
    }),
  component: CompleteProfilePage,
});

function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/complete-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (data.success) {
        navigate({ to: "/" });
      } else {
        setError(data.message || "Failed to complete profile");
      }
    } catch (err) {
      setError("Failed to complete profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#efeeea] font-sans">
      <div className="flex min-h-screen items-center justify-center px-6 py-12 md:px-16">
        <div className="w-full max-w-md animate-[fadeIn_0.5s_ease-out]">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">Complete Your Profile</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Please provide your details to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <p className="rounded-full bg-red-50 px-4 py-2 text-center text-sm text-red-600 ring-1 ring-red-200">
                {error}
              </p>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Full Name
              </label>
              <div className="flex items-center gap-2 rounded-full bg-[#f4f4f4] px-4 py-3 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900">
                <User className="h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Email Address
              </label>
              <div className="flex items-center gap-2 rounded-full bg-[#f4f4f4] px-4 py-3 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900">
                <Mail className="h-4 w-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-60"
            >
              {submitting ? "Completing..." : "Complete Profile"}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate({ to: "/login" })}
              className="font-semibold text-neutral-900 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
}
