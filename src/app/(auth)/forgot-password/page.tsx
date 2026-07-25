import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Password recovery",
  description: "Review password-recovery availability for your Beacon account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
