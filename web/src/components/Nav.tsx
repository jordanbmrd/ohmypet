import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { asset } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { MovingBorderButton } from "@/components/ui/moving-border-button";
import { ResizableNavbar } from "@/components/ui/resizable-navbar";

const links = [
  { hash: "#process", label: "Comment ça marche" },
  { hash: "#themes", label: "Thèmes" },
  { hash: "#tirages", label: "Tirages" },
  { hash: "#faq", label: "FAQ" },
];

export function Nav() {
  const navigate = useNavigate();
  const { count } = useCart();

  return (
    <ResizableNavbar>
      <Link to="/" className="flex items-center gap-2 pl-1">
        <img src={asset("/paw.svg")} alt="" className="h-4 w-4" />
        <span className="text-[0.95rem] font-semibold tracking-[0.04em]">
          OhMyPet
        </span>
      </Link>

      <ul className="hidden items-center gap-8 md:flex">
        {links.map((l) => (
          <li key={l.hash}>
            <Link
              to={{ pathname: "/", hash: l.hash }}
              className="group relative text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/panier"
          aria-label={`Panier (${count} article${count > 1 ? "s" : ""})`}
          className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
        >
          <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
          {count > 0 && (
            <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[0.65rem] font-semibold text-surface">
              {count}
            </span>
          )}
        </Link>
        <MovingBorderButton
          duration={3200}
          containerClassName="hidden h-11 sm:block"
          className="px-5 text-sm"
          onClick={() => navigate("/creer")}
        >
          Créer mon portrait
        </MovingBorderButton>
      </div>
    </ResizableNavbar>
  );
}
