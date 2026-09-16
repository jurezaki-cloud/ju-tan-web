import {
  Search,
  DraftingCompass,
  Code2,
  ShieldCheck,
  Rocket,
  LifeBuoy,
} from "lucide-react";
import type { ProcessStep } from "@/lib/types";

export const process: ProcessStep[] = [
  {
    number: "01",
    icon: Search,
    title: "Analiza",
    description:
      "Pregled procesov, sistemov in omejitev. Določimo, kaj je v obsegu.",
    stack: ["Pisni obseg pred začetkom razvoja."],
  },
  {
    number: "02",
    icon: DraftingCompass,
    title: "Načrt",
    description:
      "Arhitektura, vmesniki in časovnica. Odločitve so zapisane, ne ustne.",
    stack: ["Načrt, ki ga lahko preverite pred kodo."],
  },
  {
    number: "03",
    icon: Code2,
    title: "Razvoj",
    description:
      "Izvedba po načrtu: moduli, API in vmesnik, usklajeni z obstoječimi sistemi.",
    stack: ["Redni predogledi na testnem okolju."],
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Testiranje",
    description:
      "Preverjanje tokov, pravic dostopa in obremenitev pred produkcijo.",
    stack: ["Seznam napak zapremo pred uvedbo."],
  },
  {
    number: "05",
    icon: Rocket,
    title: "Uvedba",
    description:
      "Namestitev, prenosi podatkov in usposobitev ekipe za vsakodnevno rabo.",
    stack: ["Prehod z dogovorjenim rezervnim načrtom."],
  },
  {
    number: "06",
    icon: LifeBuoy,
    title: "Podpora",
    description:
      "Vzdrževanje, nadgradnje in spremembe, ko se procesi v podjetju spremenijo.",
    stack: ["Koda in dokumentacija ostaneta pri vas."],
  },
];
