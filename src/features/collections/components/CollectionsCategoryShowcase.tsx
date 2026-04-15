import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getServices } from "@/app/di/services";
import { COLLECTION_LANDING_CATEGORIES } from "@/content/collection-categories";

export function CollectionsCategoryShowcase() {
  const { catalogService } = getServices();

  return (
    <section className="bg-background">
      {COLLECTION_LANDING_CATEGORIES.map((category, index) => {
        const isEven = index % 2 === 0;
        const categoryCount = catalogService.countProductsInCategory(category.id);

        return (
          <div key={category.id} className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
            <div className={`relative bg-muted ${isEven ? "lg:order-1" : "lg:order-2"}`}>
              <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <img src={category.image} alt={category.title} className="w-full h-full object-cover" />
              </motion.div>
            </div>

            <div className={`flex flex-col justify-center px-8 py-20 lg:px-24 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-xl"
              >
                <span className="text-primary text-xs uppercase tracking-widest font-medium block mb-4">{category.subtitle}</span>
                <h2 className="text-4xl md:text-6xl font-serif text-foreground mb-8">{category.title}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-10">{category.description}</p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <Link href={`/collections/${category.id}`}>
                    <Button className="bg-foreground text-background hover:bg-primary rounded-none uppercase text-xs tracking-widest px-8 py-6">
                      Explorer la collection <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </Link>
                  <span className="text-sm font-serif italic text-muted-foreground">{categoryCount} pièces uniques</span>
                </div>
              </motion.div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
