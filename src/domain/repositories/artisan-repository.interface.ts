import type { Artisan } from "@/domain/types";

/** Data access for artisans — swap implementation for API-backed storage (DIP). */
export interface IArtisanRepository {
  getAll(): readonly Artisan[];
  getById(id: string): Artisan | undefined;
}
