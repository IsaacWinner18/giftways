"use client";

import { useAuth } from "@/lib/auth-context";
import { LandingPage } from "@/components/landing-page";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  // Enforce profile completeness
  if (
    !user.bankName ||
    !user.accountNumber ||
    !user.accountName ||
    !user.phoneNumber
  ) {
    if (typeof window !== "undefined") {
      window.location.href = "/profile";
    }
    return null;
  }

  // Redirect to giveaways page when logged in (users can choose to create or participate)
  window.location.href = "/giveaways";
  return null;
}
