import { Link } from "wouter";
import { motion } from "framer-motion";

import type { Order } from "@/domain/types";

type ProfileOrdersSectionProps = {
  orders: Order[];
};

export function ProfileOrdersSection({ orders }: ProfileOrdersSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4 border border-border p-6"
    >
      <h2 className="font-serif text-3xl">Mes commandes</h2>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">Vous n'avez pas encore passe de commande.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="flex flex-col gap-3 border border-border p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-serif text-xl">{order.id.toUpperCase()}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{new Date(order.createdAt).toLocaleString("fr-FR")}</p>
                <p className="mt-2 text-sm">{order.total.toLocaleString("fr-FR")} EUR</p>
              </div>
              <Link href={`/suivi-commande/${order.id}`} className="text-xs uppercase tracking-[0.2em] text-primary hover:underline">
                Suivre la commande
              </Link>
            </article>
          ))}
        </div>
      )}
    </motion.section>
  );
}
