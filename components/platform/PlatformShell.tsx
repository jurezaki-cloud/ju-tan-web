"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { AuthProvider } from "./auth/AuthContext";
import AuthGuard from "./auth/AuthGuard";
import { ModalProvider, ToastProvider } from "./providers";
import type { PublicIdentityUser } from "@/src/identity/types";

export default function PlatformShell({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: PublicIdentityUser | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <AuthProvider initialUser={initialUser}>
      <ToastProvider>
        <ModalProvider>
          <div className="min-h-screen bg-[#050816] light:bg-slate-50">
            <Sidebar open={open} onClose={() => setOpen(false)} />
            <div className="lg:pl-64">
              <Topbar onMenu={() => setOpen(true)} />
              <main id="main" className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-[1200px]">
                  <AuthGuard>{children}</AuthGuard>
                </div>
              </main>
            </div>
          </div>
        </ModalProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
