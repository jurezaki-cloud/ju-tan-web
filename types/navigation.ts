export type NavSectionId =
  | "home"
  | "services"
  | "office"
  | "references"
  | "graphics"
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
