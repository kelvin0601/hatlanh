"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { CheckCircle2, X } from "lucide-react";
import type { CartLine, Order } from "@/lib/commerce";
import type { Product } from "@/lib/products";

const CART_KEY = "an-vi-cart-v1";
const LEGACY_ORDERS_KEY = "an-vi-orders-v1";
const LAST_ORDER_KEY = "an-vi-last-order-v1";
const EMPTY_CART: CartLine[] = [];
const cartListeners = new Set<() => void>();
let cartSnapshot: CartLine[] | undefined;
let lastOrderSnapshot: Order | null | undefined;

interface ToastMessage {
  id: number;
  message: string;
}

interface ShopContextValue {
  cart: CartLine[];
  catalog: Product[];
  cartCount: number;
  hydrated: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  upgradeToCombo: (combo: Product) => void;
  clearCart: () => void;
  saveOrder: (order: Order) => void;
  notify: (message: string) => void;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

function readCart(): CartLine[] {
  try {
    localStorage.removeItem(LEGACY_ORDERS_KEY);
    const value = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]") as unknown;
    if (!Array.isArray(value)) return [];
    return value.filter(
      (line): line is CartLine =>
        typeof line === "object" &&
        line !== null &&
        Number.isInteger((line as CartLine).productId) &&
        Number.isInteger((line as CartLine).quantity) &&
        (line as CartLine).quantity > 0,
    );
  } catch {
    return [];
  }
}

function getCartSnapshot() {
  if (cartSnapshot === undefined) cartSnapshot = readCart();
  return cartSnapshot;
}

function subscribeToCart(listener: () => void) {
  cartListeners.add(listener);
  return () => cartListeners.delete(listener);
}

function updateCart(updater: (current: CartLine[]) => CartLine[]) {
  cartSnapshot = updater(getCartSnapshot());
  localStorage.setItem(CART_KEY, JSON.stringify(cartSnapshot));
  cartListeners.forEach((listener) => listener());
}

function subscribeToBrowserReady() {
  return () => undefined;
}

export function ShopProvider({ children, catalog }: { children: ReactNode; catalog: Product[] }) {
  const cart = useSyncExternalStore(subscribeToCart, getCartSnapshot, () => EMPTY_CART);
  const hydrated = useSyncExternalStore(subscribeToBrowserReady, () => true, () => false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const nextToastId = useRef(0);

  const notify = useCallback((message: string) => {
    const id = ++nextToastId.current;
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3600);
  }, []);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    const safeQuantity = Math.max(1, Math.min(20, Math.floor(quantity)));
    updateCart((current) => {
      const existing = current.find((line) => line.productId === product.id);
      if (!existing) return [...current, { productId: product.id, quantity: safeQuantity, product }];
      return current.map((line) =>
        line.productId === product.id
          ? { ...line, product, quantity: Math.min(20, line.quantity + safeQuantity) }
          : line,
      );
    });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      updateCart((current) => current.filter((line) => line.productId !== productId));
      return;
    }
    updateCart((current) =>
      current.map((line) =>
        line.productId === productId
          ? { ...line, quantity: Math.min(20, Math.floor(quantity)) }
          : line,
      ),
    );
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    updateCart((current) => current.filter((line) => line.productId !== productId));
  }, []);

  const upgradeToCombo = useCallback((combo: Product) => {
    if (combo.type !== "combo" || combo.comboItems.length === 0) return;
    updateCart((current) => {
      const requiredByProduct = new Map(combo.comboItems.map((item) => [item.productId, item.quantity]));
      const next = current.flatMap((line) => {
        const requiredQuantity = requiredByProduct.get(line.productId) ?? 0;
        if (requiredQuantity === 0) return [line];
        const remainingQuantity = line.quantity - Math.min(line.quantity, requiredQuantity);
        return remainingQuantity > 0 ? [{ ...line, quantity: remainingQuantity }] : [];
      });
      const existingCombo = next.find((line) => line.productId === combo.id);
      if (existingCombo) {
        return next.map((line) => line.productId === combo.id ? { ...line, product: combo, quantity: Math.min(20, line.quantity + 1) } : line);
      }
      return [...next, { productId: combo.id, quantity: 1, product: combo }];
    });
    notify(`Đã đổi sang ${combo.shortName} để tiết kiệm hơn.`);
  }, [notify]);

  const clearCart = useCallback(() => updateCart(() => []), []);

  const saveOrder = useCallback((order: Order) => {
    try {
      localStorage.removeItem(LEGACY_ORDERS_KEY);
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
      lastOrderSnapshot = order;
    } catch {
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
      lastOrderSnapshot = order;
    }
  }, []);

  const value = useMemo<ShopContextValue>(
    () => ({
      cart,
      catalog,
      cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
      hydrated,
      addToCart,
      updateQuantity,
      removeFromCart,
      upgradeToCombo,
      clearCart,
      saveOrder,
      notify,
      cartOpen,
      openCart,
      closeCart,
    }),
    [cart, catalog, hydrated, addToCart, updateQuantity, removeFromCart, upgradeToCombo, clearCart, saveOrder, notify, cartOpen, openCart, closeCart],
  );

  return (
    <ShopContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-4 left-1/2 z-[100] flex w-[calc(100%_-_2rem)] max-w-[420px] -translate-x-1/2 flex-col gap-2 sm:left-auto sm:right-6 sm:translate-x-0"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 rounded-[14px] border border-white/15 bg-forest px-4 py-3 text-white shadow-[0_16px_44px_rgba(24,53,34,0.28)]"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-[#d7e2cb]" aria-hidden="true" />
            <p className="flex-1 text-[14px] font-medium leading-5">{toast.message}</p>
            <button
              type="button"
              onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Đóng thông báo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used inside ShopProvider");
  return context;
}

export function readLastOrder(): Order | null {
  if (lastOrderSnapshot !== undefined) return lastOrderSnapshot;
  try {
    const value = sessionStorage.getItem(LAST_ORDER_KEY);
    lastOrderSnapshot = value ? (JSON.parse(value) as Order) : null;
  } catch {
    lastOrderSnapshot = null;
  }
  return lastOrderSnapshot;
}
