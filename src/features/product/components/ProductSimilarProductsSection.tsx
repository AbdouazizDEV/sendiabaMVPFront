import { Link } from "wouter";

import type { Product } from "@/domain/types";

import { ProductSimilarProductCard } from "./ProductSimilarProductCard";

type ProductSimilarProductsSectionProps = {
  categoryId: Product["category"];
  products: Product[];
  artisanNames: Record<string, string | undefined>;
};

export function ProductSimilarProductsSection({
  categoryId,
  products,
  artisanNames,
}: ProductSimilarProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-serif">Vous aimerez aussi</h2>
          <Link
            href={`/collections/${categoryId}`}
            className="text-[10px] uppercase tracking-widest font-semibold border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors"
          >
            Voir tout
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p, idx) => (
            <ProductSimilarProductCard
              key={p.id}
              product={p}
              index={idx}
              artisanName={artisanNames[p.artisanId]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
