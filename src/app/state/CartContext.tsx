import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getServices } from "@/app/di/services";
import type { CartItem } from "@/domain/types";
import { useAuth } from "./AuthContext";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { authService, cartService, customerCartService } = getServices();
  const [items, setItems] = useState<CartItem[]>(() => cartService.getItems());

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    let cancelled = false;
    const load = async () => {
      const token = authService.getAccessToken();
      if (!token) return;
      try {
        const cart = await customerCartService.getCart(token);
        if (cancelled) return;
        setItems(cart.items.map((line) => ({ productId: line.productId, quantity: line.quantity })));
      } catch {
        // keep local fallback
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, authService, customerCartService]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: cartService.count(items),
      addToCart: (productId, quantity = 1) => {
        const token = authService.getAccessToken();
        if (token) {
          void customerCartService
            .addItem(token, productId, quantity)
            .then(() => customerCartService.getCart(token))
            .then((cart) =>
              setItems(cart.items.map((line) => ({ productId: line.productId, quantity: line.quantity }))),
            )
            .catch(() => {
              // fallback local update on API failure
            });
        }
        setItems(cartService.add(productId, quantity));
      },
      removeFromCart: (productId) => {
        const token = authService.getAccessToken();
        if (token) {
          void customerCartService
            .removeItem(token, productId)
            .then(() => customerCartService.getCart(token))
            .then((cart) =>
              setItems(cart.items.map((line) => ({ productId: line.productId, quantity: line.quantity }))),
            )
            .catch(() => {
              // fallback local update on API failure
            });
        }
        setItems(cartService.remove(productId));
      },
      setQuantity: (productId, quantity) => {
        const token = authService.getAccessToken();
        if (token) {
          void customerCartService
            .updateItem(token, productId, Math.max(1, quantity))
            .then(() => customerCartService.getCart(token))
            .then((cart) =>
              setItems(cart.items.map((line) => ({ productId: line.productId, quantity: line.quantity }))),
            )
            .catch(() => {
              // fallback local update on API failure
            });
        }
        if (quantity <= 0) {
          setItems(cartService.remove(productId));
          return;
        }
        setItems(cartService.setQuantity(productId, quantity));
      },
      clearCart: () => {
        setItems(cartService.clear());
      },
    }),
    [authService, cartService, customerCartService, items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
