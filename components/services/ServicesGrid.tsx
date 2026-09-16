import ServiceCard from "./ServiceCard";
import { services } from "@/lib/data/services";

export default function ServicesGrid() {
  return (
    <div className="relative mx-auto w-full max-w-[1200px]">
      <ul className="relative grid grid-cols-1 items-stretch gap-4 sm:gap-5 md:grid-cols-2">
        {services.map((service, index) => (
          <li key={service.title} className="h-full">
            <ServiceCard
              index={String(index + 1).padStart(2, "0")}
              icon={service.icon}
              title={service.title}
              problem={service.problem}
              solution={service.solution}
              result={service.result}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
