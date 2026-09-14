import Link from "next/link";
import Image from "next/image";
import { company } from "@/lib/data/company";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050816]">
      <div className="container grid gap-6 py-9 md:grid-cols-4">
        <div>
          <Image
            src="/logo/ju-tan-studio.png"
            alt="Logotip JU-TAN"
            width={220}
            height={70}
            sizes="220px"
            className="h-12 w-auto"
          />

          <p className="mt-4 text-sm leading-[1.65] text-gray-400">
            Umetna inteligenca, avtomatizacija, razvoj programske opreme,
            spletne rešitve, oblikovanje in infrastruktura za sodobna podjetja.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-bold">Podjetje</h3>

          <ul className="space-y-3 text-gray-400">
            <li><Link className="rounded-sm transition hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500" href="/">Domov</Link></li>
            <li><Link className="rounded-sm transition hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500" href="#about">Zakaj JU-TAN</Link></li>
            <li><Link className="rounded-sm transition hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500" href="#projects">Projekti</Link></li>
            <li><Link className="rounded-sm transition hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500" href="#contact">Kontakt</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold">Storitve</h3>

          <ul className="space-y-3 text-gray-400">
            <li>Umetna inteligenca</li>
            <li>Razvoj programske opreme</li>
            <li>Spletne rešitve</li>
            <li>Oblikovanje in video</li>
            <li>IT infrastruktura</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold">Kontakt</h3>

          <div className="space-y-3 text-gray-400">
            <p>
              <a
                href={`mailto:${company.contact.email}`}
                className="rounded-sm transition hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                {company.contact.email}
              </a>
            </p>
            <p>{company.contact.phone}</p>
            <p>{company.contact.location}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} JU-TAN. Vse pravice pridržane.
      </div>
    </footer>
  );
}
