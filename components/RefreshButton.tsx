"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function RefreshButton() {
const router = useRouter();
const [isPending, startTransition] = useTransition();

const handleRefresh = () => {
startTransition(() => {
router.refresh(); // 🔁 refetch server data
});
};

return (
<button
onClick={handleRefresh}
disabled={isPending}
className="px-4 py-2 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
style={{ background: "var(--accent)" }}
>
{isPending ? "Refreshing..." : "Refresh Data"} </button>
);
}
