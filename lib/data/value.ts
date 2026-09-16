import type { LucideIcon } from "lucide-react";
import { Code2, Bot, Cable, Handshake } from "lucide-react";

export type ValueItem = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export const valueItems: ValueItem[] = [
  {
    icon: Code2,
    title: "Individualni razvoj",
    text: "Brez generičnih rešitev. Sistem sledi vašim procesom, ne obratno.",
  },
  {
    icon: Bot,
    title: "AI avtomatizacija",
    text: "Rutinska opravila prepusti umetni inteligenci, kjer so podatki že v sistemih.",
  },
  {
    icon: Cable,
    title: "Integracije",
    text: "CRM, ERP, API in računovodstvo v istem toku podatkov.",
  },
  {
    icon: Handshake,
    title: "Dolgoročno partnerstvo",
    text: "Razvoj, nadgradnje in podpora po uvedbi.",
  },
];
