export type NavSectionId =
  | "home"
  | "services"
  | "office"
  | "references"
  | "graphics"
  | "video"
  | "process"
  | "company"
  | "booking"
  | "contact";

export type NavItemId = NavSectionId;

export type NavItem = {
  id: NavItemId;
  href: string;
  label: string;
  /** Compact desktop label. Screen readers still use `label`. */
  shortLabel?: string;
  sectionId: NavSectionId;
};
