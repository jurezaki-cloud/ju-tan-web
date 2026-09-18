export const OFFICE_SHOT_W = 1896;
export const OFFICE_SHOT_H = 1001;

export type OfficeShot = {
  id: "dashboard" | "invoices" | "warehouse" | "customers";
  src: string;
  alt: string;
  label: string;
};

export const officeShots = {
  dashboard: {
    id: "dashboard",
    src: "/products/office/office-dashboard.webp",
    alt: "JU-TAN Office — poslovni pregled z demonstracijskimi podatki",
    label: "Pregled",
  },
  invoices: {
    id: "invoices",
    src: "/products/office/office-invoices.webp",
    alt: "JU-TAN Office — računi s statusi in demonstracijskimi podatki",
    label: "Računi",
  },
  warehouse: {
    id: "warehouse",
    src: "/products/office/office-warehouse.webp",
    alt: "JU-TAN Office — skladišče z zalogo in demonstracijskimi podatki",
    label: "Skladišče",
  },
  customers: {
    id: "customers",
    src: "/products/office/office-customers.webp",
    alt: "JU-TAN Office — stranke z demonstracijskimi podatki",
    label: "Stranke",
  },
} as const satisfies Record<string, OfficeShot>;
