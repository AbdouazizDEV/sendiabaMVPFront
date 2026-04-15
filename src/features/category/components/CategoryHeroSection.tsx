import { motion } from "framer-motion";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { CategoryPageMeta } from "@/content/collection-categories";

type CategoryHeroSectionProps = {
  meta: CategoryPageMeta;
};

export function CategoryHeroSection({ meta }: CategoryHeroSectionProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 md:px-12 bg-foreground text-background overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={meta.hero} alt="" className="w-full h-full object-cover opacity-20 filter grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground to-foreground/80" />
      </div>

      <div className="container mx-auto relative z-10">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-xs uppercase tracking-widest text-background/60 hover:text-background">
                Accueil
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-background/40" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/collections" className="text-xs uppercase tracking-widest text-background/60 hover:text-background">
                Collections
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-background/40" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs uppercase tracking-widest text-background">{meta.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-serif mb-6">{meta.title}</h1>
          <p className="text-lg text-background/70 leading-relaxed">{meta.description}</p>
        </motion.div>
      </div>
    </section>
  );
}
