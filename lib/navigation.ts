import { getMessages } from "@/lib/i18n/messages";
import type { NavItem } from "@/types/navigation";

export type { NavItem } from "@/types/navigation";

export function getHeaderNavigation(): NavItem[] {
  const { nav } = getMessages().header;

  return [
    {
      id: "services",
      href: "/#services",
      sectionId: "services",
      label: nav.solutions,
    },
    {
      id: "office",
      href: "/ju-tan-office",
      sectionId: "office",
      label: nav.office,
    },
    {
      id: "process",
      href: "/#process",
      sectionId: "process",
      label: nav.process,
    },
    {
      id: "company",
      href: "/#company",
      sectionId: "company",
      label: nav.company,
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
