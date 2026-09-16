import {
  BrainCircuit,
  CloudCog,
  Database,
  MonitorSmartphone,
  ServerCog,
  Workflow,
} from "lucide-react";
import TechCard from "./TechCard";

const items = [
  {
    title: "Frontend",
    text: "Next.js · React · Tailwind",
    icon: MonitorSmartphone,
  },
  {
    title: "Backend",
    text: "Node.js · Python · API integracije",
    icon: ServerCog,
  },
  {
    title: "AI",
    text: "OpenAI · LangChain · AI agenti",
    icon: BrainCircuit,
  },
  {
    title: "Cloud",
    text: "Docker · Linux · VPS · Cloudflare",
    icon: CloudCog,
  },
  {
    title: "Database",
    text: "PostgreSQL · MySQL · SQLite",
    icon: Database,
  },
  {
    title: "DevOps",
    text: "CI/CD · monitoring · varnostne kopije",
    icon: Workflow,
  },
] as const;

export default function TechGrid() {
  return (
    <div className="relative mx-auto w-full max-w-[44rem]">
      <ul className="relative flex w-full flex-col items-stretch gap-5 sm:flex-row sm:flex-wrap sm:justify-center">
        {items.map((item) => (
          <li key={item.title} className="flex w-full sm:w-[13.75rem]">
            <TechCard icon={item.icon} title={item.title} text={item.text} />
          </li>
        ))}
      </ul>
    </div>
  );
}
