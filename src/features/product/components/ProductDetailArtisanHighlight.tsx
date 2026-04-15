import { Link } from "wouter";
import { motion } from "framer-motion";

import type { Artisan } from "@/domain/types";
import { Button } from "@/components/ui/button";

type ProductDetailArtisanHighlightProps = {
  artisan: Artisan;
};

export function ProductDetailArtisanHighlight({ artisan }: ProductDetailArtisanHighlightProps) {
  return (
    <section className="bg-foreground text-background py-20 mt-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 order-2 lg:order-1"
          >
            <div>
              <span className="text-primary text-[10px] uppercase tracking-widest font-medium block mb-3">
                Rencontrez l&apos;Artisan
              </span>
              <h2 className="text-4xl md:text-5xl font-serif mb-2 leading-tight">{artisan.name}</h2>
              <p className="text-background/60 text-sm uppercase tracking-widest">
                {artisan.title} &mdash; {artisan.location}
              </p>
            </div>

            <blockquote className="text-2xl font-serif italic text-background/85 border-l-2 border-primary pl-6 leading-snug">
              &ldquo;{artisan.quote}&rdquo;
            </blockquote>

            <p className="text-background/65 leading-relaxed max-w-lg">{artisan.bio}</p>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-background/15">
              <div>
                <p className="text-3xl font-serif text-primary">
                  {artisan.yearsExperience}
                  <span className="text-lg">ans</span>
                </p>
                <p className="text-[10px] uppercase tracking-widest text-background/50 mt-1">Expérience</p>
              </div>
              <div>
                <p className="text-3xl font-serif text-primary">{artisan.productsCount}</p>
                <p className="text-[10px] uppercase tracking-widest text-background/50 mt-1">Créations</p>
              </div>
              <div>
                <p className="text-sm font-medium text-background leading-tight">{artisan.speciality}</p>
                <p className="text-[10px] uppercase tracking-widest text-background/50 mt-1">Spécialité</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-background/40 mb-1">Héritage</p>
              <p className="text-background/70 text-sm">{artisan.heritage}</p>
            </div>

            <Link href={`/artisans/${artisan.id}`}>
              <Button className="border border-background/30 bg-transparent text-background hover:bg-primary hover:border-primary rounded-none uppercase text-[10px] tracking-widest px-8 py-6 mt-2">
                Visiter l&apos;atelier
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="order-1 lg:order-2"
          >
            <div className="aspect-[4/5] relative overflow-hidden">
              <img
                src={artisan.image}
                alt={artisan.name}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-foreground/60 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
