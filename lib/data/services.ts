import {
  Bot,
  Workflow,
  Code2,
  Globe,
  Server,
  ShieldCheck,
} from "lucide-react";
import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    icon: Bot,
    title: "Umetna inteligenca",
    description:
      "AI agenti in pametni pomočniki, ki pospešijo delo ekipe in zmanjšajo ponavljajoča opravila.",
    features: [
      "AI agenti in pomočniki",
      "Avtomatizacija dokumentacije",
      "Integracija z obstoječimi orodji",
    ],
  },
  {
    icon: Workflow,
    title: "Avtomatizacija procesov",
    description:
      "Povezujemo sisteme in poenostavimo poslovne tokove, da ekipa dela hitreje in z manj napakami.",
    features: [
      "Povezovanje orodij in API-jev",
      "Ponavljajoči poslovni procesi",
      "Nadzor, obvestila in poročila",
    ],
  },
  {
    icon: Code2,
    title: "Razvoj programske opreme",
    description:
      "Poslovne aplikacije po meri, zgrajene s sodobnim skladom in jasno arhitekturo.",
    features: [
      "Aplikacije po meri",
      "Stabilna in razširljiva arhitektura",
      "Vzdrževanje in nadgradnje",
    ],
  },
  {
    icon: Globe,
    title: "Spletne aplikacije",
    description:
      "Hitre, odzivne in SEO pripravljene spletne rešitve za predstavitev in poslovanje.",
    features: [
      "Sodobne spletne aplikacije",
      "Odziven in premium vmesnik",
      "SEO in merjenje uspešnosti",
    ],
  },
  {
    icon: Server,
    title: "IT infrastruktura",
    description:
      "Zanesljiva infrastruktura, oblak, varnostne kopije in nadzor za nemoteno delovanje.",
    features: [
      "Strežniki, Docker in oblak",
      "Varnostne kopije in monitoring",
      "Optimizacija razpoložljivosti",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Kibernetska varnost",
    description:
      "Varujemo podatke, dostope in poslovne sisteme z jasnimi varnostnimi praksami.",
    features: [
      "Zaščita podatkov in dostopov",
      "Pregled ranljivosti",
      "Varnostne politike in nadzor",
    ],
  },
];
