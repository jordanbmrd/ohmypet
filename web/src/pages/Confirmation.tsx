import { useEffect, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { themes } from "@/lib/content";
import { formatPrice } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { getOrder, type Order } from "@/lib/api";
import { buttonVariants } from "@/components/ui/button";

/** Stripe's webhook usually lands within seconds of the redirect. */
const POLL_INTERVAL_MS = 2500;
const POLL_ATTEMPTS = 16;

export function Confirmation() {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const { clear } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Stripe only redirects here after a successful payment: the cart is done.
  useEffect(() => {
    if (orderId) clear();
  }, [orderId, clear]);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async (attempt: number) => {
      try {
        const o = await getOrder(orderId);
        if (cancelled) return;
        setOrder(o);
        if (o.status === "pending_payment" && attempt < POLL_ATTEMPTS) {
          timer = setTimeout(() => poll(attempt + 1), POLL_INTERVAL_MS);
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    };
    void poll(0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderId]);

  if (!orderId || error) {
    return (
      <Shell eyebrow="Commande" title="Commande" accent="introuvable.">
        <p className="mt-6 text-ink-soft">
          {error ?? "Ce lien de commande est incomplet."} Si vous avez été débité, votre reçu Stripe
          fait foi : contactez-nous en indiquant son numéro.
        </p>
        <Link to="/" className={buttonVariants({ size: "lg", className: "mt-10" })}>
          Retour à l'accueil
        </Link>
      </Shell>
    );
  }

  if (!order) {
    return (
      <Shell eyebrow="Commande" title="Un instant" accent="…">
        <Loader2 className="mx-auto mt-8 h-6 w-6 animate-spin text-ink-soft" />
      </Shell>
    );
  }

  const paid = order.status === "paid";
  const reference = order.orderId.slice(0, 8).toUpperCase();

  return (
    <Shell
      eyebrow={`Commande n° ${reference}`}
      title={paid ? "Merci," : "Paiement en"}
      accent={paid ? "c'est dans l'atelier." : "cours de confirmation."}
    >
      <span className="mx-auto mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-canvas">
        {paid ? <Check className="h-5 w-5" /> : <Loader2 className="h-5 w-5 animate-spin" />}
      </span>
      <p className="mx-auto mt-6 max-w-md text-ink-soft">
        {paid
          ? `Votre commande est confirmée${order.email ? ` et un reçu a été envoyé à ${order.email}` : ""}. Nous l'imprimons avec soin et l'expédions sous 2 à 4 jours ouvrés.`
          : "Votre paiement est en cours de validation par votre banque. Vous recevrez un email dès qu'il sera confirmé, inutile de repasser commande."}
      </p>

      <div className="mx-auto mt-12 max-w-xl rounded-card border border-hairline bg-surface p-6 text-left">
        <ul className="divide-y divide-hairline">
          {order.items.map((item, i) => {
            const theme = themes.find((t) => t.key === item.theme);
            return (
              <li key={i} className="flex items-center gap-4 py-4 first:pt-0">
                {item.imageURL && (
                  <img
                    src={item.imageURL}
                    alt=""
                    className="h-16 w-13 shrink-0 rounded-md object-cover ring-1 ring-hairline"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {item.productName} {item.quantity > 1 && <span className="text-ink-soft">× {item.quantity}</span>}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {item.description}
                    {theme && ` · ${theme.title}`}
                  </p>
                </div>
                <span className="text-sm">{formatPrice(item.unitPriceCents * item.quantity)}</span>
              </li>
            );
          })}
        </ul>
        <dl className="mt-2 space-y-2 border-t border-hairline pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Livraison{order.shippingCity ? ` · ${order.shippingCity}` : ""}</dt>
            <dd>{order.shippingCents === 0 ? "Offerte" : formatPrice(order.shippingCents)}</dd>
          </div>
          <div className="flex items-baseline justify-between">
            <dt className="font-medium">Total payé</dt>
            <dd className="display text-2xl">{formatPrice(order.totalCents)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link to="/creer" className={buttonVariants({ size: "lg" })}>
          Créer un autre portrait
        </Link>
        <Link to="/" className={buttonVariants({ size: "lg", variant: "outline" })}>
          Retour à l'accueil
        </Link>
      </div>
    </Shell>
  );
}

function Shell({
  eyebrow,
  title,
  accent,
  children,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto min-h-[70vh] max-w-3xl px-6 pb-28 pt-32 text-center lg:pt-40">
      <p className="eyebrow mb-5">{eyebrow}</p>
      <h1 className="display text-[clamp(2.4rem,5vw,4rem)]">
        {title} <span className="italic text-accent">{accent}</span>
      </h1>
      {children}
    </section>
  );
}
