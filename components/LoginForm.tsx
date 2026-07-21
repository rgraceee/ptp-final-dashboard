"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Swal from "sweetalert2";

type LoginFormProps = {
  onToggleMode: () => void;
  isSignup: boolean;
};

function SkeletonInput() {
  return (
    <div className="animate-pulse">
      <div className="h-3 w-16 rounded bg-white/20 mb-2" />
      <div className="h-10 w-full rounded-lg bg-white/20" />
    </div>
  );
}

export default function LoginForm({ onToggleMode, isSignup }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Account created!",
          text: "You can now login.",
          timer: 2500,
          showConfirmButton: false,
          background: "#fff",
          color: "#111827",
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
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Welcome back!",
          timer: 1500,
          showConfirmButton: false,
          background: "#fff",
          color: "#111827",
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
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {isSignup ? "Create account" : "Welcome back"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isSignup ? "Start your portfolio journey" : "Sign in to your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">
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
          <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading || isSubmitting}
          className="btn btn-primary w-full py-3 mt-1"
        >
          {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
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
          <span className="text-gray-500">
            Already have an account?{" "}
            <button
              onClick={onToggleMode}
              className="font-semibold hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Login
            </button>
          </span>
        ) : (
          <span className="text-gray-500">
            Don&apos;t have an account?{" "}
            <button
              onClick={onToggleMode}
              className="font-semibold hover:underline"
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
      <div className="mb-8">
        <div className="h-8 w-48 rounded bg-white/20 animate-pulse mb-2" />
        <div className="h-4 w-32 rounded bg-white/20 animate-pulse" />
      </div>
      <div className="rounded-xl border border-white/20 bg-white/95 shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 space-y-4">
          <SkeletonInput />
          <SkeletonInput />
          <div className="h-10 w-full rounded-lg bg-white/20 animate-pulse mt-1" />
        </div>
      </div>
      <div className="mt-6 text-center">
        <div className="h-4 w-48 rounded bg-white/20 animate-pulse mx-auto" />
      </div>
    </div>
  );
}
