import type { Product, ProductCategory } from "@/domain/types";

/** Data access for products — swap implementation for API-backed storage (DIP). */
export interface IProductRepository {
  getAll(): readonly Product[];
  getById(id: string): Product | undefined;
  listByCategory(category: ProductCategory): Product[];
  listByArtisanId(artisanId: string): Product[];
}
