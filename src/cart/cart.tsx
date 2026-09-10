import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getProducts } from "@/lib/api";
import type { Product } from "@/lib/types";

export type CartLine = { id: string; qty: number };

type Ctx = {
  lines: CartLine[];
  count: number;
  total: number;
  detailed: { product: Product; qty: number; lineTotal: number }[];
  loading: boolean;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "as-africa-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    getProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setLines(
            parsed
              .filter(
                (l): l is CartLine =>
                  !!l &&
                  typeof (l as CartLine).id === "string" &&
                  Number.isFinite((l as CartLine).qty),
              )
              .filter((l) => /^\d+$/.test(l.id))
              .map((l) => ({ id: l.id, qty: Math.max(1, Math.min(99, Math.round(l.qty))) })),
          );
        }
      }
    } catch {
      /* ignore corrupt cart */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const add = useCallback((id: string, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.id === id);
      if (found) {
        return prev.map((l) => (l.id === id ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
      }
      return [...prev, { id, qty }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(99, qty) } : l)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<Ctx>(() => {
    const detailed = lines.flatMap((l) => {
      const product = products.find((p) => String(p.id) === l.id);
      return product
        ? [{ product, qty: l.qty, lineTotal: Number(product.price) * l.qty }]
        : [];
    });
    return {
      lines,
      detailed,
      count: detailed.reduce((s, l) => s + l.qty, 0),
      total: detailed.reduce((s, l) => s + l.lineTotal, 0),
      add,
      setQty,
      remove,
      clear,
      loading: !hydrated || products.length === 0,
    };
  }, [lines, products, hydrated, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}