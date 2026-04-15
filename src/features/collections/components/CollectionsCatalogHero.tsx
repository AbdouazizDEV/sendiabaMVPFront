import { motion } from "framer-motion";
import { getManagedText } from "@/content/managed-content";

export function CollectionsCatalogHero() {
  const badge = getManagedText("collections.hero.badge", "Le Catalogue Sendiaba");
  const title = getManagedText("collections.hero.title", "Nos Collections");
  const quote = getManagedText(
    "collections.hero.quote",
    "Le veritable luxe est celui qui porte en lui l'empreinte d'une culture, la noblesse d'une matiere et la passion d'un createur.",
  );
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center bg-primary text-primary-foreground pt-20 px-6 text-center overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 max-w-4xl mx-auto space-y-8"
      >
        <span className="uppercase tracking-widest text-xs font-semibold block mb-8">{badge}</span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-tight">{title}</h1>
        <p className="text-xl md:text-2xl font-serif italic text-primary-foreground/90 max-w-2xl mx-auto">
          &ldquo;{quote}&rdquo;
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest font-medium">Découvrir</span>
        <div className="w-px h-12 bg-primary-foreground/30 relative overflow-hidden">
          <motion.div
            className="w-full h-full bg-primary-foreground absolute top-0"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
