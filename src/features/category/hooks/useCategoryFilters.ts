import { useMemo, useState } from "react";

import { getServices } from "@/app/di/services";
import type { Artisan, Product, ProductCategory } from "@/domain/types";

export type PriceRangeFilter =
  | "all"
  | "under100"
  | "100-250"
  | "250-500"
  | "over500";

export type SortOption = "nouveau" | "prix_asc" | "prix_desc";

export function useCategoryFilters(categoryId: ProductCategory) {
  const { productService, catalogService } = getServices();

  const categoryProducts = useMemo(
    () => productService.listByCategory(categoryId),
    [categoryId, productService],
  );

  const subcategories = useMemo(
    () => Array.from(new Set(categoryProducts.map((p) => p.subcategory))),
    [categoryProducts],
  );

  const categoryArtisans: Artisan[] = useMemo(
    () => catalogService.artisansForCategory(categoryId),
    [catalogService, categoryId],
  );

  const [selectedSubcats, setSelectedSubcats] = useState<string[]>([]);
  const [selectedArtisans, setSelectedArtisans] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRangeFilter>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("nouveau");

  const activeFiltersCount =
    selectedSubcats.length +
    selectedArtisans.length +
    (priceRange !== "all" ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const resetFilters = () => {
    setSelectedSubcats([]);
    setSelectedArtisans([]);
    setPriceRange("all");
    setInStockOnly(false);
  };

  const toggleSubcat = (subcat: string) => {
    setSelectedSubcats((prev) =>
      prev.includes(subcat) ? prev.filter((s) => s !== subcat) : [...prev, subcat],
    );
  };

  const toggleArtisan = (artisanId: string) => {
    setSelectedArtisans((prev) =>
      prev.includes(artisanId)
        ? prev.filter((s) => s !== artisanId)
        : [...prev, artisanId],
    );
  };

  const filteredProducts: Product[] = useMemo(() => {
    return categoryProducts
      .filter(
        (p) =>
          selectedSubcats.length === 0 || selectedSubcats.includes(p.subcategory),
      )
      .filter(
        (p) =>
          selectedArtisans.length === 0 ||
          selectedArtisans.includes(p.artisanId),
      )
      .filter((p) => {
        if (priceRange === "all") return true;
        if (priceRange === "under100") return p.price < 100;
        if (priceRange === "100-250") return p.price >= 100 && p.price <= 250;
        if (priceRange === "250-500") return p.price > 250 && p.price <= 500;
        if (priceRange === "over500") return p.price > 500;
        return true;
      })
      .filter((p) => (inStockOnly ? p.inStock : true))
      .sort((a, b) => {
        if (sortBy === "prix_asc") return a.price - b.price;
        if (sortBy === "prix_desc") return b.price - a.price;
        return 0;
      });
  }, [
    categoryProducts,
    selectedSubcats,
    selectedArtisans,
    priceRange,
    inStockOnly,
    sortBy,
  ]);

  return {
    categoryProducts,
    subcategories,
    categoryArtisans,
    filteredProducts,
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
  };
}
