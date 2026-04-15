import { motion } from "framer-motion";
import { Link } from "wouter";
import { getManagedText } from "@/content/managed-content";
import leatherImg from "../assets/product-leather.png";
import cushionImg from "../assets/product-cushion.png";
import sculptureImg from "../assets/product-sculpture.png";
import giftImg from "../assets/product-gift.png";

const categories = [
  {
    id: "maroquinerie",
    title: "Maroquinerie & Cuir",
    description: "Sacs, portefeuilles et ceintures façonnés dans les cuirs les plus nobles de la sous-région.",
    image: leatherImg,
  },
  {
    id: "maison",
    title: "Maison & Textile d'Art",
    description: "Coussins, tissus bogolan et linge de table pour ancrer votre espace de vie.",
    image: cushionImg,
  },
  {
    id: "decoration",
    title: "Décoration & Objets d'Art",
    description: "Sculptures et pièces uniques sculptées à la main, porteuses de profondeur culturelle.",
    image: sculptureImg,
  },
  {
    id: "coffrets",
    title: "Coffrets & Cadeaux",
    description: "Des sélections pensées pour célébrer les moments qui comptent, de la Tabaski aux unions.",
    image: giftImg,
  },
];

export function Categories() {
  const sectionTitle = getManagedText("home.categories.title", "Les Collections");
  const sectionSubtitle = getManagedText(
    "home.categories.subtitle",
    "L'excellence de l'artisanat ouest-africain, declinee en quatre univers d'exception.",
  );
  return (
    <section id="categories" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-end gap-6"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">{sectionTitle}</h2>
            <p className="text-muted-foreground text-lg max-w-xl">{sectionSubtitle}</p>
          </div>
          <Link href="/collections">
            <span className="uppercase text-xs tracking-widest text-foreground border-b border-foreground hover:text-primary hover:border-primary transition-colors duration-300 pb-1 cursor-pointer">
              Toutes les collections
            </span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`group ${index % 2 === 1 ? 'md:mt-24' : ''}`}
            >
              <Link href={`/collections/${category.id}`}>
                <div className="block cursor-pointer">
                  <div className="relative overflow-hidden aspect-[3/4] mb-6 bg-muted">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="w-full h-full"
                    >
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover object-center"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="w-12 h-[1px] bg-primary mb-4" />
                    <h3 className="text-2xl font-serif text-foreground group-hover:text-primary transition-colors duration-300">{category.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{category.description}</p>
                    <span className="uppercase text-xs tracking-widest text-foreground font-medium group-hover:text-primary transition-colors flex items-center gap-2 mt-4">
                      Découvrir
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        →
                      </motion.span>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
