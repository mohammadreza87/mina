"use client";

import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/auth";

  // Don't protect auth, landing, and demo pages
  if (isAuthPage || pathname === "/landing" || pathname === "/glass-demo" || pathname === "/design-demo") {
    return <>{children}</>;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
}
