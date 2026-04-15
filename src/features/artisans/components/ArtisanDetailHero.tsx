import { motion } from "framer-motion";

import type { Artisan } from "@/domain/types";

type ArtisanDetailHeroProps = {
  artisan: Artisan;
};

export function ArtisanDetailHero({ artisan }: ArtisanDetailHeroProps) {
  return (
    <section className="relative h-[60vh] min-h-[500px] md:h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover object-center grayscale" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="uppercase tracking-widest text-sm text-primary mb-4 block font-medium">{artisan.speciality}</span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-4">{artisan.name}</h1>
          <p className="text-xl text-white/80 font-serif italic">{artisan.location}</p>
        </motion.div>
      </div>
    </section>
  );
}
