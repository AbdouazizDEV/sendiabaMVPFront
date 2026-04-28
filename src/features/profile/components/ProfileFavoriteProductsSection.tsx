import { useState } from "react";
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
  onAddFavoriteProduct: (productId: string) => Promise<void>;
  onRemoveFavoriteProduct: (productId: string) => Promise<void>;
};

export function ProfileFavoriteProductsSection({
  allProducts,
  favoriteProducts,
  onAddFavoriteProduct,
  onRemoveFavoriteProduct,
}: ProfileFavoriteProductsSectionProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.16 }}
      className="space-y-5 border border-border p-6"
    >
      <h2 className="font-serif text-3xl">Mes produits favoris</h2>

      <Select
        onValueChange={async (productId) => {
          setErrorMessage(null);
          setIsUpdating(true);
          try {
            await onAddFavoriteProduct(productId);
          } catch (error) {
            setErrorMessage(
              error instanceof Error
                ? error.message
                : "Impossible d'ajouter ce produit aux favoris.",
            );
          } finally {
            setIsUpdating(false);
          }
        }}
      >
        <SelectTrigger className="h-11 rounded-none" disabled={isUpdating}>
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

      {errorMessage && (
        <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

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
                  disabled={isUpdating}
                  onClick={async () => {
                    setErrorMessage(null);
                    setIsUpdating(true);
                    try {
                      await onRemoveFavoriteProduct(product.id);
                    } catch (error) {
                      setErrorMessage(
                        error instanceof Error
                          ? error.message
                          : "Impossible de retirer ce produit des favoris.",
                      );
                    } finally {
                      setIsUpdating(false);
                    }
                  }}
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
