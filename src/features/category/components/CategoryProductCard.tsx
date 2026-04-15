import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Heart, ChevronRight } from "lucide-react";

import type { Product } from "@/domain/types";

type CategoryProductCardProps = {
  product: Product;
  index: number;
  artisanName?: string;
};

export function CategoryProductCard({
  product,
  index,
  artisanName,
}: CategoryProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const isLastPiece = product.inStock && index % 3 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 10) * 0.05 }}
      className="group flex flex-col"
    >
      <div className="relative aspect-[3/4] mb-5 bg-muted overflow-hidden">
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.tag && (
            <span className="px-3 py-1 bg-background text-foreground text-[10px] uppercase tracking-widest font-medium shadow-sm">
              {product.tag}
            </span>
          )}
          {isLastPiece && (
            <span className="px-3 py-1 bg-accent text-accent-foreground text-[10px] uppercase tracking-widest font-medium shadow-sm">
              Dernière pièce
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setWishlisted(!wishlisted);
          }}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart size={15} className={wishlisted ? "fill-primary text-primary" : "text-foreground"} />
        </button>

        <Link href={`/produit/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        <Link href={`/produit/${product.id}`}>
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-foreground/95 backdrop-blur-sm px-5 py-4 flex items-center justify-between cursor-pointer">
            <span className="text-xs uppercase tracking-widest text-background font-medium">Voir la fiche</span>
            <ChevronRight size={14} className="text-background" />
          </div>
        </Link>
      </div>

      <div className="flex-1 flex flex-col">
        <Link href={`/produit/${product.id}`} className="block">
          <h3 className="font-serif text-xl mb-1 text-foreground group-hover:text-primary transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>
        <div className="flex justify-between items-center mt-2">
          <span className="font-medium text-lg">{product.price} €</span>
        </div>
        <div className="h-5 mt-1 overflow-hidden">
          {artisanName && (
            <p className="text-sm text-muted-foreground transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              Par {artisanName}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
