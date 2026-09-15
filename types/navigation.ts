export type NavSectionId =
  | "home"
  | "services"
  | "process"
  | "projects"
  | "contact";

export type NavItemId = NavSectionId;

export type NavItem = {
  id: NavItemId;
  href: string;
  label: string;
  sectionId: NavSectionId;
};
