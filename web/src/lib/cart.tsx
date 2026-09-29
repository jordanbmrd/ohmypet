import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ProductKey } from "./content";
import { MAX_QUANTITY, getProduct, shippingFor, unitPrice } from "./catalog";

/** A cart line: a product variant printed with one generated portrait. */
export type CartItem = {
  id: string;
  jobId: string;
  imageURL: string;
  themeKey: string;
  productKey: ProductKey;
  options: Record<string, string>;
  quantity: number;
  /** ISO date — portraits (and their URLs) are kept 7 days server-side. */
  createdAt: string;
};

const STORAGE_KEY = "ohmypet.cart.v1";
/** Slightly under the backend's 7-day job TTL so checkout never races expiry. */
const PORTRAIT_LIFETIME_MS = 6.5 * 24 * 60 * 60 * 1000;

export function isExpired(item: CartItem): boolean {
  return Date.now() - new Date(item.createdAt).getTime() > PORTRAIT_LIFETIME_MS;
}

export function lineTotal(item: CartItem): number {
  return unitPrice(getProduct(item.productKey), item.options) * item.quantity;
}

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const sameLine = (a: Omit<CartItem, "id" | "quantity" | "createdAt">, b: CartItem) =>
  a.jobId === b.jobId &&
  a.productKey === b.productKey &&
  JSON.stringify(a.options) === JSON.stringify(b.options);

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  add: (item: Omit<CartItem, "id" | "createdAt">) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Private mode / storage full: the cart still works for this visit.
    }
  }, [items]);

  // Keep several tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback<CartContextValue["add"]>((item) => {
    setItems((prev) => {
      const existing = prev.find((p) => sameLine(item, p));
      if (existing) {
        return prev.map((p) =>
          p === existing
            ? { ...p, quantity: Math.min(MAX_QUANTITY, p.quantity + item.quantity) }
            : p,
        );
      }
      return [
        ...prev,
        { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
      ];
    });
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    const q = Math.max(1, Math.min(MAX_QUANTITY, quantity));
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: q } : p)));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const payable = items.filter((i) => !isExpired(i));
    const subtotalCents = payable.reduce((sum, i) => sum + lineTotal(i), 0);
    const shippingCents = payable.length ? shippingFor(subtotalCents) : 0;
    return {
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotalCents,
      shippingCents,
      totalCents: subtotalCents + shippingCents,
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [items, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
