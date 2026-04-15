export type ProductTag =
  | "Nouveau"
  | "Pièce Unique"
  | "Best-Seller"
  | "Édition Limitée";

export type ProductCategory =
  | "maroquinerie"
  | "maison"
  | "decoration"
  | "coffrets";

export type Product = {
  id: string;
  name: string;
  artisanId: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  description: string;
  details: string[];
  image: string;
  tag?: ProductTag;
  inStock: boolean;
};
