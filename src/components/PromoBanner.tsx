import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { getManagedText } from "@/content/managed-content";
import giftImg from "../assets/product-gift.png";

function useCountdown(targetDate: Date) {
  const calculate = () => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [time, setTime] = useState(calculate);

  useEffect(() => {
    const timer = setInterval(() => setTime(calculate()), 1000);
    return () => clearInterval(timer);
  }, []);

  return time;
}

function Pad(n: number) {
  return String(n).padStart(2, "0");
}

export function PromoBanner() {
  const target = new Date("2026-05-07T00:00:00");
  const { days, hours, minutes, seconds } = useCountdown(target);
  const badge = getManagedText("home.promo.badge", "Collection Exclusive");
  const title = getManagedText("home.promo.title", "Tabaski 2026 - Edition Limitee");
  const subtitle = getManagedText(
    "home.promo.subtitle",
    "Des coffrets et creations artisanales penses pour celebrer la fete avec raffinement. Chaque piece est numerotee, signee par son artisan, et livree dans un ecrin premium.",
  );
  const cta = getManagedText("home.promo.cta", "Decouvrir la Collection");

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "520px" }}>
      <div className="absolute inset-0">
        <img
          src={giftImg}
          alt="Collection Tabaski"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/82" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at 70% 50%, hsl(var(--primary) / 0.5) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 py-24 flex flex-col md:flex-row items-center justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <span className="uppercase tracking-widest text-xs font-medium text-primary mb-5 block">
            {badge}
          </span>
          <h2 className="font-serif text-5xl md:text-6xl text-background leading-tight mb-6">
            {title}
          </h2>
          <p className="text-background/70 text-lg leading-relaxed mb-10 max-w-md">
            {subtitle}
          </p>
          <Link href="/collections/coffrets">
            <motion.button
              whileHover={{ x: 4 }}
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 uppercase text-xs tracking-widest font-medium hover:bg-primary/90 transition-colors"
            >
              {cta}
              <ArrowRight size={14} />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-6"
        >
          <p className="uppercase tracking-widest text-xs text-background/60">
            Disponible dans
          </p>
          <div className="flex items-start gap-4">
            {[
              { value: days, label: "Jours" },
              { value: hours, label: "Heures" },
              { value: minutes, label: "Minutes" },
              { value: seconds, label: "Secondes" },
            ].map(({ value, label }, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 border border-background/20 bg-background/5 backdrop-blur-sm flex items-center justify-center">
                  <span className="font-serif text-3xl md:text-4xl text-background tabular-nums">
                    {Pad(value)}
                  </span>
                </div>
                <span className="text-xs text-background/50 uppercase tracking-widest mt-2">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-background/40 text-center mt-2">
            Quantités limitées &mdash; 47 pièces restantes
          </p>
        </motion.div>
      </div>
    </section>
  );
}
