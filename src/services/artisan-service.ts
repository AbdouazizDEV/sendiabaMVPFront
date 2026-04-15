import type { IArtisanRepository } from "@/domain/repositories";
import type { Artisan } from "@/domain/types";

/** Application orchestration for artisans (single responsibility: artisan use-cases). */
export class ArtisanService {
  constructor(private readonly artisans: IArtisanRepository) {}

  list(): readonly Artisan[] {
    return this.artisans.getAll();
  }

  getById(id: string): Artisan | undefined {
    return this.artisans.getById(id);
  }
}
