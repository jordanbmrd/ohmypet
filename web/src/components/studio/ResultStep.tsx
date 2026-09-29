import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, RotateCcw, ShoppingBag, Palette } from "lucide-react";
import { themes, type ProductKey } from "@/lib/content";
import {
  catalog,
  defaultOptions,
  formatPrice,
  FREE_SHIPPING_THRESHOLD_CENTS,
  getProduct,
  MAX_QUANTITY,
  unitPrice,
} from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { Button, buttonVariants } from "@/components/ui/button";
import { PosterFrame } from "@/components/PosterFrame";
import { productMocks } from "@/components/ProductShowcase";
import { cn } from "@/lib/utils";

export type Portrait = { jobId: string; imageURL: string; themeKey: string };

export function ResultStep({
  portraits,
  activeIndex,
  onActivate,
  initialProduct,
  onOtherTheme,
  onRegenerate,
}: {
  portraits: Portrait[];
  activeIndex: number;
  onActivate: (index: number) => void;
  initialProduct: ProductKey;
  onOtherTheme: () => void;
  onRegenerate: () => void;
}) {
  const portrait = portraits[activeIndex];
  const theme = themes.find((t) => t.key === portrait.themeKey) ?? themes[0];
  const { add } = useCart();

  const [productKey, setProductKey] = useState<ProductKey>(initialProduct);
  const product = getProduct(productKey);
  const [options, setOptions] = useState(() => defaultOptions(product));
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => setAdded(false), [productKey, options, quantity, activeIndex]);

  const selectProduct = (key: ProductKey) => {
    setProductKey(key);
    setOptions(defaultOptions(getProduct(key)));
    setQuantity(1);
  };

  const Mock = productMocks[productKey];
  const price = unitPrice(product, options);

  const addToCart = () => {
    add({
      jobId: portrait.jobId,
      imageURL: portrait.imageURL,
      themeKey: portrait.themeKey,
      productKey,
      options,
      quantity,
    });
    setAdded(true);
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      {/* Left — the portrait */}
      <div>
        <motion.div
          key={portrait.jobId}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[440px]"
        >
          <PosterFrame
            accent={theme.accentVar}
            label={theme.subtitle}
            caption={`${theme.title} · Pièce unique`}
            image={portrait.imageURL}
          />
        </motion.div>

        {portraits.length > 1 && (
          <div className="mx-auto mt-6 max-w-[440px]">
            <p className="eyebrow mb-3">Vos créations</p>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {portraits.map((p, i) => (
                <button
                  key={p.jobId}
                  type="button"
                  onClick={() => onActivate(i)}
                  aria-label={`Afficher la création ${i + 1}`}
                  className={cn(
                    "relative h-20 w-16 shrink-0 overflow-hidden rounded-md ring-1 transition-all",
                    i === activeIndex ? "ring-2 ring-ink" : "ring-hairline opacity-70 hover:opacity-100",
                  )}
                >
                  <img src={p.imageURL} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto mt-6 flex max-w-[440px] flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={onOtherTheme}>
            <Palette className="h-4 w-4" />
            Essayer un autre thème
          </Button>
          <Button variant="outline" size="sm" onClick={onRegenerate}>
            <RotateCcw className="h-4 w-4" />
            Nouvelle version
          </Button>
        </div>
      </div>

      {/* Right — the object */}
      <div>
        <p className="eyebrow mb-4">Choisissez le support</p>
        <div className="grid grid-cols-3 gap-3">
          {catalog.map((p) => (
            <button
              key={p.key}
              type="button"
              aria-pressed={p.key === productKey}
              onClick={() => selectProduct(p.key)}
              className={cn(
                "rounded-card border px-3 py-4 text-left transition-all duration-300",
                p.key === productKey
                  ? "border-ink bg-surface shadow-[0_12px_30px_-20px_rgba(20,17,13,0.5)]"
                  : "border-hairline hover:border-hairline-strong",
              )}
            >
              <span className="block text-sm font-medium">{p.name}</span>
              <span className="mt-1 block text-xs text-ink-soft">dès {formatPrice(p.basePriceCents)}</span>
            </button>
          ))}
        </div>

        <div className="relative mt-6 h-[300px] overflow-hidden rounded-card border border-hairline bg-surface">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background: "radial-gradient(100% 80% at 50% 100%, rgba(168,133,79,0.1), transparent 55%)",
            }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={productKey}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <Mock image={portrait.imageURL} finish={options.frame ?? options.color} />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-4 text-sm text-ink-soft">{product.tagline}</p>

        {product.options.map((option) => (
          <fieldset key={option.id} className="mt-7">
            <legend className="eyebrow mb-3">{option.label}</legend>
            <div className="flex flex-wrap gap-2">
              {option.values.map((v) => {
                const active = options[option.id] === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setOptions((o) => ({ ...o, [option.id]: v.id }))}
                    className={cn(
                      "h-10 rounded-full border px-4 text-sm transition-all duration-300",
                      active ? "border-ink bg-ink text-canvas" : "border-hairline-strong hover:border-ink",
                    )}
                  >
                    {v.label}
                    {v.priceDeltaCents > 0 && (
                      <span className={cn("ml-1.5", active ? "text-canvas/70" : "text-ink-faint")}>
                        +{formatPrice(v.priceDeltaCents)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div className="mt-9 flex flex-wrap items-center justify-between gap-6 border-t border-hairline pt-7">
          <div className="flex items-center gap-5">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <span className="display text-3xl">{formatPrice(price * quantity)}</span>
          </div>
          <Button size="lg" onClick={addToCart} className="group">
            {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
            {added ? "Ajouté au panier" : "Ajouter au panier"}
          </Button>
        </div>

        <AnimatePresence>
          {added && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-card border border-hairline bg-surface p-5">
                <p className="text-sm text-ink-soft">
                  C'est dans le panier. Ajoutez un autre support ou finalisez votre commande.
                </p>
                <Link to="/panier" className={buttonVariants({ size: "sm" })}>
                  Voir le panier
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 text-xs text-ink-faint">
          Livraison suivie en 4 à 8 jours ouvrés · offerte dès {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS)}
        </p>
      </div>
    </div>
  );
}

export function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex h-11 items-center rounded-full border border-hairline-strong">
      <button
        type="button"
        aria-label="Diminuer la quantité"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        className="flex h-full w-10 items-center justify-center text-ink disabled:text-ink-faint"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Augmenter la quantité"
        disabled={value >= MAX_QUANTITY}
        onClick={() => onChange(value + 1)}
        className="flex h-full w-10 items-center justify-center text-ink disabled:text-ink-faint"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
