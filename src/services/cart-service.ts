import type { CartItem } from "@/domain/types";

const CART_KEY = "sendiaba.cart.items";

function inBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeRead<T>(key: string, fallback: T): T {
  if (!inBrowser()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  if (!inBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export class CartService {
  getItems(): CartItem[] {
    return safeRead<CartItem[]>(CART_KEY, []);
  }

  clear(): CartItem[] {
    safeWrite(CART_KEY, []);
    return [];
  }

  count(items: CartItem[] = this.getItems()): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  add(productId: string, quantity = 1): CartItem[] {
    const current = this.getItems();
    const existing = current.find((item) => item.productId === productId);

    if (existing) {
      existing.quantity += quantity;
      safeWrite(CART_KEY, current);
      return [...current];
    }

    const next = [...current, { productId, quantity }];
    safeWrite(CART_KEY, next);
    return next;
  }

  setQuantity(productId: string, quantity: number): CartItem[] {
    const current = this.getItems();
    const next = current
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      )
      .filter((item) => item.quantity > 0);

    safeWrite(CART_KEY, next);
    return next;
  }

  remove(productId: string): CartItem[] {
    const next = this.getItems().filter((item) => item.productId !== productId);
    safeWrite(CART_KEY, next);
    return next;
  }
}
