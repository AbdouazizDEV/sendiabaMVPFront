import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, Package, RotateCcw, ShieldCheck, ShoppingBag, Star } from "lucide-react";

import type { Artisan, Product } from "@/domain/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ProductDetailPurchaseColumnProps = {
  product: Product;
  artisan: Artisan | undefined;
  certId: string;
  isAdded: boolean;
  isAuthenticated: boolean;
  onAddToCart: () => void;
};

const deliveryBullets = [
  "Livraison mondiale sous 7 a 14 jours ouvres via transporteur premium avec suivi.",
  "Retours acceptes sous 30 jours dans l'emballage d'origine, en parfait etat.",
  "Chaque commande est emballee dans notre ecrin artisanal signature, pret a offrir.",
];

export function ProductDetailPurchaseColumn({
  product,
  artisan,
  certId,
  isAdded,
  isAuthenticated,
  onAddToCart,
}: ProductDetailPurchaseColumnProps) {
  return (
    <div className="lg:col-span-5 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-5 leading-tight">{product.name}</h1>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                className={i < 5 ? (i < 4 ? "fill-primary text-primary" : "fill-primary/40 text-primary/40") : "text-muted"}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground underline decoration-muted-foreground/30 underline-offset-4 cursor-pointer hover:text-foreground transition-colors">
            4.9 / 5 &mdash; 23 avis clients
          </span>
        </div>

        {artisan && (
          <Link href={`/artisans/${artisan.id}`}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-6 cursor-pointer">
              Par <span className="font-semibold text-foreground">{artisan.name}</span> &mdash; {artisan.location}
            </p>
          </Link>
        )}
      </motion.div>

      <div className="w-full h-px bg-border mb-7" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mb-8"
      >
        <p className="text-4xl font-serif mb-1.5">{product.price.toLocaleString("fr-FR")} EUR</p>
        <p className="text-xs text-muted-foreground">Taxes incluses &mdash; livraison calculee a l'etape suivante</p>
      </motion.div>

      <div className="mb-6">
        <label className="text-[10px] font-semibold uppercase tracking-widest block mb-3 text-foreground">
          {product.category === "maroquinerie" ? "Taille / Format" : "Quantite"}
        </label>
        {product.category === "maroquinerie" ? (
          <Select defaultValue="standard">
            <SelectTrigger className="w-full rounded-none border-foreground/40 focus:ring-primary h-12 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Taille Standard</SelectItem>
              <SelectItem value="large">Grand Format (+45 EUR)</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Select defaultValue="1">
            <SelectTrigger className="w-full rounded-none border-foreground/40 focus:ring-primary h-12 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["1", "2", "3", "4"].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <p className="text-muted-foreground text-base leading-relaxed mb-8">{product.description}</p>

      <div className="flex flex-col gap-3 mb-10">
        <motion.div whileTap={{ scale: 0.985 }}>
          <Button
            size="lg"
            onClick={onAddToCart}
            className="w-full bg-foreground text-background hover:bg-primary uppercase tracking-widest text-xs font-semibold h-14 rounded-none transition-all duration-300"
          >
            {isAdded ? (
              <span className="flex items-center gap-2">
                <Check size={15} /> Ajoute au panier
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingBag size={15} /> {isAuthenticated ? "Ajouter au Panier" : "Connexion pour ajouter"}
              </span>
            )}
          </Button>
        </motion.div>
        <Button
          variant="outline"
          size="lg"
          className="w-full border-foreground/40 text-foreground hover:bg-muted uppercase tracking-widest text-xs font-semibold h-12 rounded-none"
        >
          Exprimer votre interet
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-10 py-6 border-t border-b border-border">
        {[
          { icon: Package, label: "Livraison", sub: "7-14 jours ouvres" },
          { icon: RotateCcw, label: "Retours", sub: "Sous 30 jours" },
          { icon: ShieldCheck, label: "Certifie", sub: "100% fait main" },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center text-center gap-1.5">
            <Icon size={18} className="text-primary" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-widest font-semibold text-foreground">{label}</span>
            <span className="text-[10px] text-muted-foreground">{sub}</span>
          </div>
        ))}
      </div>

      <Accordion type="multiple" className="w-full border-t border-border">
        <AccordionItem value="details" className="border-border">
          <AccordionTrigger className="text-[11px] uppercase tracking-widest hover:text-primary transition-colors py-5 font-semibold">
            Details & Matieres
          </AccordionTrigger>
          <AccordionContent className="pb-5">
            <ul className="space-y-2.5">
              {product.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-3 text-muted-foreground text-sm leading-relaxed">
                  <span className="mt-2 w-1 h-1 rounded-full bg-primary shrink-0 block" />
                  {detail}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="delivery" className="border-border">
          <AccordionTrigger className="text-[11px] uppercase tracking-widest hover:text-primary transition-colors py-5 font-semibold">
            Livraison & Retours
          </AccordionTrigger>
          <AccordionContent className="pb-5">
            <ul className="space-y-3">
              {deliveryBullets.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm leading-relaxed">
                  <span className="mt-2 w-1 h-1 rounded-full bg-primary shrink-0 block" />
                  {item}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="authenticity" className="border-border">
          <AccordionTrigger className="text-[11px] uppercase tracking-widest hover:text-primary transition-colors py-5 font-semibold">
            Authenticite & Tracabilite
          </AccordionTrigger>
          <AccordionContent className="pb-5">
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground text-sm leading-relaxed">
                <span className="mt-2 w-1 h-1 rounded-full bg-primary shrink-0 block" />
                Numero de certification unique : <span className="font-mono text-foreground ml-1">{certId}</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm leading-relaxed">
                <span className="mt-2 w-1 h-1 rounded-full bg-primary shrink-0 block" />
                Certifie 100% fait main par {artisan?.name} &mdash; {artisan?.location}.
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm leading-relaxed">
                <span className="mt-2 w-1 h-1 rounded-full bg-primary shrink-0 block" />
                Matieres premieres sourcees ethiquement en Afrique de l'Ouest, sans intermediaire.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
