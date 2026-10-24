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
      shortLabel: "Office",
    },
    {
      id: "references",
      href: "/reference",
      sectionId: "references",
      label: nav.references,
    },
    {
      id: "graphics",
      href: "/graficno-oblikovanje",
      sectionId: "graphics",
      label: nav.graphics,
      shortLabel: "Grafika",
    },
    {
      id: "video",
      href: "/videoprodukcija",
      sectionId: "video",
      label: nav.video,
      shortLabel: "Video",
    },
    {
      id: "process",
      href: "/#process",
      sectionId: "process",
      label: nav.process,
      shortLabel: "Proces",
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
