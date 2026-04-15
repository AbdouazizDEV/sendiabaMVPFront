import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { type Product } from "@/domain/types";

type CartItemRowProps = {
  product: Product;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export function CartItemRow({
  product,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemRowProps) {
  return (
    <article className="grid grid-cols-[96px_1fr] gap-5 border border-border p-4 md:grid-cols-[120px_1fr_auto]">
      <img src={product.image} alt={product.name} className="h-24 w-24 object-cover md:h-28 md:w-28" />

      <div className="space-y-2">
        <h3 className="font-serif text-xl">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.description}</p>
        <p className="text-sm uppercase tracking-[0.15em] text-primary">{product.category}</p>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 md:items-end">
        <p className="font-serif text-2xl">{(product.price * quantity).toLocaleString("fr-FR")} EUR</p>

        <div className="flex items-center gap-2 border border-border p-1">
          <Button size="icon" variant="ghost" onClick={onDecrease} aria-label="Diminuer">
            <Minus size={14} />
          </Button>
          <span className="min-w-8 text-center text-sm font-medium">{quantity}</span>
          <Button size="icon" variant="ghost" onClick={onIncrease} aria-label="Augmenter">
            <Plus size={14} />
          </Button>
        </div>

        <Button
          variant="ghost"
          className="h-auto p-0 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 size={14} className="mr-2" /> Supprimer
        </Button>
      </div>
    </article>
  );
}
