import { Link } from "wouter";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from "@/domain/types";

type ProfileFavoriteProductsSectionProps = {
  allProducts: readonly Product[];
  favoriteProducts: Product[];
  onAddFavoriteProduct: (productId: string) => void;
  onRemoveFavoriteProduct: (productId: string) => void;
};

export function ProfileFavoriteProductsSection({
  allProducts,
  favoriteProducts,
  onAddFavoriteProduct,
  onRemoveFavoriteProduct,
}: ProfileFavoriteProductsSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.16 }}
      className="space-y-5 border border-border p-6"
    >
      <h2 className="font-serif text-3xl">Mes produits favoris</h2>

      <Select onValueChange={onAddFavoriteProduct}>
        <SelectTrigger className="h-11 rounded-none">
          <SelectValue placeholder="Ajouter un produit aux favoris" />
        </SelectTrigger>
        <SelectContent>
          {allProducts.map((product) => (
            <SelectItem key={product.id} value={product.id}>
              {product.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {favoriteProducts.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun produit favori pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {favoriteProducts.map((product) => (
            <article key={product.id} className="grid grid-cols-[72px_1fr_auto] items-center gap-3 border border-border p-3">
              <img src={product.image} alt={product.name} className="h-16 w-16 object-cover" />
              <div>
                <p className="font-serif text-xl">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.price.toLocaleString("fr-FR")} EUR</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/produit/${product.id}`}>
                  <Button variant="outline" className="h-9 rounded-none text-xs uppercase tracking-[0.15em]">
                    Voir
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemoveFavoriteProduct(product.id)}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </motion.section>
  );
}
