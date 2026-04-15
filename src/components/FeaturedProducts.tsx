import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { getServices } from "@/app/di/services";
import { getManagedText } from "@/content/managed-content";

const featuredIds = ["p7", "p12"];

function getFeaturedProducts() {
  const { productService, artisanService } = getServices();
  return featuredIds
    .map((id) => productService.getById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((product) => ({
      product,
      artisan: artisanService.getById(product.artisanId),
    }));
}

export function FeaturedProducts() {
  const featured = getFeaturedProducts();
  const title = getManagedText("home.featured.title", "Selection Singuliere");
  const subtitle = getManagedText(
    "home.featured.subtitle",
    "Des pieces choisies pour leur aura et leur perfection technique.",
  );

  return (
    <section id="featured" className="py-24 md:py-32 bg-muted/20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">{title}</h2>
            <p className="text-muted-foreground text-lg">{subtitle}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/collections">
              <motion.span
                className="inline-flex items-center gap-2 uppercase text-sm tracking-widest text-foreground hover:text-primary transition-colors border-b border-foreground hover:border-primary pb-1 cursor-pointer"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                Voir toute la galerie
                <ArrowRight size={13} />
              </motion.span>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {featured.map(({ product, artisan }, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group"
              >
                <Link href={`/produit/${product.id}`}>
                  <div className="block cursor-pointer">
                    <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-muted">
                      {product.tag && (
                        <div className="absolute top-6 left-6 z-10 bg-background/90 backdrop-blur-sm text-foreground px-4 py-1 text-xs uppercase tracking-widest">
                          {product.tag}
                        </div>
                      )}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full h-full"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </motion.div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-serif text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                          {product.name}
                        </h3>
                        {artisan && (
                          <p className="text-muted-foreground text-sm flex items-center gap-2">
                            <span className="w-4 h-[1px] bg-primary inline-block" />
                            Façonné par <span className="text-foreground font-medium">{artisan.name}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-xl font-serif text-foreground">
                        {product.price.toLocaleString("fr-FR")} €
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
