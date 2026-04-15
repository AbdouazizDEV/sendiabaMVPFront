import { motion } from "framer-motion";
import { getManagedText } from "@/content/managed-content";
import artisan1 from "../assets/artisan-1.png";
import artisan2 from "../assets/artisan-2.png";
import artisan3 from "../assets/artisan-3.png";

const artisans = [
  {
    id: 1,
    name: "Ibrahima Guèye",
    title: "Maître Cordonnier",
    location: "Ngaye Mékhé, Sénégal",
    heritage: "Troisième génération, depuis 1987",
    image: artisan1,
    quote: "Le cuir ne ment pas. Il garde la mémoire des mains qui l'ont travaillé.",
  },
  {
    id: 2,
    name: "Fatouma Diabaté",
    title: "Tisserande d'Art",
    location: "Ségou, Mali",
    heritage: "Héritière des techniques Bogolan",
    image: artisan2,
    quote: "Chaque motif est un mot, chaque tissu est un livre d'histoire.",
  },
  {
    id: 3,
    name: "Ousmane Sawadogo",
    title: "Sculpteur sur Bois",
    location: "Ouagadougou, Burkina Faso",
    heritage: "Sculpteur depuis plus de 40 ans",
    image: artisan3,
    quote: "Je ne crée pas la forme, je libère l'âme qui dormait dans l'ébène.",
  },
];

export function Artisans() {
  const title = getManagedText("home.artisans.title", "Derriere chaque objet, une lignee.");
  const subtitle = getManagedText(
    "home.artisans.subtitle",
    "Le vrai luxe reside dans l'humanite de la creation. Rencontrez les maitres artisans dont les noms signent l'authenticite de nos collections.",
  );
  return (
    <section id="artisans" className="py-24 md:py-32 bg-foreground text-background">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="uppercase tracking-widest text-sm text-primary mb-4 block">Les Mains de l'Excellence</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6">{title}</h2>
          <p className="text-background/70 text-lg">{subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-8">
          {artisans.map((artisan, index) => (
            <motion.div
              key={artisan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="flex flex-col group"
            >
              <div className="relative aspect-square mb-8 overflow-hidden rounded-sm">
                <img
                  src={artisan.image}
                  alt={artisan.name}
                  className="w-full h-full object-cover object-center filter grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply" />
              </div>
              
              <div className="space-y-4 text-center lg:text-left relative">
                <div className="absolute -top-12 lg:-left-6 text-6xl text-background/10 font-serif z-0">"</div>
                <p className="font-serif italic text-xl text-background/90 relative z-10">
                  {artisan.quote}
                </p>
                <div className="pt-4 border-t border-background/20 mt-6">
                  <h3 className="text-2xl font-serif text-background mb-1">{artisan.name}</h3>
                  <p className="text-primary font-medium">{artisan.title}</p>
                  <p className="text-background/60 text-sm mt-2">{artisan.location} • {artisan.heritage}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
