import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getServices } from "@/app/di/services";
import type { CartItem } from "@/domain/types";

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
  const cartService = getServices().cartService;
  const [items, setItems] = useState<CartItem[]>(() => cartService.getItems());

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: cartService.count(items),
      addToCart: (productId, quantity = 1) => {
        setItems(cartService.add(productId, quantity));
      },
      removeFromCart: (productId) => {
        setItems(cartService.remove(productId));
      },
      setQuantity: (productId, quantity) => {
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
    [cartService, items],
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
