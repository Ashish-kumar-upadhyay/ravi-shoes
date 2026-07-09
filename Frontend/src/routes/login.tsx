import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Phone, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import heroShoe from "@/assets/hero-shoe.png";
import { useAuth } from "@/lib/store";
import { API_URL } from "@/lib/api";
import { buildPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  head: () =>
    buildPageMeta({
      title: "Sign In — Luxury Shoes",
      description: "Sign in to your Luxury Shoes account.",
      path: "/login",
      noindex: true,
    }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);

  const handleEmailLogin = async () => {
    setError("");
    setSubmitting(true);
    try {
      await signIn(email, pw);
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    
    setOtpSending(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      
      const data = await response.json();
      
      if (data.success || response.ok) {
        setShowOtpInput(true);
        // If OTP is returned in development mode, show it
        if (data.otp) {
          console.log("OTP for testing:", data.otp);
        }
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter complete OTP");
      return;
    }
    
    setOtpVerifying(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otpValue }),
      });
      
      const data = await response.json();
      
      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) {
          // Update auth state if user data returned
        }
        navigate({ to: "/" });
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/auth/google`);
      const data = await response.json();
      
      if (data.success && data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        setError("Failed to initiate Google login");
      }
    } catch (err) {
      setError("Failed to connect to Google login");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#efeeea] font-sans">
      <div className="grid min-h-screen bg-white lg:grid-cols-2">
        {/* Left visual */}
        <div className="relative hidden overflow-hidden bg-[#f4f4f4] lg:block">
          <Link
            to="/"
            className="absolute left-8 top-8 z-20 flex items-center gap-2 font-display text-lg font-bold"
          >
            <Lock className="h-4 w-4" />
            Treadly
          </Link>
          <p
            className="pointer-events-none absolute inset-x-0 top-1/4 text-center font-display text-[120px] font-extrabold leading-none tracking-tight text-neutral-900"
            aria-hidden
          >
            STEP
            <br />
            INTO
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
            THE WALK
          </p>
          <style>{`@keyframes floaty { 0%,100%{transform:translateY(-33%) rotate(-8deg)} 50%{transform:translateY(-38%) rotate(-6deg)} }`}</style>
        </div>

        {/* Right form */}
        <div className="flex items-center justify-center px-6 py-12 md:px-16">
          <div className="w-full max-w-md animate-[fadeIn_0.5s_ease-out]">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 font-display text-lg font-bold lg:hidden"
            >
              <Lock className="h-4 w-4" />
              Treadly
            </Link>
            <h1 className="font-display text-4xl font-extrabold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Sign in to continue shopping the freshest kicks.
            </p>

            {/* Login Method Toggle */}
            <div className="mt-6 flex gap-2 rounded-full bg-[#f4f4f4] p-1">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("email");
                  setShowOtpInput(false);
                  setError("");
                }}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  loginMethod === "email" 
                    ? "bg-white text-neutral-900 shadow-sm" 
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("phone");
                  setShowOtpInput(false);
                  setError("");
                }}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  loginMethod === "phone" 
                    ? "bg-white text-neutral-900 shadow-sm" 
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Phone
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (loginMethod === "email") {
                  await handleEmailLogin();
                } else {
                  if (!showOtpInput) {
                    await handleSendOtp();
                  } else {
                    await handleVerifyOtp();
                  }
                }
              }}
              className="mt-6 space-y-4"
            >
              {error && (
                <p className="rounded-full bg-red-50 px-4 py-2 text-center text-sm text-red-600 ring-1 ring-red-200">
                  {error}
                </p>
              )}
              
              {loginMethod === "email" ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      Email
                    </label>
                    <div className="flex items-center gap-2 rounded-full bg-[#f4f4f4] px-4 py-3 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900">
                      <Mail className="h-4 w-4 text-neutral-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      Password
                    </label>
                    <div className="flex items-center gap-2 rounded-full bg-[#f4f4f4] px-4 py-3 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900">
                      <Lock className="h-4 w-4 text-neutral-500" />
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
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex cursor-pointer items-center gap-2 text-neutral-600">
                      <input type="checkbox" className="accent-neutral-900" />
                      Remember me
                    </label>
                    <a href="#" className="font-semibold text-neutral-900 hover:underline">
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-60"
                  >
                    {submitting ? "Signing in..." : "Sign In"}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </button>
                </>
              ) : (
                <>
                  {!showOtpInput ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-2 rounded-full bg-[#f4f4f4] px-4 py-3 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900">
                        <Phone className="h-4 w-4 text-neutral-500" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          maxLength={15}
                          className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                          Enter OTP sent to {phone}
                        </label>
                        <div className="flex gap-2">
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              id={`otp-${index}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              className="h-12 w-12 rounded-lg bg-[#f4f4f4] text-center text-xl font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900"
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowOtpInput(false);
                          setOtp(["", "", "", "", "", ""]);
                        }}
                        className="text-xs text-neutral-600 hover:text-neutral-900"
                      >
                        Change phone number
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={otpSending || otpVerifying}
                    className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-60"
                  >
                    {otpSending ? "Sending OTP..." : otpVerifying ? "Verifying..." : showOtpInput ? "Verify OTP" : "Send OTP"}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </button>
                </>
              )}

              <div className="flex items-center gap-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                <span className="h-px flex-1 bg-neutral-200" />
                or
                <span className="h-px flex-1 bg-neutral-200" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full rounded-full bg-white py-3 text-sm font-semibold ring-1 ring-black/10 transition hover:bg-neutral-50 disabled:opacity-60"
              >
                {googleLoading ? "Connecting to Google..." : "Continue with Google"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-600">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-neutral-900 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
}
