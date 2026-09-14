import {
  Search,
  Lightbulb,
  Code2,
  FlaskConical,
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
      "Pregledamo poslovne procese, cilje in izzive ter pripravimo jasno izhodišče projekta.",
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Načrtovanje",
    description:
      "Določimo arhitekturo, obseg, tehnologije in časovnico, da je izvedba predvidljiva.",
  },
  {
    number: "03",
    icon: Code2,
    title: "Razvoj",
    description:
      "Izdelamo rešitev po meri: AI, avtomatizacijo, programsko opremo ali spletno aplikacijo.",
  },
  {
    number: "04",
    icon: FlaskConical,
    title: "Testiranje",
    description:
      "Preverimo delovanje, varnost in zmogljivost, preden rešitev pride v produkcijo.",
  },
  {
    number: "05",
    icon: Rocket,
    title: "Implementacija",
    description:
      "Rešitev namestimo, usposobimo ekipo in poskrbimo za stabilen prehod v uporabo.",
  },
  {
    number: "06",
    icon: LifeBuoy,
    title: "Podpora",
    description:
      "Nudimo podporo, nadgradnje in dolgoročno vzdrževanje, da sistem raste z vami.",
  },
];
