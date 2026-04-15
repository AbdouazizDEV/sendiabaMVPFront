import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Heart } from "lucide-react";
import { getServices } from "@/app/di/services";
import type { Product, ProductCategory } from "@/domain/types";
import { getManagedText } from "@/content/managed-content";

const TABS = [
  { id: "maroquinerie", label: "Maroquinerie & Cuir", accent: "Porté" },
  { id: "maison",       label: "Maison & Textile",    accent: "Posé"  },
  { id: "decoration",   label: "Décoration & Art",    accent: "Vécu"  },
  { id: "coffrets",     label: "Coffrets & Cadeaux",  accent: "Offert"},
] as const;

type CategoryId = (typeof TABS)[number]["id"];

const TAG_STYLES: Record<string, string> = {
  "Best-Seller":    "bg-foreground text-background",
  "Nouveau":        "bg-primary text-primary-foreground",
  "Pièce Unique":   "bg-background text-foreground border border-border",
  "Édition Limitée":"bg-accent text-accent-foreground",
};

function ProductCard({ product, index }: { product: Product; index: number }) {
  const artisan = getServices().artisanService.getById(product.artisanId);
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group flex flex-col"
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-muted mb-5">
        {/* Tag */}
        {product.tag && (
          <span className={`absolute top-4 left-4 z-10 px-3 py-1 text-[10px] uppercase tracking-widest font-medium ${TAG_STYLES[product.tag] ?? "bg-muted text-foreground"}`}>
            {product.tag}
          </span>
        )}

        {/* Wishlist */}
        <button 
          onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart size={15} className={wishlisted ? "fill-primary text-primary" : "text-foreground"} />
        </button>

        {/* Image link */}
        <Link href={`/produit/${product.id}`} className="block w-full h-full">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center cursor-pointer"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </Link>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />
        
        {/* Quick view overlay premium */}
        <Link href={`/produit/${product.id}`}>
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-foreground/95 backdrop-blur-sm px-5 py-4 flex items-center justify-between cursor-pointer">
            <span className="text-xs uppercase tracking-widest text-background font-medium">Voir la fiche</span>
            <ArrowUpRight size={14} className="text-background" />
          </div>
        </Link>
      </div>

      {/* Info */}
      <div className="space-y-1.5 flex-1 flex flex-col">
        <Link href={`/produit/${product.id}`} className="block">
          <h3 className="font-serif text-lg text-foreground leading-snug group-hover:text-primary transition-colors duration-300 cursor-pointer">
            {product.name}
          </h3>
        </Link>
        {artisan && (
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="w-4 h-px bg-primary inline-block flex-shrink-0" />
            {artisan.name}
          </p>
        )}
        <div className="pt-2 flex items-center gap-3">
          <p className="text-base font-medium text-foreground">
            {product.price.toLocaleString("fr-FR")} €
          </p>
          {product.inStock && (
            <span className="text-[10px] uppercase tracking-widest text-green-700 font-medium bg-green-50 px-2 py-0.5">En stock</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function HomepageShop() {
  const [activeTab, setActiveTab] = useState<CategoryId>("maroquinerie");
  const badge = getManagedText("home.shop.badge", "La Boutique");
  const title = getManagedText("home.shop.title", "Chaque piece, une histoire.");

  const filtered = getServices()
    .productService.listByCategory(activeTab as ProductCategory)
    .slice(0, 4);

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <section className="py-24 md:py-32 bg-background border-t border-border/40">
      <div className="container mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14"
        >
          <div>
            <span className="uppercase text-xs tracking-widest text-primary mb-3 block">
              {badge}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground">
              {title}
            </h2>
          </div>
          <Link href="/collections">
            <motion.span
              className="inline-flex items-center gap-3 uppercase text-xs tracking-widest text-foreground border-b border-foreground hover:text-primary hover:border-primary transition-colors duration-300 pb-1 cursor-pointer"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              Voir toutes les collections
              <ArrowRight size={14} />
            </motion.span>
          </Link>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-border mb-12 overflow-x-auto custom-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-shrink-0 px-5 md:px-8 py-4 text-sm uppercase tracking-widest transition-colors duration-300 ${
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
               <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Category CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 pt-10 border-t border-border/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <p className="text-muted-foreground text-sm max-w-md">
            <span className="font-serif italic text-foreground text-base">"{currentTab.accent}"</span>
            {" "}— Découvrez l'intégralité de notre collection{" "}
            <span className="font-medium text-foreground">{currentTab.label.toLowerCase()}</span>, façonnée par nos maîtres artisans.
          </p>
          <Link href={`/collections/${activeTab}`}>
            <motion.button
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 text-xs uppercase tracking-widest hover:bg-primary transition-colors duration-300 flex-shrink-0"
            >
              Explorer {currentTab.label}
              <ArrowRight size={14} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
