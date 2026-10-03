export type NavSectionId =
  | "home"
  | "services"
  | "office"
  | "references"
  | "process"
  | "company"
  | "booking"
  | "contact";

export type NavItemId = NavSectionId;

export type NavItem = {
  id: NavItemId;
  href: string;
  label: string;
  sectionId: NavSectionId;
};
