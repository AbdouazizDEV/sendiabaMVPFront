import { useEffect } from "react";
import { Link, useLocation } from "wouter";

import { getServices } from "@/app/di/services";
import { useAuth, useCart } from "@/app/state";
import type { Product } from "@/domain/types";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { CollectionsNewArrivalsSection } from "@/features/collections/components/CollectionsNewArrivalsSection";
import { getManagedText } from "@/content/managed-content";

import { CartEmptyState } from "./components/CartEmptyState";
import { CartItemRow } from "./components/CartItemRow";
import { CartSummaryCard } from "./components/CartSummaryCard";

type CartLine = {
  product: Product;
  quantity: number;
};

export default function CartPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { items, itemCount, removeFromCart, setQuantity } = useCart();
  const { productService, catalogService } = getServices();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/connexion?redirect=/panier");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  const lines: CartLine[] = items.reduce<CartLine[]>((acc, item) => {
    const product = productService.getById(item.productId);
    if (product) {
      acc.push({ product, quantity: item.quantity });
    }
    return acc;
  }, []);

  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );
  const newArrivals = catalogService.sampleNewArrivals(4);
  const pageTitle = getManagedText("cart.page.title", "Vos pieces selectionnees");
  const continueLabel = getManagedText("cart.page.link", "Continuer les achats");

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-6 pb-16 pt-32 md:px-12">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Panier</p>
            <h1 className="mt-4 font-serif text-5xl">{pageTitle}</h1>
          </div>
          <Link href="/collections" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
            {continueLabel}
          </Link>
        </div>

        {lines.length === 0 ? (
          <CartEmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {lines.map((line) => (
                <CartItemRow
                  key={line.product.id}
                  product={line.product}
                  quantity={line.quantity}
                  onIncrease={() => setQuantity(line.product.id, line.quantity + 1)}
                  onDecrease={() => setQuantity(line.product.id, line.quantity - 1)}
                  onRemove={() => removeFromCart(line.product.id)}
                />
              ))}
            </div>

            <CartSummaryCard itemCount={itemCount} subtotal={subtotal} shipping={subtotal > 0 ? 35 : 0} />
          </div>
        )}
      </section>
      <CollectionsNewArrivalsSection products={newArrivals} />
      <Footer />
    </main>
  );
}
