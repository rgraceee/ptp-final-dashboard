"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm, { SkeletonLoginForm } from "@/components/LoginForm";
import DataFlowAnimation from "@/components/DataFlowAnimation";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen relative">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(194,67,111,0.95) 0%, rgba(147,51,234,0.95) 100%)",
        }}
      />
      <div className="absolute inset-0">
        <DataFlowAnimation />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        {loading ? (
          <SkeletonLoginForm />
        ) : (
          <div className="w-full max-w-[420px] animate-fade-in-up">
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white mb-4 shadow-lg animate-float"
                style={{ background: "rgba(255,255,255,0.2)" }}>
                🚀
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Create Account
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Start tracking your portfolio
              </p>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/95 shadow-xl overflow-hidden backdrop-blur-sm">
              <div className="p-6">
                <LoginForm onToggleMode={() => router.push("/login")} isSignup={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
