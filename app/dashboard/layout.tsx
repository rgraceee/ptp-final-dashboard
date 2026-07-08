import { RecordsProvider } from "@/lib/RecordsContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <RecordsProvider>{children}</RecordsProvider>;
}