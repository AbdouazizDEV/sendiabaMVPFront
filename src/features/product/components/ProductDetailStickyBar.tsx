import { AnimatePresence, motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";

import type { Product } from "@/domain/types";
import { CATEGORY_LABELS } from "@/content/collection-categories";

type ProductDetailStickyBarProps = {
  visible: boolean;
  product: Product;
  isAdded: boolean;
  onAddToCart: () => void;
};

export function ProductDetailStickyBar({
  visible,
  product,
  isAdded,
  onAddToCart,
}: ProductDetailStickyBarProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border"
        >
          <div className="container mx-auto px-6 md:px-12 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-muted overflow-hidden shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif text-sm text-foreground leading-tight">{product.name}</h3>
                <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[product.category]}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="font-serif text-lg hidden sm:block">{product.price.toLocaleString("fr-FR")} €</span>
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={onAddToCart}
                className="bg-foreground text-background hover:bg-primary px-6 py-2.5 uppercase text-[10px] tracking-widest font-semibold transition-colors flex items-center gap-2"
              >
                {isAdded ? (
                  <>
                    <Check size={12} /> Ajouté
                  </>
                ) : (
                  <>
                    <ShoppingBag size={12} /> Ajouter
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
