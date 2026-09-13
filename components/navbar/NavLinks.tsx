import { navigation } from "@/lib/navigation";

type NavLinksProps = {
  onNavigate?: () => void;
  className?: string;
};

export default function NavLinks({
  onNavigate,
  className = "hidden items-center gap-8 lg:flex",
}: NavLinksProps) {
  return (
    <nav className={className}>
      {navigation.map((item) => (
        <a
          key={item.label}
          href={item.href}
          onClick={onNavigate}
          className="relative font-medium text-gray-300 transition hover:text-green-400 after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-green-400 after:transition-all hover:after:w-full"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}