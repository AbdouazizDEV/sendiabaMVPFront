import { API_BASE_URL } from "@/core/config";

/** Aligned with `useCategoryFilters` / CategoryFiltersPanel */
export type CatalogPriceRangeFilter =
  | "all"
  | "under100"
  | "100-250"
  | "250-500"
  | "over500";

export type CatalogSortOption = "nouveau" | "prix_asc" | "prix_desc";

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Impossible de charger le catalogue.";
    try {
      const payload = (await response.json()) as { message?: string; error?: { message?: string } };
      message = payload.error?.message ?? payload.message ?? message;
    } catch {
      // keep fallback
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

async function unwrap<T>(response: Response): Promise<T> {
  const payload = await parseJson<T | ApiEnvelope<T>>(response);
  if (payload && typeof payload === "object" && "data" in payload && payload.data !== undefined) {
    return (payload as ApiEnvelope<T>).data as T;
  }
  return payload as T;
}

export type CatalogNewArrivalItem = {
  id: string;
  name: string;
  price: number;
  tag: string | null;
  imageUrl: string;
  href: string;
};

export type CollectionsHeroPayload = {
  badge: string;
  title: string;
  quote: string;
};

export type ShowcaseCategoryItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  productCount: number;
  href: string;
};

export type CategoryMetaPayload = {
  categoryId: string;
  title: string;
  description: string;
  heroImageUrl: string;
};

export type CatalogArtisanFilter = {
  id: string;
  name: string;
};

export type CategoryCatalogAvailableFilters = {
  subcategories: string[];
  artisans: CatalogArtisanFilter[];
  priceRanges: string[];
};

export type CategoryCatalogAppliedFilters = {
  subcategories: string[];
  artisans: string[];
  priceRange: string;
  inStockOnly: boolean;
  sort: string;
};

export type CategoryCatalogProduct = {
  id: string;
  name: string;
  price: number;
  subcategory: string;
  imageUrl: string;
  tag: string | null;
  inStock: boolean;
  artisan?: {
    id: string;
    name: string;
  };
  href: string;
};

export type CategoryCatalogResponse = {
  categoryId: string;
  availableFilters: CategoryCatalogAvailableFilters;
  appliedFilters: CategoryCatalogAppliedFilters;
  summary: {
    totalFound: number;
  };
  items: CategoryCatalogProduct[];
};

function sortToApi(sort: CatalogSortOption): string {
  if (sort === "nouveau") return "recent";
  return sort;
}

export type CategoryCatalogQuery = {
  subcategories?: string[];
  artisans?: string[];
  priceRange?: CatalogPriceRangeFilter;
  inStockOnly?: boolean;
  sort?: CatalogSortOption;
  limit?: number;
  page?: number;
};

export class CatalogPublicService {
  async getNewArrivals(limit = 4): Promise<CatalogNewArrivalItem[]> {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    const response = await fetch(`${API_BASE_URL}/v1/catalog/new-arrivals?${params.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const payload = await parseJson<{ items: CatalogNewArrivalItem[] }>(response);
    return payload.items ?? [];
  }

  async getCollectionsHero(): Promise<CollectionsHeroPayload> {
    const response = await fetch(`${API_BASE_URL}/v1/collections/hero`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return unwrap<CollectionsHeroPayload>(response);
  }

  async getShowcaseCategories(): Promise<{ items: ShowcaseCategoryItem[] }> {
    const response = await fetch(`${API_BASE_URL}/v1/collections/showcase-categories`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return unwrap<{ items: ShowcaseCategoryItem[] }>(response);
  }

  async getCategoryMeta(categoryId: string): Promise<CategoryMetaPayload> {
    const response = await fetch(
      `${API_BASE_URL}/v1/collections/${encodeURIComponent(categoryId)}/meta`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      },
    );
    return unwrap<CategoryMetaPayload>(response);
  }

  async getCategoryCatalog(
    categoryId: string,
    query: CategoryCatalogQuery = {},
  ): Promise<CategoryCatalogResponse> {
    const params = new URLSearchParams();
    if (query.subcategories?.length) {
      params.set("subcategories", query.subcategories.join(","));
    }
    if (query.artisans?.length) {
      params.set("artisans", query.artisans.join(","));
    }
    if (query.priceRange && query.priceRange !== "all") {
      params.set("priceRange", query.priceRange);
    }
    if (query.inStockOnly === true) {
      params.set("inStockOnly", "true");
    }
    if (query.sort) {
      params.set("sort", sortToApi(query.sort));
    }
    params.set("limit", String(query.limit ?? 24));
    params.set("page", String(query.page ?? 1));

    const qs = params.toString();
    const response = await fetch(
      `${API_BASE_URL}/v1/collections/${encodeURIComponent(categoryId)}/catalog${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      },
    );
    return parseJson<CategoryCatalogResponse>(response);
  }
}
