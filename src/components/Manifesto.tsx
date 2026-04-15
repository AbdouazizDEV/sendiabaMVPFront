import { motion } from "framer-motion";
import { getManagedText } from "@/content/managed-content";

export function Manifesto() {
  const title = getManagedText(
    "home.manifesto.title",
    "Nous ne sommes pas une marketplace. Nous sommes un pont culturel entre les maitres artisans d'Afrique et le monde.",
  );
  return (
    <section id="manifesto" className="py-32 md:py-48 bg-background relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-muted/30 -skew-x-12 transform origin-top-left pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-serif italic text-xl md:text-2xl mb-6 block">Notre Promesse</span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-foreground leading-tight mb-12">{title}</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-8 md:gap-16 text-left items-start justify-center"
          >
            <div className="flex-1">
              <p className="text-muted-foreground leading-relaxed text-lg">
                Chaque objet vendu ici porte une histoire humaine traçable. Pas d'usines. Pas de production de masse. Juste le silence d'un atelier à l'aube, la chaleur de la terre cuite brute et le poids du cuir cousu main.
              </p>
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground leading-relaxed text-lg">
                Nous célébrons le savoir-faire africain avec une exigence absolue. Parce que le luxe véritable n'est pas une question de logo, mais de lignée, de technique et de temps.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
