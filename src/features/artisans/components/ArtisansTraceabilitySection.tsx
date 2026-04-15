import { motion } from "framer-motion";

export function ArtisansTraceabilitySection() {
  return (
    <section className="py-32 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-8">Notre Engagement de Traçabilité</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Chez Sendiaba, nous croyons que l&apos;anonymat est l&apos;ennemi de l&apos;artisanat. Chaque pièce proposée sur
            notre plateforme est signée par son créateur. Nous nous engageons à une transparence totale sur l&apos;origine des
            matériaux, le temps de conception et la rémunération équitable de chaque artisan partenaire.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm uppercase tracking-widest text-foreground font-medium">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Circuit Court
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Prix Juste
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Reconnaissance
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
