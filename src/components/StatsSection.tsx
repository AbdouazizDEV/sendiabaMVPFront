import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

function Counter({ target, suffix = "" }: { target: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return undefined;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const stats = [
    { value: 320, suffix: "+", label: "Artisans partenaires" },
    { value: 12500, suffix: "+", label: "Créations disponibles" },
    { value: 40, suffix: "+", label: "Pays de livraison" },
    { value: 98, suffix: "%", label: "Clients satisfaits" },
  ];

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-5 select-none">
        <p className="text-[12rem] font-serif whitespace-nowrap text-foreground">L'Excellence Africaine</p>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center space-y-4"
            >
              <div className="text-5xl md:text-6xl lg:text-7xl font-serif text-primary">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="uppercase text-xs md:text-sm tracking-widest font-medium text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
