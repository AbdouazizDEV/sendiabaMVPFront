import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const messages = [
  { text: "Livraison offerte dès 200\u00a0\u20ac d'achat", highlight: "Code\u00a0: BIENVENUE" },
  { text: "Nouvelle collection Tabaski 2026", highlight: "\u00c9ditions Limit\u00e9es \u2014 Quantit\u00e9s restreintes" },
  { text: "Artisanat certifi\u00e9 \u00e9thique", highlight: "Chaque achat soutient directement un artisan" },
];

export function AnnouncementBanner() {
  const [visible, setVisible] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  const msg = messages[current];

  return (
    <div className="relative bg-foreground text-background overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 py-2.5 flex items-center justify-center gap-3 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="text-xs tracking-wide"
          >
            <span className="text-background/70">{msg.text}</span>
            {msg.highlight && (
              <>
                <span className="mx-2 text-background/30">&mdash;</span>
                <span className="font-semibold text-primary">{msg.highlight}</span>
              </>
            )}
          </motion.p>
        </AnimatePresence>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <div className="hidden md:flex gap-1">
            {messages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === current ? "bg-primary" : "bg-background/30"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-background/50 hover:text-background transition-colors"
            aria-label="Fermer"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
