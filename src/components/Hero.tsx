import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { getManagedText } from "@/content/managed-content";
import heroImg from "../assets/hero.png";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const scrollToCollections = () => {
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
  };
  const badge = getManagedText("home.hero.badge", "Porte. Pose. Vecu. Fait main.");
  const title = getManagedText("home.hero.title", "L'ame de l'artisanat africain.");
  const cta = getManagedText("home.hero.cta", "Decouvrir l'Atelier");

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-foreground">
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 w-full h-full"
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src={heroImg}
          alt="Sendiaba Atelier at golden hour"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      <div className="relative z-20 h-full container mx-auto px-6 md:px-12 flex flex-col justify-center items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/80 uppercase tracking-[0.3em] text-sm md:text-base mb-6"
        >
          {badge}
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-white max-w-4xl leading-tight mb-12"
        >
          {title}
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          onClick={scrollToCollections}
          className="group flex flex-col items-center gap-4 text-white hover:text-primary transition-colors duration-300"
        >
          <span className="uppercase tracking-widest text-xs">{cta}</span>
          <div className="w-[1px] h-12 bg-white/30 group-hover:bg-primary transition-colors overflow-hidden relative">
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 w-full h-full bg-white group-hover:bg-primary"
            />
          </div>
        </motion.button>
      </div>
    </section>
  );
}
