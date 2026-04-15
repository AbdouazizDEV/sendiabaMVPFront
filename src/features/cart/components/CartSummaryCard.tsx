import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type CartSummaryCardProps = {
  itemCount: number;
  subtotal: number;
  shipping: number;
};

export function CartSummaryCard({
  itemCount,
  subtotal,
  shipping,
}: CartSummaryCardProps) {
  const total = subtotal + shipping;

  return (
    <aside className="space-y-5 border border-border p-6">
      <h2 className="font-serif text-2xl">Recapitulatif</h2>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Articles ({itemCount})</span>
          <span>{subtotal.toLocaleString("fr-FR")} EUR</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Livraison</span>
          <span>{shipping.toLocaleString("fr-FR")} EUR</span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <span className="font-serif text-xl">Total</span>
        <span className="font-serif text-2xl">{total.toLocaleString("fr-FR")} EUR</span>
      </div>

      <Link href="/paiement">
        <Button className="h-12 w-full rounded-none uppercase tracking-[0.2em]">
          Passer la commande
        </Button>
      </Link>

      <Link href="/collections" className="block text-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
        Continuer mes achats
      </Link>
    </aside>
  );
}
