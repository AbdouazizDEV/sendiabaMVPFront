import type { IProductRepository } from "@/domain/repositories";
import type { Product, ProductCategory } from "@/domain/types";

/** Application orchestration for products. */
export class ProductService {
  constructor(private readonly products: IProductRepository) {}

  list(): readonly Product[] {
    return this.products.getAll();
  }

  getById(id: string): Product | undefined {
    return this.products.getById(id);
  }

  listByCategory(category: ProductCategory): Product[] {
    return this.products.listByCategory(category);
  }

  listByArtisan(artisanId: string): Product[] {
    return this.products.listByArtisanId(artisanId);
  }

  listSimilar(product: Product, limit: number): Product[] {
    return this.products
      .listByCategory(product.category)
      .filter((p) => p.id !== product.id)
      .slice(0, limit);
  }
}
