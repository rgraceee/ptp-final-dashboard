"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Swal from "sweetalert2";
import { Eye, EyeOff, TrendingUp } from "lucide-react";

type LoginFormProps = {
  onToggleMode: () => void;
  isSignup: boolean;
};

function SkeletonInput() {
  return (
    <div className="animate-pulse">
      <div className="h-3 w-16 rounded bg-gray-200 mb-2" />
      <div className="h-11 w-full rounded-xl bg-gray-100" />
    </div>
  );
}

export default function LoginForm({ onToggleMode, isSignup }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push("/dashboard");
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSubmitting(true);

    const supabase = createClient();

    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
        Swal.fire({
          icon: "error",
          title: "Sign up failed",
          text: error.message,
          background: "#fff",
          color: "#111827",
          customClass: {
            popup: "!rounded-2xl !border !border-gray-100 !shadow-2xl",
            confirmButton: "!rounded-xl !px-5 !py-2.5 !font-semibold !text-sm !bg-[#8B1A3A]",
            title: "!text-lg !font-bold",
            htmlContainer: "!text-sm !text-gray-500",
          },
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Account created!",
          text: "You can now sign in with your credentials.",
          timer: 2500,
          showConfirmButton: false,
          background: "#fff",
          color: "#111827",
          customClass: {
            popup: "!rounded-2xl !border !border-gray-100 !shadow-2xl",
            title: "!text-lg !font-bold",
            htmlContainer: "!text-sm !text-gray-500",
          },
        });
        setMessage("Account created! You can now login.");
        onToggleMode();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: error.message,
          background: "#fff",
          color: "#111827",
          customClass: {
            popup: "!rounded-2xl !border !border-gray-100 !shadow-2xl",
            confirmButton: "!rounded-xl !px-5 !py-2.5 !font-semibold !text-sm !bg-[#8B1A3A]",
            title: "!text-lg !font-bold",
            htmlContainer: "!text-sm !text-gray-500",
          },
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Welcome back!",
          text: "Redirecting to your dashboard...",
          timer: 1500,
          showConfirmButton: false,
          background: "#fff",
          color: "#111827",
          customClass: {
            popup: "!rounded-2xl !border !border-gray-100 !shadow-2xl",
            title: "!text-lg !font-bold",
            htmlContainer: "!text-sm !text-gray-500",
          },
        });
        router.push("/dashboard");
      }
    }

    setLoading(false);
    setIsSubmitting(false);
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="hidden lg:flex items-center gap-2 mb-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
            style={{ background: "linear-gradient(135deg, var(--accent), #A52A3A)" }}
          >
            <TrendingUp size={18} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {isSignup ? "Create account" : "Welcome back"}
        </h1>
        <p className="text-gray-400 text-sm mt-1.5">
          {isSignup ? "Start your portfolio journey" : "Sign in to your dashboard"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input pr-10"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || isSubmitting}
          className="btn btn-primary w-full py-3 mt-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Please wait...
            </span>
          ) : isSignup ? "Create Account" : "Sign In"}
        </button>
      </form>

      {message && (
        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-center text-sm text-gray-600">
            {message}
          </p>
        </div>
      )}

      <div className="mt-6 text-center text-sm">
        {isSignup ? (
          <span className="text-gray-400">
            Already have an account?{" "}
            <button
              onClick={onToggleMode}
              className="font-semibold hover:underline transition-colors"
              style={{ color: "var(--accent)" }}
            >
              Sign in
            </button>
          </span>
        ) : (
          <span className="text-gray-400">
            Don&apos;t have an account?{" "}
            <button
              onClick={onToggleMode}
              className="font-semibold hover:underline transition-colors"
              style={{ color: "var(--accent)" }}
            >
              Sign up
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

export function SkeletonLoginForm() {
  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-8 text-center lg:text-left">
        <div className="flex justify-center lg:justify-start items-center gap-2 mb-3">
          <div className="h-12 w-12 rounded-xl bg-white/10 animate-pulse" />
        </div>
        <div className="h-8 w-48 rounded bg-white/10 animate-pulse mb-2 mx-auto lg:mx-0" />
        <div className="h-4 w-32 rounded bg-white/10 animate-pulse mx-auto lg:mx-0" />
      </div>
      <div className="rounded-2xl border border-white/10 bg-white shadow-2xl overflow-hidden">
        <div className="p-8 space-y-5">
          <SkeletonInput />
          <SkeletonInput />
          <div className="h-12 w-full rounded-xl bg-gray-100 animate-pulse mt-2" />
        </div>
      </div>
    </div>
  );
}
