"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import ThemeToggle from "@/components/navbar/ThemeToggle";
import SearchInput from "./SearchInput";
import { useAuth } from "./auth/AuthContext";
import { iconButtonClass, insetSurface, metaClass, focusRing } from "@/design";
import { cn } from "@/lib/utils";
import { roleLabels } from "@/src/config/roles";

const notifications = [
  { id: "n-01", text: "Ticket t-01 čaka na pregled." },
  { id: "n-02", text: "Projekt SaaS računi: rok 20. 9." },
  { id: "n-03", text: "Nov stik Kontakt 06." },
];

function UserChip() {
  const { session } = useAuth();
  const user = session.user;
  if (!user) return null;
  return (
    <Link
      href="/profile"
      className={cn("hidden items-center gap-2 sm:flex rounded-lg", focusRing)}
      aria-label="Profil"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-[12px] font-semibold text-[#16a34a] light:border-slate-200">
        {user.avatar ?? "JT"}
      </span>
      <span className="hidden lg:flex flex-col">
        <span className="text-[13px] text-white light:text-slate-900">{user.name}</span>
        <span className={metaClass}>{roleLabels[user.role]}</span>
      </span>
    </Link>
  );
}

type TopbarProps = {
  onMenu: () => void;
};

export default function Topbar({ onMenu }: TopbarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-[#050816]/90 px-4 backdrop-blur-sm light:border-slate-200 light:bg-slate-50/90 sm:px-6">
      <button
        type="button"
        className={cn(iconButtonClass, "lg:hidden text-slate-200 light:text-slate-800")}
        aria-label="Odpri meni"
        onClick={onMenu}
      >
        <Menu className="h-4 w-4" aria-hidden />
      </button>

      <form
        className="min-w-0 flex-1"
        onSubmit={(event) => event.preventDefault()}
        role="search"
      >
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Iskanje v platformi"
          label="Iskanje v platformi"
          id="platform-topbar-search"
          className="max-w-xl"
        />
      </form>

      <div className="relative flex items-center gap-2">
        <button
          type="button"
          className={cn(
            iconButtonClass,
            "border border-white/10 text-slate-200 light:border-slate-200 light:text-slate-800",
          )}
          aria-expanded={open}
          aria-controls="platform-notifications"
          aria-label="Obvestila"
          onClick={() => setOpen((current) => !current)}
        >
          <Bell className="h-4 w-4" aria-hidden />
        </button>

        {open ? (
          <div
            id="platform-notifications"
            className={cn(insetSurface, "absolute right-0 top-12 z-40 w-72 p-0")}
          >
            <p className="px-4 pt-3 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
              Obvestila
            </p>
            <ul className="p-2">
              {notifications.map((item) => (
                <li
                  key={item.id}
                  className="rounded-lg px-3 py-2 text-[13px] leading-[1.5] text-slate-300 light:text-slate-700"
                >
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <ThemeToggle lightLabel="Vklopi svetlo temo" darkLabel="Vklopi temno temo" />

        <UserChip />
      </div>
    </header>
  );
}
