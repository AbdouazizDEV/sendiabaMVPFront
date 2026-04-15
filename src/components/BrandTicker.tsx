import { motion } from "framer-motion";

const words = [
  "Porté",
  "·",
  "Posé",
  "·",
  "Vécu",
  "·",
  "Fait Main",
  "·",
  "Artisanat d'Excellence",
  "·",
  "Afrique de l'Ouest",
  "·",
  "Héritage & Modernité",
  "·",
  "Pièces Uniques",
  "·",
  "Traçabilité Totale",
  "·",
];

const doubled = [...words, ...words];

export function BrandTicker() {
  return (
    <div className="border-t border-b border-foreground/10 py-3 overflow-hidden bg-background">
      <motion.div
        className="flex items-center gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 36,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {doubled.map((word, i) => (
          <span
            key={i}
            className={`shrink-0 select-none ${
              word === "·"
                ? "text-primary text-xs"
                : "text-[11px] uppercase tracking-[0.25em] text-foreground/40 font-light"
            }`}
          >
            {word}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
