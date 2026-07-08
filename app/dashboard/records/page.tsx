import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RecordForm from "@/components/RecordForm";

export default function RecordsPage() {
  return (
    <div className="p-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <h1 className="text-xl font-bold text-gray-900">Manual Records</h1>
      <p className="text-sm text-gray-500 mt-1">
        Add entries manually — not yet saved between sessions.
      </p>
      <RecordForm />
    </div>
  );
}