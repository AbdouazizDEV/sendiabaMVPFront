import { motion } from "framer-motion";

import type { Product } from "@/domain/types";

type CheckoutOrderPreviewProps = {
  lines: Array<{ product: Product; quantity: number }>;
};

export function CheckoutOrderPreview({ lines }: CheckoutOrderPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-4 border border-border p-6"
    >
      <h2 className="font-serif text-3xl">Votre selection</h2>
      <div className="space-y-3">
        {lines.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center gap-3 border border-border/70 p-3">
            <img src={product.image} alt={product.name} className="h-16 w-16 object-cover" />
            <div className="flex-1">
              <p className="font-serif text-lg">{product.name}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Quantite: {quantity}</p>
            </div>
            <p className="font-medium">{(product.price * quantity).toLocaleString("fr-FR")} EUR</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
