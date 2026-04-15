import { motion } from "framer-motion";
import { getManagedText } from "@/content/managed-content";
import heroImg from "../assets/hero.png";

export function SavoirFaire() {
  const badge = getManagedText("home.savoirfaire.badge", "L'Art du Temps");
  const title = getManagedText("home.savoirfaire.title", "Le temps est notre matiere premiere.");
  return (
    <section className="py-24 md:py-32 bg-background border-t border-border/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full"
          >
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <div className="absolute inset-0 bg-primary/5 translate-x-4 translate-y-4 -z-10" />
              <img 
                src={heroImg} 
                alt="Le Savoir-Faire" 
                className="w-full h-full object-cover grayscale-[30%]"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 space-y-8"
          >
            <span className="uppercase tracking-widest text-sm text-primary font-medium">{badge}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
              {title}
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                Dans un monde obsédé par la vitesse, nous avons choisi la lenteur. Un sac Sendiaba n'est pas produit, il naît. Il faut des semaines pour tanner le cuir à la main, des jours pour tisser un mètre de Bogolan, des heures pour broder une finition.
              </p>
              <p>
                Ce temps n'est pas perdu, il est investi. C'est lui qui donne à nos objets leur patine, leur âme et leur durabilité. Chaque imperfection est une signature, chaque détail asymétrique est la preuve qu'une main humaine est passée par là.
              </p>
            </div>
            <button className="mt-8 uppercase text-xs tracking-widest text-foreground font-medium hover:text-primary transition-colors flex items-center gap-2 border-b border-foreground hover:border-primary pb-1">
              Explorer nos techniques
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
