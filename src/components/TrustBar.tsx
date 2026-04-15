import { motion } from "framer-motion";

export function TrustBar() {
  const pillars = [
    { title: "Artisans Certifiés", desc: "Chaque créateur est vérifié et soutenu" },
    { title: "Livraison Mondiale", desc: "Vers 40+ pays, emballage artisanal" },
    { title: "Authenticité Garantie", desc: "Pièces traçables, histoire vérifiable" },
    { title: "Retours 30 Jours", desc: "Satisfaction ou remboursement" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-foreground text-background py-10"
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-background/20">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="px-4 text-center md:text-left flex flex-col items-center md:items-start">
              <h4 className="font-serif text-lg mb-2">{pillar.title}</h4>
              <p className="text-sm text-background/70">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
