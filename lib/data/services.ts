import {
  Bot,
  Users,
  Database,
  Globe,
  Smartphone,
  Cloud,
  Cable,
  Workflow,
} from "lucide-react";
import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    icon: Bot,
    title: "AI",
    problem: "Ponavljajoča opravila v podpori in administraciji.",
    solution: "Agent, ki bere obstoječe sisteme in pripravi osnutke ali prenose.",
    result: "Manj ročnega prepisovanja med orodji.",
    description:
      "AI agenti za ponavljajoča opravila v podpori in administraciji, povezani z obstoječimi sistemi.",
    stack: ["Agenti", "RAG", "API"],
  },
  {
    icon: Users,
    title: "CRM",
    problem: "Stranke in priložnosti so razpršene po pošti in preglednicah.",
    solution: "En pipeline: stiki, opravila in zgodovina komunikacije.",
    result: "Pregled prodajnega toka brez izgubljenih zapisov.",
    description:
      "CRM po meri za stranke, priložnosti in komunikacijo v enem toku.",
    stack: ["Prodaja", "Stiki", "Naloge"],
  },
  {
    icon: Database,
    title: "ERP",
    problem: "Dokumenti, zaloga in finance niso v istem pregledu.",
    solution: "Modulni poslovni sistem, usklajen z vašimi procesi.",
    result: "En vir podatkov za ekipo in poročila.",
    description:
      "ERP moduli za dokumente, zalogo in interne procese, prilagojeni podjetju.",
    stack: ["Dokumenti", "Zaloga", "Procesi"],
  },
  {
    icon: Globe,
    title: "Portali",
    problem: "Stranke ali partnerji nimajo urejenega dostopa do ponudbe in zahtevkov.",
    solution: "Portal z prijavo, vlogami in povezavo na notranje sisteme.",
    result: "Krajša pot od zahteve do obdelave.",
    description:
      "Portali za stranke in partnerje z dostopom do ponudbe, zahtevkov in statusa.",
    stack: ["Dostop", "Vloge", "Status"],
  },
  {
    icon: Smartphone,
    title: "Mobilne aplikacije",
    problem: "Terenska ali prodajna ekipa nima podatkov pri sebi.",
    solution: "Aplikacija, ki bere in piše v isti API kot ostali sistemi.",
    result: "Enaki podatki v pisarni in na terenu.",
    description:
      "Mobilne aplikacije, povezane na isti API kot CRM, ERP ali portal.",
    stack: ["iOS", "Android", "API"],
  },
  {
    icon: Cloud,
    title: "SaaS",
    problem: "Izdelek za več strank potrebuje račune, vloge in merjenje uporabe.",
    solution: "Večnajemniška aplikacija z jasno ločitvijo podatkov.",
    result: "Eno jedro kode, ločeni računi strank.",
    description:
      "SaaS jedro z računi, vlogami in ločenimi podatki za več strank.",
    stack: ["Računi", "Vloge", "Merjenje"],
  },
  {
    icon: Cable,
    title: "API integracije",
    problem: "CRM, ERP, računovodstvo in splet niso usklajeni.",
    solution: "Stabilni vmesniki in sinhronizacija med sistemi.",
    result: "Enkratni vnos, ažurni podatki povsod.",
    description:
      "API integracije med CRM, ERP, računovodstvom in internimi orodji.",
    stack: ["CRM", "ERP", "Računovodstvo"],
  },
  {
    icon: Workflow,
    title: "Poslovna avtomatizacija",
    problem: "Ročni koraki med orodji povzročajo zamude in napake.",
    solution: "Tokovi, ki sprožijo dejanja ob dogodkih v sistemih.",
    result: "Krajši cikel obdelave z manj ročnimi koraki.",
    description:
      "Avtomatizacija poslovnih tokov med obstoječimi orodji in API-ji.",
    stack: ["Tokovi", "Dogodki", "Nadzor"],
  },
];
