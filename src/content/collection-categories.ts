import type { ProductCategory } from "@/domain/types";

import leatherImg from "@/assets/product-leather.png";
import cushionImg from "@/assets/product-cushion.png";
import sculptureImg from "@/assets/product-sculpture.png";
import giftImg from "@/assets/product-gift.png";

import leatherHero from "@/assets/product-leather.png";
import maisonHero from "@/assets/product-cushion.png";
import decorHero from "@/assets/product-sculpture.png";
import giftHero from "@/assets/product-gift.png";

export type CollectionLandingCategory = {
  id: ProductCategory;
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

/** Editorial rows on `/collections`. */
export const COLLECTION_LANDING_CATEGORIES: CollectionLandingCategory[] = [
  {
    id: "maroquinerie",
    title: "Maroquinerie & Cuir",
    subtitle: "L'art du cuir ouest-africain",
    description:
      "Sacs, portefeuilles et ceintures façonnés dans les cuirs les plus nobles de la sous-région. Chaque pièce développe une patine unique au fil du temps, témoignant du voyage partagé avec son propriétaire.",
    image: leatherImg,
  },
  {
    id: "maison",
    title: "Maison & Textile d'Art",
    subtitle: "Chaleur et symbolisme",
    description:
      "Coussins tissés à la main, étoffes en Bogolan et linge de table élégant pour ancrer votre espace de vie dans une esthétique riche en histoire et en confort.",
    image: cushionImg,
  },
  {
    id: "decoration",
    title: "Décoration & Objets d'Art",
    subtitle: "L'âme de la matière",
    description:
      "Sculptures en bois précieux, poteries ancestrales et pièces uniques sculptées à la main, porteuses d'une profonde dimension culturelle pour sublimer votre intérieur.",
    image: sculptureImg,
  },
  {
    id: "coffrets",
    title: "Coffrets & Cadeaux",
    subtitle: "Célébrer les moments précieux",
    description:
      "Des sélections raffinées pensées pour célébrer les moments qui comptent. De l'attention délicate au cadeau d'exception, offrez un morceau de patrimoine vivant.",
    image: giftImg,
  },
];

export type CategoryPageMeta = {
  title: string;
  description: string;
  hero: string;
};

/** Hero + copy for `/collections/:categoryId`. */
export const CATEGORY_PAGE_META: Record<ProductCategory, CategoryPageMeta> = {
  maroquinerie: {
    title: "Maroquinerie & Cuir",
    description:
      "Des cuirs sélectionnés avec soin, façonnés par les maîtres cordonniers de la sous-région pour une élégance intemporelle.",
    hero: leatherHero,
  },
  maison: {
    title: "Maison & Textile d'Art",
    description:
      "Coussins, plaids et linge de table tissés à la main. L'art de vivre ouest-africain s'invite chez vous.",
    hero: maisonHero,
  },
  decoration: {
    title: "Décoration & Objets d'Art",
    description:
      "Sculptures et poteries uniques. Des œuvres d'art porteuses de sens et d'histoire.",
    hero: decorHero,
  },
  coffrets: {
    title: "Coffrets & Cadeaux",
    description:
      "Célébrez chaque instant avec des sélections raffinées, pensées pour offrir le meilleur de notre artisanat.",
    hero: giftHero,
  },
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  maroquinerie: "Maroquinerie & Cuir",
  maison: "Maison & Textile d'Art",
  decoration: "Décoration & Objets d'Art",
  coffrets: "Coffrets & Cadeaux",
};

export function isProductCategory(id: string): id is ProductCategory {
  return id in CATEGORY_PAGE_META;
}
