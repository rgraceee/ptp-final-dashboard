"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RecordForm from "@/components/RecordForm";

export default function RecordsPage() {
  return (
    <div className="min-h-screen gradient-soft">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="section-header">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            Manual Records
          </h1>
        </div>

        <p className="text-sm text-gray-400 -mt-2 mb-6">
          Add, edit, and delete your saved stock records.
        </p>

        <RecordForm />
      </div>
    </div>
  );
}
