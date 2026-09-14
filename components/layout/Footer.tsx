import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050816]">
      <div className="container grid gap-6 py-9 md:grid-cols-4">
        <div>
          <Image
            src="/logo/ju-tan-studio.png"
            alt="JU-TAN"
            width={220}
            height={70}
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
            <li><Link href="/">Domov</Link></li>
            <li><Link href="#about">Zakaj JU-TAN</Link></li>
            <li><Link href="#projects">Projekti</Link></li>
            <li><Link href="#contact">Kontakt</Link></li>
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
            <p>info@ju-tan.com</p>
            <p>+386 xx xxx xxx</p>
            <p>Slovenija</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} JU-TAN. Vse pravice pridržane.
      </div>
    </footer>
  );
}
