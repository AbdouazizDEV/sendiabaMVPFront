import { motion } from "framer-motion";
import { getManagedText } from "@/content/managed-content";

const mediaLogos = [
  { name: "Jeune Afrique", style: "font-serif italic" },
  { name: "Le Monde Afrique", style: "font-sans font-light tracking-widest uppercase text-sm" },
  { name: "Forbes Afrique", style: "font-sans font-bold tracking-tight uppercase" },
  { name: "RFI", style: "font-sans font-black tracking-widest uppercase" },
  { name: "Vogue Africa", style: "font-serif italic" },
  { name: "Africa Business+", style: "font-sans font-semibold tracking-wide" },
  { name: "BBC Afrique", style: "font-sans font-bold tracking-tight" },
  { name: "Afrik.com", style: "font-serif italic" },
  { name: "La Tribune Afrique", style: "font-sans font-light tracking-widest uppercase text-sm" },
  { name: "Challenges Afrique", style: "font-sans font-semibold tracking-wide" },
];

const doubled = [...mediaLogos, ...mediaLogos];

export function PressSection() {
  const badge = getManagedText("home.press.badge", "Ils parlent de nous");
  const subtitle = getManagedText(
    "home.press.subtitle",
    "Sendiaba est reconnue par les medias africains et internationaux comme la reference du luxe artisanal de la sous-region.",
  );
  return (
    <section className="py-20 border-t border-b border-foreground/10 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="uppercase tracking-widest text-xs font-medium text-primary block mb-3">
            {badge}
          </span>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {subtitle}
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }}
        />

        <motion.div
          className="flex items-center gap-16 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 28,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {doubled.map((media, i) => (
            <div
              key={i}
              className="flex items-center gap-16 shrink-0"
            >
              <span
                className={`text-foreground/25 hover:text-foreground/70 transition-colors duration-500 cursor-default select-none text-xl ${media.style}`}
              >
                {media.name}
              </span>
              <span className="text-foreground/15 text-xs select-none">&mdash;</span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="container mx-auto px-6 md:px-12 mt-12 text-center"
      >
        <blockquote className="max-w-2xl mx-auto">
          <p className="font-serif italic text-xl md:text-2xl text-foreground/60 leading-relaxed">
            &ldquo;Sendiaba réinvente la mise en valeur de l&rsquo;artisanat africain avec un sens du raffinement rare.&rdquo;
          </p>
          <cite className="block mt-4 text-xs uppercase tracking-widest text-muted-foreground not-italic">
            Jeune Afrique &mdash; Hors-série Luxe &amp; Art de Vivre 2025
          </cite>
        </blockquote>
      </motion.div>
    </section>
  );
}
