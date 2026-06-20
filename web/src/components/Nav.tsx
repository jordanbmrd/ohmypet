import { asset } from "@/lib/utils";
import { MovingBorderButton } from "@/components/ui/moving-border-button";
import { ResizableNavbar } from "@/components/ui/resizable-navbar";

const links = [
  { href: "#process", label: "Comment ça marche" },
  { href: "#themes", label: "Thèmes" },
  { href: "#tirages", label: "Tirages" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <ResizableNavbar>
      <a href="#top" className="flex items-center gap-2 pl-1">
        <img src={asset("/paw.svg")} alt="" className="h-4 w-4" />
        <span className="text-[0.95rem] font-semibold tracking-[0.04em]">
          OhMyPet
        </span>
      </a>

      <ul className="hidden items-center gap-8 md:flex">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="group relative text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          </li>
        ))}
      </ul>

      <MovingBorderButton
        duration={3200}
        containerClassName="hidden h-11 sm:block"
        className="px-5 text-sm"
      >
        Créer mon portrait
      </MovingBorderButton>
    </ResizableNavbar>
  );
}
