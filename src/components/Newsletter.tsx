import { motion } from "framer-motion";
import { getManagedText } from "@/content/managed-content";

export function Newsletter() {
  const title = getManagedText("home.newsletter.title", "Rejoignez l'Atelier");
  const subtitle = getManagedText(
    "home.newsletter.subtitle",
    "Inscrivez-vous pour decouvrir en avant-premiere nos nouvelles creations, les histoires de nos artisans et nos editions limitees.",
  );
  return (
    <section className="py-24 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-6">{title}</h2>
            <p className="text-primary-foreground/80 text-lg mb-10">{subtitle}</p>

            <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="flex-1 bg-transparent border-b border-primary-foreground/30 px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground transition-colors rounded-none"
                required
              />
              <button 
                type="submit"
                className="bg-primary-foreground text-primary px-8 py-3 uppercase text-xs tracking-widest font-medium hover:bg-background transition-colors"
              >
                S'inscrire
              </button>
            </form>
            <p className="text-xs text-primary-foreground/50 mt-4">
              Nous respectons votre boîte de réception. Désinscription à tout moment.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
