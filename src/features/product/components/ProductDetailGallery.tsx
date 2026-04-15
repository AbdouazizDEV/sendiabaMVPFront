import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import type { Product } from "@/domain/types";

type ProductDetailGalleryProps = {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
};

export function ProductDetailGallery({
  product,
  isWishlisted,
  onToggleWishlist,
}: ProductDetailGalleryProps) {
  return (
    <div className="lg:col-span-7 flex flex-col gap-4">
      <div className="relative aspect-[4/5] bg-muted overflow-hidden group">
        {product.tag && (
          <span className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-background text-foreground text-[10px] uppercase tracking-widest font-medium shadow-sm">
            {product.tag}
          </span>
        )}
        <button
          type="button"
          onClick={onToggleWishlist}
          aria-label="Ajouter aux favoris"
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/85 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
        >
          <Heart size={16} className={isWishlisted ? "fill-primary text-primary" : "text-foreground"} />
        </button>

        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
        />
      </div>
    </div>
  );
}
