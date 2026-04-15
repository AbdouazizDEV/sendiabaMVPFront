import type { IProductRepository } from "@/domain/repositories";
import type { Product, ProductCategory } from "@/domain/types";
import { products } from "@/infrastructure/data";

export class StaticProductRepository implements IProductRepository {
  getAll(): readonly Product[] {
    return products;
  }

  getById(id: string): Product | undefined {
    return products.find((p) => p.id === id);
  }

  listByCategory(category: ProductCategory): Product[] {
    return products.filter((p) => p.category === category);
  }

  listByArtisanId(artisanId: string): Product[] {
    return products.filter((p) => p.artisanId === artisanId);
  }
}
