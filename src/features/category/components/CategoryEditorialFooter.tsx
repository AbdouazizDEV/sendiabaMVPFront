import { Link } from "wouter";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

type CategoryEditorialFooterProps = {
  collectionTitle: string;
};

export function CategoryEditorialFooter({ collectionTitle }: CategoryEditorialFooterProps) {
  return (
    <section className="bg-primary text-primary-foreground py-24">
      <div className="container mx-auto px-6 md:px-12 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-serif mb-6">L&apos;Âme de la Collection</h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed mb-10">
            Derrière chaque objet de notre collection {collectionTitle.toLowerCase()} se cachent des heures de travail
            méticuleux. Nos artisans préservent des techniques séculaires, garantissant que chaque création est non
            seulement belle, mais chargée d&apos;histoire et de sens.
          </p>
          <Link href="/artisans">
            <Button className="bg-primary-foreground text-primary hover:bg-background rounded-none uppercase text-xs tracking-widest font-semibold px-8 py-6">
              Rencontrer les artisans
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
