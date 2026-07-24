import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset the password for your Beacon account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
