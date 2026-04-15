import { Link } from "wouter";
import { motion } from "framer-motion";

import type { Product } from "@/domain/types";

type CollectionsNewArrivalsSectionProps = {
  products: Product[];
};

export function CollectionsNewArrivalsSection({ products }: CollectionsNewArrivalsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-32 bg-foreground text-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div>
            <span className="uppercase text-xs tracking-widest text-primary mb-3 block">Nouveautés</span>
            <h2 className="text-4xl md:text-5xl font-serif">Dernières Arrivées</h2>
          </div>
          <Link
            href="/collections/maroquinerie"
            className="uppercase text-xs tracking-widest border-b border-primary text-primary hover:text-background hover:border-background transition-colors pb-1"
          >
            Voir toutes les nouveautés
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/produit/${product.id}`} className="block">
                <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-background/5">
                  {product.tag && (
                    <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-medium">
                      {product.tag}
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                  />
                </div>
                <h3 className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-background/70">{product.price} €</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
