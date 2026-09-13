import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050816]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-4">
        {/* Logo */}
        <div>
          <Image
            src="/logo/ju-tan-studio.png"
            alt="JU-TAN Studio"
            width={220}
            height={70}
            className="h-12 w-auto"
          />

          <p className="mt-6 text-sm leading-7 text-gray-400">
            AI avtomatizacija, razvoj programske opreme,
            spletne strani, grafično oblikovanje,
            video produkcija in IT infrastruktura.
          </p>
        </div>

        {/* Podjetje */}
        <div>
          <h3 className="mb-6 font-bold">Podjetje</h3>

          <ul className="space-y-3 text-gray-400">
            <li><Link href="/">Domov</Link></li>
            <li><Link href="#about">O nas</Link></li>
            <li><Link href="#projects">Projekti</Link></li>
            <li><Link href="#contact">Kontakt</Link></li>
          </ul>
        </div>

        {/* Storitve */}
        <div>
          <h3 className="mb-6 font-bold">Storitve</h3>

          <ul className="space-y-3 text-gray-400">
            <li>AI Avtomatizacija</li>
            <li>Programska oprema</li>
            <li>Spletne strani</li>
            <li>Grafično oblikovanje</li>
            <li>Video produkcija</li>
          </ul>
        </div>

        {/* Kontakt */}
        <div>
          <h3 className="mb-6 font-bold">Kontakt</h3>

          <div className="space-y-3 text-gray-400">
            <p>info@ju-tan.si</p>
            <p>+386 xx xxx xxx</p>
            <p>Slovenija</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} JU-TAN Studio. Vse pravice pridržane.
      </div>
    </footer>
  );
}