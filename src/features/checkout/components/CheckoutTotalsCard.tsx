import { motion } from "framer-motion";

import { Separator } from "@/components/ui/separator";

type CheckoutTotalsCardProps = {
  itemCount: number;
  subtotal: number;
  shippingFee: number;
};

export function CheckoutTotalsCard({ itemCount, subtotal, shippingFee }: CheckoutTotalsCardProps) {
  const total = subtotal + shippingFee;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4 border border-border bg-muted/20 p-6"
    >
      <h3 className="font-serif text-2xl">Resume de paiement</h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Articles ({itemCount})</span>
          <span>{subtotal.toLocaleString("fr-FR")} EUR</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Livraison</span>
          <span>{shippingFee.toLocaleString("fr-FR")} EUR</span>
        </div>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <span className="font-serif text-xl">Total</span>
        <span className="font-serif text-3xl">{total.toLocaleString("fr-FR")} EUR</span>
      </div>
    </motion.aside>
  );
}
