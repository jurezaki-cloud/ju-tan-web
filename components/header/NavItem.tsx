import Link from "next/link";
import { cn } from "@/lib/utils";

type NavItemProps = {
  href: string;
  label: string;
  active?: boolean;
  onNavigate?: () => void;
  className?: string;
};

export default function NavItem({
  href,
  label,
  active = false,
  onNavigate,
  className,
}: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex min-h-11 items-center rounded-sm text-[14px] font-medium tracking-[-0.01em] text-slate-300 transition-colors duration-[250ms]",
        "hover:text-green-400 focus-visible:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500",
        "light:text-slate-700 light:hover:text-green-600 light:focus-visible:text-green-600",
        "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-green-400 after:transition-all after:duration-[250ms] hover:after:w-full",
        active && "text-green-400 after:w-full light:text-green-600",
        className,
      )}
    >
      {label}
    </Link>
  );
}
