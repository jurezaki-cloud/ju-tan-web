"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { ChatProvider } from "@/components/chat/ChatProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <ChatProvider>{children}</ChatProvider>
    </ThemeProvider>
  );
}
