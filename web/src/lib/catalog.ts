/**
 * Orderable catalogue shown in the studio and cart. Mirrors the server copy in
 * backend/src/lib/catalog.ts — the backend recomputes every price at checkout,
 * so these values are for display only. Keep both files in sync.
 */

import type { ProductKey } from "./content";

export type OptionValue = { id: string; label: string; priceDeltaCents: number };
export type ProductOption = { id: string; label: string; values: OptionValue[] };

export type CatalogProduct = {
  key: ProductKey;
  name: string;
  tagline: string;
  basePriceCents: number;
  options: ProductOption[];
};

export const catalog: CatalogProduct[] = [
  {
    key: "print",
    name: "Tirage encadré",
    tagline: "Tirage giclée sur papier d'art, encadré main, prêt à accrocher.",
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
  {
    key: "mug",
    name: "La tasse",
    tagline: "Céramique 330 ml, finition mate, compatible lave-vaisselle.",
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
  {
    key: "case",
    name: "Coque de téléphone",
    tagline: "Coque rigide antichoc, impression sur toute la surface.",
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
];

export const SHIPPING_CENTS = 490;
export const FREE_SHIPPING_THRESHOLD_CENTS = 6000;
export const MAX_QUANTITY = 10;

export function getProduct(key: ProductKey): CatalogProduct {
  return catalog.find((p) => p.key === key)!;
}

export function defaultOptions(product: CatalogProduct): Record<string, string> {
  return Object.fromEntries(product.options.map((o) => [o.id, o.values[0].id]));
}

export function unitPrice(product: CatalogProduct, options: Record<string, string>): number {
  return product.options.reduce((sum, o) => {
    const value = o.values.find((v) => v.id === options[o.id]);
    return sum + (value?.priceDeltaCents ?? 0);
  }, product.basePriceCents);
}

export function describeOptions(product: CatalogProduct, options: Record<string, string>): string {
  return product.options
    .map((o) => o.values.find((v) => v.id === options[o.id])?.label)
    .filter(Boolean)
    .join(" · ");
}

export function shippingFor(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS;
}

const eur = (fractionDigits: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

/** 2400 → "24 €", 490 → "4,90 €". */
export function formatPrice(cents: number): string {
  return eur(cents % 100 === 0 ? 0 : 2).format(cents / 100);
}
