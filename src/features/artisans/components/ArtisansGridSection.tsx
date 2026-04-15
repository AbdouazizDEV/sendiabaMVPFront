import { Link } from "wouter";
import { motion } from "framer-motion";

import type { Artisan } from "@/domain/types";

type ArtisansGridSectionProps = {
  artisans: readonly Artisan[];
};

export function ArtisansGridSection({ artisans }: ArtisansGridSectionProps) {
  return (
    <section className="py-24 container mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
        {artisans.map((artisan, idx) => (
          <motion.div
            key={artisan.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
            className="group flex flex-col"
          >
            <Link href={`/artisans/${artisan.id}`} className="block">
              <div className="relative aspect-[4/5] mb-8 overflow-hidden bg-muted">
                <img
                  src={artisan.image}
                  alt={artisan.name}
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply" />

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-sm font-medium uppercase tracking-widest">Voir le profil</p>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-3xl font-serif text-foreground mb-2">{artisan.name}</h3>
                <p className="text-primary font-medium mb-3">{artisan.title}</p>
                <p className="text-muted-foreground text-sm mb-4">{artisan.location}</p>
                <div className="w-8 h-[1px] bg-border mx-auto mb-4" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{artisan.productsCount} créations</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
