"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm, { SkeletonLoginForm } from "@/components/LoginForm";
import { TrendingUp } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative text-white">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, var(--accent), #A52A3A)" }}
            >
              <TrendingUp size={22} />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Stock Analytics
            </span>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white">
              Start building
              <br />
              <span className="text-white/80">your portfolio.</span>
            </h2>
            <p className="text-white/70 text-base mt-4 leading-relaxed">
              Track stock prices, record trades, and visualize your portfolio performance — all for free.
            </p>
          </div>

          <p className="text-white/50 text-xs">
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
                <p className="text-white/90 text-sm mt-1.5">
                  Start tracking your portfolio
                </p>
              </div>

              <div className="glass-card rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden transition-transform lg:hover:-translate-y-0.5">
                <div className="p-8">
                  <LoginForm onToggleMode={() => router.push("/login")} isSignup={true} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
