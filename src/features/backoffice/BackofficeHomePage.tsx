import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

import { getServices } from "@/app/di/services";
import { useAuth } from "@/app/state";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

export default function BackofficeHomePage() {
  const { session, isAuthenticated } = useAuth();
  const { authService, backofficeDashboardService } = getServices();
  const isAdmin = isAuthenticated && session?.role === "admin";
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [kpis, setKpis] = useState<Awaited<ReturnType<typeof backofficeDashboardService.getKpis>> | null>(null);
  const [trend, setTrend] = useState<Awaited<ReturnType<typeof backofficeDashboardService.getRevenueTrend>> | null>(null);
  const [segments, setSegments] = useState<Awaited<ReturnType<typeof backofficeDashboardService.getCategorySegments>> | null>(null);
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof backofficeDashboardService.getOverview>> | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    const loadDashboard = async () => {
      const accessToken = authService.getAccessToken();
      if (!accessToken) {
        if (!cancelled) {
          setErrorMessage("Session invalide. Veuillez vous reconnecter.");
          setIsLoading(false);
        }
        return;
      }
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const [nextKpis, nextTrend, nextSegments, nextOverview] = await Promise.all([
          backofficeDashboardService.getKpis(accessToken),
          backofficeDashboardService.getRevenueTrend(accessToken, "9m"),
          backofficeDashboardService.getCategorySegments(accessToken),
          backofficeDashboardService.getOverview(accessToken),
        ]);
        if (!cancelled) {
          setKpis(nextKpis);
          setTrend(nextTrend);
          setSegments(nextSegments);
          setOverview(nextOverview);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : "Impossible de charger le dashboard.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [authService, backofficeDashboardService, isAdmin]);

  const cards = useMemo(() => {
    const k = kpis ?? {
      totalVisitors: 0,
      totalClients: 0,
      totalUsers: 0,
      totalArtisans: 0,
      ordersThisMonth: 0,
      monthlyRevenue: 0,
      currency: "EUR",
    };
    return [
      { label: "Visiteurs", value: k.totalVisitors },
      { label: "Clients", value: k.totalClients },
      { label: "Utilisateurs", value: k.totalUsers },
      { label: "Artisans", value: k.totalArtisans },
      { label: "Commandes / mois", value: k.ordersThisMonth },
      {
        label: "Revenus / mois",
        value: `${k.monthlyRevenue.toLocaleString("fr-FR")} ${k.currency}`,
      },
    ];
  }, [kpis]);

  const trendPoints = trend?.points ?? [];
  const trendMax = useMemo(() => {
    if (trendPoints.length === 0) return 1;
    return Math.max(...trendPoints.map((point) => point.value), 1);
  }, [trendPoints]);
  const trendPolyline = useMemo(() => {
    const width = 100;
    const height = 36;
    if (trendPoints.length <= 1) return "0,36 100,36";
    return trendPoints.map((point, index) => {
      const x = (index / (trendPoints.length - 1)) * width;
      const y = height - (point.value / trendMax) * height;
      return `${x},${y}`;
    }).join(" ");
  }, [trendMax, trendPoints]);

  const segmentGradient = useMemo(() => {
    let cursor = 0;
    const activeSegments = segments?.segments ?? [];
    return activeSegments.map((segment) => {
      const start = cursor;
      cursor += segment.value;
      return `${segment.color} ${start}% ${cursor}%`;
    }).join(", ") || "#2A2A2A 0% 100%";
  }, [segments]);

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background px-6 py-20 md:px-12">
        <div className="mx-auto max-w-3xl border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Cette zone est reservee aux administrateurs.
          </p>
          <Link href="/">
            <Button className="mt-6 rounded-none uppercase tracking-[0.2em]">Retour a l'accueil</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-6 pb-16 pt-32 md:px-12">
        <Navbar />
        <div className="mx-auto max-w-7xl">
          <p className="text-muted-foreground">Chargement du dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 pb-16 pt-32 md:px-12">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-7xl space-y-8"
      >
        <header className="border border-border bg-muted/20 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Back-office</p>
          <h1 className="mt-4 font-serif text-5xl">{overview?.title ?? "Tableau de bord administrateur"}</h1>
          <p className="mt-3 text-muted-foreground">
            {overview?.subtitle ??
              `Bonjour ${session?.displayName ?? ""}, suivez les performances globales de la plateforme.`}
          </p>
          {errorMessage && (
            <p className="mt-4 border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          )}
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <motion.article
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="border border-border bg-card/40 p-5"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{card.label}</p>
              <p className="mt-2 font-serif text-3xl">{card.value}</p>
            </motion.article>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
          <motion.article
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-border bg-card/40 p-6"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Revenus 9 mois</p>
                <h3 className="mt-2 font-serif text-3xl">Tendance de croissance</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                +{trend?.growthVsPreviousPeriod ?? 0}% vs periode precedente
              </p>
            </div>

            <div className="mt-6 rounded-none border border-border/60 bg-background/70 p-4">
              <svg viewBox="0 0 100 42" className="h-52 w-full">
                <defs>
                  <linearGradient id="revenueLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#C56E47" />
                    <stop offset="100%" stopColor="#C56E47" stopOpacity="0.25" />
                  </linearGradient>
                </defs>
                <motion.polyline
                  points={trendPolyline}
                  fill="none"
                  stroke="url(#revenueLineGradient)"
                  strokeWidth="1.6"
                  initial={{ pathLength: 0, opacity: 0.1 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.35, ease: "easeOut" }}
                />
              </svg>
              <div className="mt-2 grid grid-cols-9 gap-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                {trendPoints.map((point) => (
                  <span key={point.month}>{point.month}</span>
                ))}
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="border border-border bg-card/40 p-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Repartition categories</p>
            <h3 className="mt-2 font-serif text-3xl">Activite artisans</h3>

            <div className="mt-7 flex items-center justify-center">
              <motion.div
                initial={{ rotate: -25, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="relative h-44 w-44 rounded-full"
                style={{
                  background: `conic-gradient(${segmentGradient})`,
                }}
              >
                <div className="absolute inset-[22%] flex items-center justify-center rounded-full bg-background text-center">
                  <span className="font-serif text-2xl">100%</span>
                </div>
              </motion.div>
            </div>

            <div className="mt-7 space-y-3">
              {(segments?.segments ?? []).map((segment, index) => (
                <div key={segment.label}>
                  <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-[0.18em]">
                    <span className="text-muted-foreground">{segment.label}</span>
                    <span>{segment.value}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden bg-muted/40">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${segment.value}%` }}
                      transition={{ duration: 0.75, delay: 0.1 + index * 0.1 }}
                      className="h-full"
                      style={{ backgroundColor: segment.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.article>
        </section>

        <section className="border border-border p-6">
          <h2 className="font-serif text-3xl">Modules back-office</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Navigation rapide vers les modules administrateur.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {(overview?.modules ?? []).map((module, index) => (
              <Link key={module.key} href={module.href}>
                <Button
                  variant={index === 0 ? "default" : "outline"}
                  className="rounded-none uppercase tracking-[0.2em]"
                >
                  {module.label}
                </Button>
              </Link>
            ))}
          </div>
        </section>
      </motion.div>
    </main>
  );
}
