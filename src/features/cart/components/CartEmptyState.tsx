import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { getManagedText } from "@/content/managed-content";

export function CartEmptyState() {
  const title = getManagedText("cart.empty.title", "Votre selection est vide");
  const subtitle = getManagedText(
    "cart.empty.subtitle",
    "Decouvrez nos pieces d exception et ajoutez celles qui vous inspirent pour composer votre prochaine commande.",
  );
  return (
    <section className="border border-dashed border-border bg-muted/20 px-6 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-primary">Panier</p>
      <h2 className="mt-4 font-serif text-4xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{subtitle}</p>
      <Link href="/collections">
        <Button className="mt-8 h-12 rounded-none px-8 uppercase tracking-[0.2em]">
          Explorer les collections
        </Button>
      </Link>
    </section>
  );
}
