import { motion } from "framer-motion";
import { getManagedText } from "@/content/managed-content";

export function ArtisansListingHero() {
  const badge = getManagedText("artisans.hero.badge", "Nos Maitres Artisans");
  const title = getManagedText("artisans.hero.title", "Les Mains de l'Excellence");
  const subtitle = getManagedText(
    "artisans.hero.subtitle",
    "Le vrai luxe n'est pas silencieux. Il parle des mains qui l'ont forge, du temps qu'il a fallu pour l'apprivoiser, et des generations qui ont transmis le geste.",
  );
  return (
    <section className="pt-40 pb-20 px-6 md:px-12 bg-foreground text-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="uppercase tracking-widest text-xs font-medium text-primary mb-6 block">{badge}</span>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">{title}</h1>
          <p className="text-background/70 text-xl leading-relaxed">{subtitle}</p>
        </motion.div>
      </div>
    </section>
  );
}
