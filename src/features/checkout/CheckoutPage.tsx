import { useEffect, useMemo, useState } from "react";
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
  const { authService, checkoutService, customerOrdersService } = getServices();

  const cartLines = useMemo(() => checkoutService.getCartProducts(), [checkoutService]);
  const itemCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cartLines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );
  const shippingFee = itemCount > 0 ? 35 : 0;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [providers, setProviders] = useState<Array<{ provider_name: string; provider_short_name: string; provider_type: string }>>([]);

  if (!isAuthenticated || !session) {
    setLocation("/connexion?redirect=/paiement");
    return null;
  }

  if (cartLines.length === 0) {
    setLocation("/panier");
    return null;
  }

  useEffect(() => {
    let cancelled = false;
    const loadProviders = async () => {
      const accessToken = authService.getAccessToken();
      if (!accessToken) return;
      try {
        const items = await customerOrdersService.listPaymentProviders(accessToken, {
          page: 1,
          limit: 20,
          country: "SN",
        });
        if (!cancelled) setProviders(items);
      } catch {
        if (!cancelled) setProviders([]);
      }
    };
    void loadProviders();
    return () => {
      cancelled = true;
    };
  }, [authService, customerOrdersService]);

  const submitOrder = async (payload: CheckoutDetails, paymentOperator?: string) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const accessToken = authService.getAccessToken();
      if (!accessToken) {
        throw new Error("Session invalide. Veuillez vous reconnecter.");
      }
      const checkoutSession = await customerOrdersService.createCheckoutSession(accessToken, payload);
      if ((payload.paymentMethod === "mobile_money" || payload.paymentMethod === "card") && paymentOperator) {
        const attempt = await customerOrdersService.createTransactionAttempt(
          accessToken,
          checkoutSession.reference,
          {
            payment_method: payload.paymentMethod === "mobile_money" ? "mobile_money" : "card",
            operator: paymentOperator,
            customer: {
              name: payload.fullName,
              phone: payload.phone,
              email: session.email,
            },
            countryISO: payload.country.slice(0, 2).toUpperCase() || "SN",
          },
        );
        if (attempt.cashout_url) {
          window.location.assign(attempt.cashout_url);
          return;
        }
      }
      if (checkoutSession.paymentUrl) {
        window.location.assign(checkoutSession.paymentUrl);
        return;
      }
      setLocation(`/suivi-commande/${checkoutSession.reference}`);
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
              paymentProviders={providers}
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
