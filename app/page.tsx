"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }

    checkAuth();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--surface-raised)" }}>
      <div className="bg-[var(--surface)] rounded-3xl shadow-lg p-10 text-center max-w-xl w-full animate-fade-in-up border border-[var(--border)]">
        <div
          className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl text-white mb-6 shadow-lg"
          style={{ background: "linear-gradient(135deg, var(--accent), #A52A3A)" }}
        >
          📈
        </div>

        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-3">
          Stock Analytics Dashboard
        </h1>

        <p className="text-[var(--text-muted)] leading-relaxed mb-8 text-sm">
          Analyze market trends, compare stocks, visualize
          performance, and manage your investment records.
        </p>

        <div className="flex justify-center items-center gap-2 text-[var(--text-muted)] text-sm">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "var(--accent)" }}
          />
          Checking account...
        </div>
      </div>
    </main>
  );
}
