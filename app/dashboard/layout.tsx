import { RecordsProvider } from "@/lib/RecordsContext";
import ThemeProvider from "@/components/ThemeProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <RecordsProvider>
        {children}
      </RecordsProvider>
    </ThemeProvider>
  );
}