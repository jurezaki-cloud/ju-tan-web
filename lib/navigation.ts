import { getMessages } from "@/lib/i18n/messages";
import type { NavItem } from "@/types/navigation";

export type { NavItem } from "@/types/navigation";

export function getHeaderNavigation(): NavItem[] {
  const { nav } = getMessages().header;

  return [
    { id: "home", href: "/#home", sectionId: "home", label: nav.home },
    {
      id: "services",
      href: "/#services",
      sectionId: "services",
      label: nav.solutions,
    },
    {
      id: "process",
      href: "/#process",
      sectionId: "process",
      label: nav.process,
    },
    {
      id: "projects",
      href: "/#projects",
      sectionId: "projects",
      label: nav.references,
    },
    {
      id: "contact",
      href: "/kontakt",
      sectionId: "contact",
      label: nav.contact,
    },
  ];
}

export const navigation = getHeaderNavigation().map((item) => ({
  label: item.label,
  href: item.href,
}));
