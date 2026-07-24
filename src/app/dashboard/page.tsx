import { CitizenAuthGuard } from "@/components/auth/citizen-auth-guard";
import { CitizenDashboard } from "@/components/citizen/citizen-dashboard";

export default function CitizenDashboardPage() {
  return (
    <CitizenAuthGuard>
      <CitizenDashboard />
    </CitizenAuthGuard>
  );
}
