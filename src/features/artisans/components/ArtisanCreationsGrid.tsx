import { Link } from "wouter";
import { motion } from "framer-motion";

import type { Artisan, Product } from "@/domain/types";

type ArtisanCreationsGridProps = {
  artisan: Artisan;
  products: Product[];
};

export function ArtisanCreationsGrid({ artisan, products }: ArtisanCreationsGridProps) {
  return (
    <section className="py-24 container mx-auto px-6 md:px-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-serif text-foreground mb-4">Ses Créations</h2>
          <p className="text-muted-foreground text-lg">Découvrez les pièces façonnées par {artisan.name}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group"
          >
            <Link href={`/produit/${p.id}`} className="block">
              <div className="relative aspect-[3/4] mb-4 bg-muted overflow-hidden">
                {p.tag && (
                  <div className="absolute top-4 left-4 z-10 bg-background/90 px-3 py-1 text-[10px] uppercase tracking-widest">
                    {p.tag}
                  </div>
                )}
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <h3 className="font-serif text-lg mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.price} €</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
