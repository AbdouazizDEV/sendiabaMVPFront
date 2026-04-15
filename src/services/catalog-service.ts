import type { IArtisanRepository, IProductRepository } from "@/domain/repositories";
import type { Artisan, Product, ProductCategory } from "@/domain/types";

/** Cross-cutting catalog queries (collections, highlights, counts). */
export class CatalogService {
  constructor(
    private readonly products: IProductRepository,
    private readonly artisans: IArtisanRepository,
  ) {}

  countProductsInCategory(categoryId: ProductCategory): number {
    return this.products.listByCategory(categoryId).length;
  }

  /** Artisans who have at least one product in the category. */
  artisansForCategory(categoryId: ProductCategory): Artisan[] {
    const productList = this.products.listByCategory(categoryId);
    const ids = new Set(productList.map((p) => p.artisanId));
    return this.artisans.getAll().filter((a) => ids.has(a.id));
  }

  /**
   * Products tagged as new or limited — sample for marketing blocks.
   * For stable UI tests, pass a fixed `pick` order of ids instead of random.
   */
  sampleNewArrivals(count: number): Product[] {
    const pool = this.products
      .getAll()
      .filter((p) => p.tag === "Nouveau" || p.tag === "Édition Limitée");
    return [...pool].sort(() => 0.5 - Math.random()).slice(0, count);
  }
}
