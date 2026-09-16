"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Contact,
  Building2,
  FolderKanban,
  FileStack,
  Ticket,
  Bot,
  Settings,
  Users,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { platformNavigation, type PlatformNavId } from "@/src/config/navigation";
import { platformConfig } from "@/src/config/platform";
import { useAuth } from "@/components/platform/auth/AuthContext";
import BrandLogo from "@/components/common/BrandLogo";
import { colorTransition, focusRing } from "@/design";
import { cn } from "@/lib/utils";
import { brandName } from "@/brand/theme";

const icons: Record<PlatformNavId, LucideIcon> = {
  dashboard: LayoutDashboard,
  crm: Contact,
  clients: Building2,
  projects: FolderKanban,
  documents: FileStack,
  tickets: Ticket,
  ai: Bot,
  settings: Settings,
  users: Users,
  portal: Globe,
};

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { can } = useAuth();
  const items = platformNavigation.filter((item) => can(item.permission));

  return (
    <>
      <button
        type="button"
        className={cn(
          "fixed inset-0 z-40 bg-[#050816]/70 lg:hidden",
          open ? "block" : "hidden",
        )}
        aria-label="Zapri meni"
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0B1220] light:border-slate-200 light:bg-white",
          "transition-transform duration-hover ease-out",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        aria-label="Platforma"
      >
        <div className="flex h-16 items-center border-b border-white/10 px-5 light:border-slate-200">
          <Link
            href="/dashboard"
            className={cn("rounded-lg", focusRing)}
            aria-label={`${brandName} dashboard`}
            onClick={onClose}
          >
            <BrandLogo variant="header" />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {items.map((item) => {
              const Icon = icons[item.id];
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-lg px-3 text-[14px] font-medium",
                      colorTransition,
                      focusRing,
                      active
                        ? "bg-white/[0.04] text-white light:bg-slate-100 light:text-slate-900"
                        : "text-slate-400 hover:text-white light:hover:text-slate-900",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-[#16a34a]" strokeWidth={1.75} aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="border-t border-white/10 px-5 py-4 text-[12px] text-slate-500 light:border-slate-200">
          {platformConfig.name} v{platformConfig.version} · demo
        </p>
      </aside>
    </>
  );
}
