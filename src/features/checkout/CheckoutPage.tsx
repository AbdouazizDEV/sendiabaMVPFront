import { useMemo, useState } from "react";
import { useLocation } from "wouter";

import { getServices } from "@/app/di/services";
import { useAuth } from "@/app/state";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import type { CheckoutDetails } from "@/domain/types";

import { CheckoutForm } from "./components/CheckoutForm";
import { CheckoutHero } from "./components/CheckoutHero";
import { CheckoutOrderPreview } from "./components/CheckoutOrderPreview";
import { CheckoutTotalsCard } from "./components/CheckoutTotalsCard";

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { session, isAuthenticated } = useAuth();
  const { checkoutService } = getServices();

  const cartLines = useMemo(() => checkoutService.getCartProducts(), [checkoutService]);
  const itemCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cartLines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );
  const shippingFee = itemCount > 0 ? 35 : 0;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthenticated || !session) {
    setLocation("/connexion?redirect=/paiement");
    return null;
  }

  if (cartLines.length === 0) {
    setLocation("/panier");
    return null;
  }

  const submitOrder = (payload: CheckoutDetails) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const order = checkoutService.placeOrder(session, payload);
      setLocation(`/suivi-commande/${order.id}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Impossible de finaliser la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-6 pb-20 pt-32 md:px-12">
        <CheckoutHero />

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <CheckoutOrderPreview lines={cartLines} />
            <CheckoutForm
              initialName={session.displayName}
              onSubmit={submitOrder}
              isSubmitting={isSubmitting}
            />
            {errorMessage && (
              <p className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {errorMessage}
              </p>
            )}
          </div>

          <CheckoutTotalsCard itemCount={itemCount} subtotal={subtotal} shippingFee={shippingFee} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
