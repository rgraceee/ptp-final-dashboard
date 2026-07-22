"use client";

import { useState, useEffect } from "react";
import LoginForm, { SkeletonLoginForm } from "@/components/LoginForm";
import { TrendingUp } from "lucide-react";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-gray-950">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, var(--accent), #A52A3A)" }}
            >
              <TrendingUp size={22} />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Stock Analytics
            </span>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Track smarter.
              <br />
              <span className="text-white/60">Invest better.</span>
            </h2>
            <p className="text-white/50 text-base mt-4 leading-relaxed">
              Real-time market data, portfolio tracking, and powerful analytics — all in one place.
            </p>
          </div>

          <p className="text-white/30 text-xs">
            Portfolio & Market Intelligence
          </p>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          {loading ? (
            <div className="w-full max-w-[420px]">
              <SkeletonLoginForm />
            </div>
          ) : (
            <div className="w-full max-w-[420px] animate-fade-in-up">
              <div className="lg:hidden text-center mb-8">
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg mb-3"
                  style={{ background: "linear-gradient(135deg, var(--accent), #A52A3A)" }}
                >
                  <TrendingUp size={22} />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Stock Analytics
                </h1>
                <p className="text-white/50 text-sm mt-1.5">
                  {isSignup ? "Create your account" : "Welcome back"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white shadow-2xl overflow-hidden backdrop-blur-sm">
                <div className="p-8">
                  <LoginForm onToggleMode={() => setIsSignup(!isSignup)} isSignup={isSignup} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
