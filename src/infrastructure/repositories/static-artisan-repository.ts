import type { IArtisanRepository } from "@/domain/repositories";
import type { Artisan } from "@/domain/types";
import { artisans } from "@/infrastructure/data";

export class StaticArtisanRepository implements IArtisanRepository {
  getAll(): readonly Artisan[] {
    return artisans;
  }

  getById(id: string): Artisan | undefined {
    return artisans.find((a) => a.id === id);
  }
}
