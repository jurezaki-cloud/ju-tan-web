import type { LucideIcon } from "lucide-react";
import {
  Code2,
  Unlock,
  FileCode2,
  Boxes,
  TrendingUp,
  Plug,
} from "lucide-react";

export type TrustItem = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export const trustItems: TrustItem[] = [
  {
    icon: Code2,
    title: "Prilagojen razvoj",
    text: "Funkcije in moduli po obsegu, ki ga določimo skupaj.",
  },
  {
    icon: Unlock,
    title: "Brez vezave na platformo",
    text: "Sklad, ki ga lahko gostite in vzdržujete tudi zunaj našega okolja.",
  },
  {
    icon: FileCode2,
    title: "Lastništvo kode",
    text: "Izvorna koda in dokumentacija ostaneta pri naročniku.",
  },
  {
    icon: Boxes,
    title: "Modularna arhitektura",
    text: "Posamezne dele lahko zamenjate ali razširite brez prepisovanja celote.",
  },
  {
    icon: TrendingUp,
    title: "Možnost nadaljnje rasti",
    text: "Nove vloge, tokovi in integracije se dodajo na obstoječe jedro.",
  },
  {
    icon: Plug,
    title: "API First",
    text: "Vmesniki najprej, da se CRM, ERP, portal in avtomatizacija vežejo na iste podatke.",
  },
];
