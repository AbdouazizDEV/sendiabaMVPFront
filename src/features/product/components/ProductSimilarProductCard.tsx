import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, Heart } from "lucide-react";

import type { Product } from "@/domain/types";

type ProductSimilarProductCardProps = {
  product: Product;
  index: number;
  artisanName?: string;
};

export function ProductSimilarProductCard({ product, index, artisanName }: ProductSimilarProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <div className="relative aspect-[3/4] mb-4 bg-muted overflow-hidden">
        {product.tag && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-background text-foreground text-[9px] uppercase tracking-widest font-medium">
            {product.tag}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setWishlisted(!wishlisted);
          }}
          className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart size={13} className={wishlisted ? "fill-primary text-primary" : "text-foreground"} />
        </button>

        <Link href={`/produit/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out cursor-pointer"
          />
        </Link>

        <Link href={`/produit/${product.id}`}>
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-foreground/95 backdrop-blur-sm px-5 py-4 flex items-center justify-between cursor-pointer">
            <span className="text-[10px] uppercase tracking-widest text-background font-medium">Voir la fiche</span>
            <ChevronRight size={13} className="text-background" />
          </div>
        </Link>
      </div>

      <Link href={`/produit/${product.id}`}>
        <h3 className="font-serif text-base mb-1 group-hover:text-primary transition-colors cursor-pointer leading-tight">{product.name}</h3>
      </Link>
      {artisanName && <p className="text-[11px] text-muted-foreground mb-2 uppercase tracking-wider">{artisanName}</p>}
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm">{product.price.toLocaleString("fr-FR")} €</p>
        {product.inStock && <span className="text-[9px] uppercase tracking-widest text-green-700 font-medium">En stock</span>}
      </div>
    </motion.div>
  );
}
