import type { HeaderNavItem } from "@/lib/navigation";
import NavItem from "./NavItem";

type DesktopNavProps = {
  items: HeaderNavItem[];
  activeId: HeaderNavItem["id"] | null;
  ariaLabel: string;
};

export default function DesktopNav({
  items,
  activeId,
  ariaLabel,
}: DesktopNavProps) {
  return (
    <nav className="hidden items-center gap-8 lg:flex" aria-label={ariaLabel}>
      {items.map((item) => (
        <NavItem
          key={item.id}
          href={item.href}
          label={item.label}
          active={activeId === item.id}
        />
      ))}
    </nav>
  );
}
