/**
 * Server-side product catalogue — the single source of truth for prices.
 * The web client shows the same catalogue (web/src/lib/catalog.ts) but the
 * checkout only ever charges what is computed here: client prices are ignored.
 * Keep ids, labels and prices in sync with the web copy and the iOS `ProductCategory`.
 */

export interface OptionValue {
  id: string;
  label: string;
  priceDeltaCents: number;
}

export interface ProductOption {
  id: string;
  label: string;
  values: OptionValue[];
}

export interface CatalogProduct {
  id: ProductId;
  name: string;
  basePriceCents: number;
  options: ProductOption[];
}

export const PRODUCT_IDS = ["print", "mug", "case"] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];

export const CATALOG: Record<ProductId, CatalogProduct> = {
  print: {
    id: "print",
    name: "Tirage encadré",
    basePriceCents: 4900,
    options: [
      {
        id: "size",
        label: "Format",
        values: [
          { id: "20x30", label: "20 × 30 cm", priceDeltaCents: 0 },
          { id: "30x40", label: "30 × 40 cm", priceDeltaCents: 2000 },
          { id: "40x50", label: "40 × 50 cm", priceDeltaCents: 4000 },
        ],
      },
      {
        id: "frame",
        label: "Cadre",
        values: [
          { id: "oak", label: "Chêne", priceDeltaCents: 0 },
          { id: "black", label: "Noir", priceDeltaCents: 0 },
        ],
      },
    ],
  },
  mug: {
    id: "mug",
    name: "La tasse",
    basePriceCents: 2400,
    options: [
      {
        id: "color",
        label: "Couleur",
        values: [
          { id: "white", label: "Blanc", priceDeltaCents: 0 },
          { id: "black", label: "Noir", priceDeltaCents: 300 },
        ],
      },
    ],
  },
  case: {
    id: "case",
    name: "Coque de téléphone",
    basePriceCents: 2900,
    options: [
      {
        id: "model",
        label: "Modèle",
        values: [
          { id: "iphone-15", label: "iPhone 15", priceDeltaCents: 0 },
          { id: "iphone-15-pro", label: "iPhone 15 Pro", priceDeltaCents: 0 },
          { id: "iphone-16", label: "iPhone 16", priceDeltaCents: 0 },
          { id: "iphone-16-pro", label: "iPhone 16 Pro", priceDeltaCents: 0 },
          { id: "galaxy-s24", label: "Samsung Galaxy S24", priceDeltaCents: 0 },
          { id: "galaxy-s25", label: "Samsung Galaxy S25", priceDeltaCents: 0 },
        ],
      },
    ],
  },
};

/** Flat-rate shipping, waived from FREE_SHIPPING_THRESHOLD_CENTS. */
export const SHIPPING_CENTS = 490;
export const FREE_SHIPPING_THRESHOLD_CENTS = 6000;
export const MAX_QUANTITY_PER_LINE = 10;

export function isProductId(value: string): value is ProductId {
  return (PRODUCT_IDS as readonly string[]).includes(value);
}

export interface PricedLine {
  productId: ProductId;
  productName: string;
  /** Human-readable options, e.g. "Format : 30 × 40 cm · Cadre : Chêne". */
  description: string;
  options: Record<string, string>;
  unitPriceCents: number;
}

/**
 * Resolves a product + chosen options to a priced line. Every option of the
 * product must be given exactly once with a known value; anything else throws.
 */
export function priceLine(
  productId: ProductId,
  chosen: Record<string, string>,
): PricedLine {
  const product = CATALOG[productId];
  const extraKeys = Object.keys(chosen).filter(
    (k) => !product.options.some((o) => o.id === k),
  );
  if (extraKeys.length > 0) {
    throw new Error(`Unknown option "${extraKeys[0]}" for ${productId}`);
  }

  let unit = product.basePriceCents;
  const parts: string[] = [];
  const options: Record<string, string> = {};
  for (const option of product.options) {
    const valueId = chosen[option.id];
    const value = option.values.find((v) => v.id === valueId);
    if (!value) {
      throw new Error(`Invalid value for ${productId}.${option.id}`);
    }
    unit += value.priceDeltaCents;
    parts.push(`${option.label} : ${value.label}`);
    options[option.id] = value.id;
  }

  return {
    productId,
    productName: product.name,
    description: parts.join(" · "),
    options,
    unitPriceCents: unit,
  };
}

export function shippingFor(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS;
}
