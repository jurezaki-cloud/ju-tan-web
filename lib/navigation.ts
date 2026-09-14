import { getMessages } from "@/lib/i18n/messages";

export type HeaderNavItem = {
  id: "home" | "services" | "about" | "projects" | "contact";
  href: string;
  label: string;
};

export function getHeaderNavigation(): HeaderNavItem[] {
  const { nav } = getMessages().header;

  return [
    { id: "home", href: "/#home", label: nav.home },
    { id: "services", href: "/#services", label: nav.solutions },
    { id: "about", href: "/#about", label: nav.about },
    { id: "projects", href: "/#projects", label: nav.references },
    { id: "contact", href: "/#contact", label: nav.contact },
  ];
}

export const navigation = getHeaderNavigation().map((item) => ({
  label: item.label,
  href: item.href,
}));
