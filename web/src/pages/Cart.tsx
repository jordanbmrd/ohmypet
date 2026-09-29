import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowRight, Loader2, Lock, X } from "lucide-react";
import { themes } from "@/lib/content";
import {
  describeOptions,
  formatPrice,
  FREE_SHIPPING_THRESHOLD_CENTS,
  getProduct,
} from "@/lib/catalog";
import { isExpired, lineTotal, useCart } from "@/lib/cart";
import { isDemoMode, startCheckout } from "@/lib/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { QuantityStepper } from "@/components/studio/ResultStep";
import { cn } from "@/lib/utils";

export function Cart() {
  const cart = useCart();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payable = cart.items.filter((i) => !isExpired(i));
  const hasExpired = payable.length !== cart.items.length;
  const remainingForFree = FREE_SHIPPING_THRESHOLD_CENTS - cart.subtotalCents;

  const checkout = async () => {
    setError(null);
    setLoading(true);
    try {
      const url = await startCheckout(
        payable.map((i) => ({
          jobId: i.jobId,
          productId: i.productKey,
          options: i.options,
          quantity: i.quantity,
        })),
      );
      window.location.assign(url);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 pb-20 pt-32 text-center">
        <p className="eyebrow mb-5">Votre panier</p>
        <h1 className="display text-[clamp(2.4rem,6vw,4rem)]">
          Encore <span className="italic text-accent">vide.</span>
        </h1>
        <p className="mt-6 text-ink-soft">
          Créez le portrait de votre compagnon, puis choisissez le support qui lui ressemble.
        </p>
        <Link to="/creer" className={buttonVariants({ size: "lg", className: "group mt-10" })}>
          Créer mon portrait
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-28 pt-32 lg:px-10 lg:pt-40">
      <p className="eyebrow mb-5">Votre panier</p>
      <h1 className="display text-[clamp(2.4rem,5vw,4rem)]">
        Presque <span className="italic text-accent">au mur.</span>
      </h1>

      {params.get("paiement") === "annule" && (
        <p className="mt-8 rounded-card border border-hairline bg-surface p-4 text-sm text-ink-soft">
          Le paiement a été interrompu. Vos articles sont toujours là, prêts quand vous l'êtes.
        </p>
      )}

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_0.8fr] lg:gap-16">
        <ul className="border-t border-hairline">
          {cart.items.map((item) => {
            const product = getProduct(item.productKey);
            const theme = themes.find((t) => t.key === item.themeKey);
            const expired = isExpired(item);
            return (
              <li key={item.id} className="flex gap-5 border-b border-hairline py-6 sm:gap-7">
                <div className="w-24 shrink-0 rounded-[10px] bg-surface p-1.5 shadow-[0_16px_30px_-20px_rgba(20,17,13,0.4)] ring-1 ring-hairline sm:w-28">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-canvas">
                    <img
                      src={item.imageURL}
                      alt={theme?.title ?? "Portrait"}
                      className={cn("absolute inset-0 h-full w-full object-cover", expired && "opacity-40 grayscale")}
                    />
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-[0.95rem] font-medium">{product.name}</h2>
                      <p className="mt-1 text-sm text-ink-soft">{describeOptions(product, item.options)}</p>
                      {theme && (
                        <p className="mt-1 flex items-center gap-2 text-xs text-ink-faint">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.accentVar }} />
                          {theme.title}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => cart.remove(item.id)}
                      aria-label={`Retirer ${product.name}`}
                      className="-mr-2 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-4 pt-4">
                    {expired ? (
                      <p className="flex items-center gap-2 text-xs text-[color:var(--color-chef)]">
                        <AlertCircle className="h-4 w-4" />
                        Portrait expiré, recréez-le pour le commander.
                      </p>
                    ) : (
                      <QuantityStepper
                        value={item.quantity}
                        onChange={(q) => cart.setQuantity(item.id, q)}
                      />
                    )}
                    <span className={cn("display text-xl", expired && "text-ink-faint line-through")}>
                      {formatPrice(lineTotal(item))}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
          <li className="pt-6">
            <Link to="/creer" className="text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline">
              + Créer un autre portrait
            </Link>
          </li>
        </ul>

        <aside className="h-fit rounded-card border border-hairline bg-surface p-7 lg:sticky lg:top-28">
          <h2 className="eyebrow mb-6">Récapitulatif</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Sous-total</dt>
              <dd>{formatPrice(cart.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Livraison suivie</dt>
              <dd>{cart.shippingCents === 0 ? "Offerte" : formatPrice(cart.shippingCents)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-hairline pt-4">
              <dt className="font-medium">Total TTC</dt>
              <dd className="display text-3xl">{formatPrice(cart.totalCents)}</dd>
            </div>
          </dl>

          {remainingForFree > 0 && payable.length > 0 && (
            <p className="mt-4 text-xs text-ink-soft">
              Plus que {formatPrice(remainingForFree)} pour la livraison offerte.
            </p>
          )}

          <Button
            size="lg"
            className="mt-7 w-full"
            disabled={loading || payable.length === 0}
            onClick={checkout}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            Paiement sécurisé
          </Button>

          {error && (
            <p role="alert" className="mt-4 text-sm text-[color:var(--color-chef)]">
              {error}
            </p>
          )}
          {hasExpired && (
            <p className="mt-4 text-xs text-ink-soft">
              Les portraits expirés ne sont pas inclus dans le total.
            </p>
          )}

          <ul className="mt-7 space-y-2 border-t border-hairline pt-6 text-xs text-ink-soft">
            <li>Carte bancaire, Apple Pay et Google Pay via Stripe</li>
            <li>Fabrication à la commande, expédition sous 2 à 4 jours</li>
            <li>Livraison en France, Belgique, Suisse, Luxembourg et Monaco</li>
          </ul>
          {isDemoMode && (
            <p className="mt-5 text-xs text-ink-faint">
              Version de démonstration : le paiement est désactivé.
            </p>
          )}
          <p className="mt-5 text-xs text-ink-faint">
            En validant, vous acceptez nos{" "}
            <Link to="/cgv" className="underline underline-offset-2 hover:text-ink">
              conditions générales de vente
            </Link>
            .
          </p>
        </aside>
      </div>
    </section>
  );
}
