import { useCallback, useEffect, useMemo, useState } from "react";

import { getServices } from "@/app/di/services";
import type { ProductCategory } from "@/domain/types";
import type { CategoryMetaPayload, CategoryCatalogResponse } from "@/services/catalog-public-service";

import type { PriceRangeFilter, SortOption } from "./useCategoryFilters";

export function useCategoryCatalog(categoryId: ProductCategory) {
  const { catalogPublicService } = getServices();

  const [lastCatalog, setLastCatalog] = useState<CategoryCatalogResponse | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [categoryMeta, setCategoryMeta] = useState<CategoryMetaPayload | null>(null);

  const [selectedSubcats, setSelectedSubcats] = useState<string[]>([]);
  const [selectedArtisans, setSelectedArtisans] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRangeFilter>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("nouveau");

  const activeFiltersCount = useMemo(
    () =>
      selectedSubcats.length +
      selectedArtisans.length +
      (priceRange !== "all" ? 1 : 0) +
      (inStockOnly ? 1 : 0),
    [selectedSubcats, selectedArtisans, priceRange, inStockOnly],
  );

  const resetFilters = useCallback(() => {
    setSelectedSubcats([]);
    setSelectedArtisans([]);
    setPriceRange("all");
    setInStockOnly(false);
  }, []);

  const toggleSubcat = useCallback((subcat: string) => {
    setSelectedSubcats((prev) =>
      prev.includes(subcat) ? prev.filter((s) => s !== subcat) : [...prev, subcat],
    );
  }, []);

  const toggleArtisan = useCallback((artisanId: string) => {
    setSelectedArtisans((prev) =>
      prev.includes(artisanId)
        ? prev.filter((s) => s !== artisanId)
        : [...prev, artisanId],
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadMeta = async () => {
      try {
        setLoadingMeta(true);
        const m = await catalogPublicService.getCategoryMeta(categoryId);
        if (!cancelled) setCategoryMeta(m);
      } catch {
        if (!cancelled) setCategoryMeta(null);
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    };
    void loadMeta();
    return () => {
      cancelled = true;
    };
  }, [catalogPublicService, categoryId]);

  const fetchCatalog = useCallback(async () => {
    try {
      setLoadingCatalog(true);
      setErrorMessage(null);
      const data = await catalogPublicService.getCategoryCatalog(categoryId, {
        subcategories: selectedSubcats,
        artisans: selectedArtisans,
        priceRange,
        inStockOnly,
        sort: sortBy,
        limit: 24,
        page: 1,
      });
      setLastCatalog(data);
    } catch (error) {
      setLastCatalog(null);
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible de charger les produits.",
      );
    } finally {
      setLoadingCatalog(false);
    }
  }, [
    catalogPublicService,
    categoryId,
    selectedSubcats,
    selectedArtisans,
    priceRange,
    inStockOnly,
    sortBy,
  ]);

  useEffect(() => {
    void fetchCatalog();
  }, [fetchCatalog]);

  const subcategories = lastCatalog?.availableFilters.subcategories ?? [];
  const categoryArtisans =
    lastCatalog?.availableFilters.artisans.map((a) => ({
      id: a.id,
      name: a.name,
    })) ?? [];

  const filteredProducts = lastCatalog?.items ?? [];
  const totalFound = lastCatalog?.summary.totalFound ?? 0;

  return {
    categoryMeta,
    loadingMeta,
    loadingCatalog,
    errorMessage,
    subcategories,
    categoryArtisans,
    filteredProducts,
    totalFound,
    selectedSubcats,
    selectedArtisans,
    priceRange,
    inStockOnly,
    sortBy,
    setPriceRange,
    setInStockOnly,
    setSortBy,
    toggleSubcat,
    toggleArtisan,
    resetFilters,
    activeFiltersCount,
    refetchCatalog: fetchCatalog,
  };
}
