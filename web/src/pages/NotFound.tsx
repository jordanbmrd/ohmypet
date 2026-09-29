import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

export function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
      <p className="eyebrow mb-5">Erreur 404</p>
      <h1 className="display text-[clamp(2.4rem,6vw,4rem)]">
        Cette page s'est <span className="italic text-accent">égarée.</span>
      </h1>
      <p className="mt-6 text-ink-soft">
        Comme un chat en vadrouille. Revenons à l'atelier.
      </p>
      <Link to="/" className={buttonVariants({ size: "lg", className: "mt-10" })}>
        Retour à l'accueil
      </Link>
    </section>
  );
}
