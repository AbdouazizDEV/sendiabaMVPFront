import { motion } from "framer-motion";
import { getManagedText } from "@/content/managed-content";

export function CheckoutHero() {
  const badge = getManagedText("checkout.hero.badge", "Paiement securise");
  const title = getManagedText("checkout.hero.title", "Finalisez votre commande en toute serenite");
  const subtitle = getManagedText(
    "checkout.hero.subtitle",
    "Renseignez vos informations de livraison et choisissez votre moyen de paiement. Chaque commande est confirmee avec une facture imprimable et un suivi detaille.",
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-primary">{badge}</p>
      <h1 className="mt-4 font-serif text-5xl leading-tight">{title}</h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">{subtitle}</p>
    </motion.div>
  );
}
