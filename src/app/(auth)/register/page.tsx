import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a Beacon account to report and follow civic infrastructure issues.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
