import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, MapPin, PackageCheck, Truck } from "lucide-react";

import { getServices } from "@/app/di/services";
import { useAuth } from "@/app/state";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const steps = [
  { id: "pending", label: "Commande recue", icon: FileText },
  { id: "confirmed", label: "Paiement confirme", icon: CheckCircle2 },
  { id: "in_preparation", label: "Preparation en atelier", icon: PackageCheck },
  { id: "shipped", label: "Expedition", icon: Truck },
] as const;

export default function OrderTrackingPage() {
  const params = useParams<{ orderId?: string }>();
  const { session, isAuthenticated } = useAuth();
  const { orderService } = getServices();

  if (!isAuthenticated || !session) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="container mx-auto px-6 pt-36 text-center">
          <p className="text-muted-foreground">Veuillez vous connecter pour voir le suivi de commande.</p>
        </section>
        <Footer />
      </main>
    );
  }

  const order = orderService.getById(params.orderId ?? "");

  if (!order || order.userId !== session.id) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="container mx-auto px-6 pt-36 text-center">
          <p className="text-muted-foreground">Commande introuvable.</p>
          <Link href="/profil" className="mt-6 inline-block text-primary underline-offset-4 hover:underline">
            Revenir au profil
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  const currentStepIndex = steps.findIndex((step) => step.id === order.status);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-6 pb-20 pt-32 md:px-12">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Suivi de commande</p>
          <h1 className="mt-4 font-serif text-5xl">Commande {order.id.toUpperCase()}</h1>
          <p className="mt-4 text-muted-foreground">Suivez l'avancement en temps reel et imprimez votre facture.</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_420px]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-4 border border-border p-6">
            <h2 className="font-serif text-3xl">Etapes de traitement</h2>
            <div className="space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const completed = index <= currentStepIndex;
                return (
                  <div key={step.id} className={`flex items-center gap-4 border p-4 ${completed ? "border-primary/40 bg-primary/5" : "border-border"}`}>
                    <Icon className={completed ? "text-primary" : "text-muted-foreground"} />
                    <p className={`text-sm uppercase tracking-[0.15em] ${completed ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.aside initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-5 border border-border bg-muted/20 p-6">
            <h3 className="font-serif text-2xl">Livraison</h3>
            <p className="text-sm text-muted-foreground">
              <MapPin className="mr-2 inline" size={15} />
              {order.checkout.addressLine}, {order.checkout.district}, {order.checkout.city}, {order.checkout.country}
            </p>
            <p className="text-sm">Telephone: {order.checkout.phone}</p>
            <p className="text-sm">Paiement: {order.checkout.paymentMethod}</p>
            <p className="text-sm">Total: {order.total.toLocaleString("fr-FR")} EUR</p>

            <Button className="h-11 w-full rounded-none uppercase tracking-[0.2em]" onClick={() => window.print()}>
              Imprimer la facture
            </Button>

            <Link href="/profil" className="block text-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
              Voir mon profil
            </Link>
          </motion.aside>
        </div>
      </section>
      <Footer />
    </main>
  );
}
