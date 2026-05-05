import { motion } from "framer-motion";
import { Link } from "wouter";
import { getManagedText } from "@/content/managed-content";
import type { HomeEditorial } from "@/services/home-public-service";
import leatherImg from "../assets/product-leather-2.png";
import maisonImg from "../assets/product-maison-1.png";

type EditorialSectionProps = {
  data?: HomeEditorial | null;
};

export function EditorialSection({ data }: EditorialSectionProps) {
  const blockOneTitle = data?.block1.title ?? getManagedText("home.editorial.block1.title", "Le sac qui voyage avec vous");
  const blockTwoTitle = data?.block2.title ?? getManagedText(
    "home.editorial.block2.title",
    "L'art du tissu, eleve au rang de decoration",
  );
  const blockOneDescription =
    data?.block1.description ??
    "Façonné dans les cuirs les plus nobles de la sous-région, chaque sac raconte l'histoire du tanneur qui l'a préparé et de l'artisan qui l'a cousu. Une pièce d'exception conçue pour s'embellir avec le temps et vous accompagner tout au long de votre vie.";
  const blockTwoDescription =
    data?.block2.description ??
    "Des teintures naturelles aux motifs symboliques tissés à la main, nos collections textiles transforment chaque fil en œuvre d'art. Le Bogolan et les tissus traditionnels apportent chaleur et profondeur à votre intérieur.";
  const blockOneImage = data?.block1.imageUrl ?? leatherImg;
  const blockTwoImage = data?.block2.imageUrl ?? maisonImg;
  const blockOneLabel = data?.block1.label ?? "Éditorial";
  const blockTwoLabel = data?.block2.label ?? "Savoir-faire";
  const blockOneHref = data?.block1.href ?? "/collections/maroquinerie";
  const blockTwoHref = data?.block2.href ?? "/collections/maison";
  return (
    <section className="py-24 md:py-32 bg-muted/20">
      <div className="container mx-auto px-6 md:px-12 space-y-32">
        {/* Block 1 */}
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-2/3 aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-muted"
          >
            <img src={blockOneImage} alt="Maroquinerie" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/3 space-y-6"
          >
            <span className="uppercase text-xs tracking-widest text-primary font-medium">{blockOneLabel}</span>
            <h2 className="text-4xl lg:text-5xl font-serif text-foreground leading-tight">{blockOneTitle}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{blockOneDescription}</p>
            <Link href={blockOneHref} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-semibold text-foreground hover:text-primary transition-colors pb-1 border-b border-foreground hover:border-primary">
              Découvrir <span aria-hidden="true">&rarr;</span>
            </Link>
          </motion.div>
        </div>

        {/* Block 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-2/3 aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-muted"
          >
            <img src={blockTwoImage} alt="Maison et Textile" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/3 space-y-6"
          >
            <span className="uppercase text-xs tracking-widest text-primary font-medium">{blockTwoLabel}</span>
            <h2 className="text-4xl lg:text-5xl font-serif text-foreground leading-tight">{blockTwoTitle}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{blockTwoDescription}</p>
            <Link href={blockTwoHref} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-semibold text-foreground hover:text-primary transition-colors pb-1 border-b border-foreground hover:border-primary">
              Découvrir <span aria-hidden="true">&rarr;</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
