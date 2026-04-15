import { X } from "lucide-react";

import type { Artisan } from "@/domain/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

import type { PriceRangeFilter } from "../hooks/useCategoryFilters";

type CategoryFiltersPanelProps = {
  subcategories: string[];
  categoryArtisans: Artisan[];
  selectedSubcats: string[];
  selectedArtisans: string[];
  priceRange: PriceRangeFilter;
  inStockOnly: boolean;
  activeFiltersCount: number;
  onToggleSubcat: (subcat: string) => void;
  onToggleArtisan: (id: string) => void;
  onPriceRangeChange: (v: PriceRangeFilter) => void;
  onInStockChange: (v: boolean) => void;
  onReset: () => void;
};

export function CategoryFiltersPanel({
  subcategories,
  categoryArtisans,
  selectedSubcats,
  selectedArtisans,
  priceRange,
  inStockOnly,
  activeFiltersCount,
  onToggleSubcat,
  onToggleArtisan,
  onPriceRangeChange,
  onInStockChange,
  onReset,
}: CategoryFiltersPanelProps) {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest">Filtres</h3>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <X size={12} /> Réinitialiser
          </button>
        )}
      </div>

      <div>
        <h4 className="text-sm font-medium uppercase tracking-widest mb-4">Catégories</h4>
        <div className="space-y-3">
          {subcategories.map((subcat) => (
            <div key={subcat} className="flex items-center space-x-3">
              <Checkbox
                id={`cat-${subcat}`}
                checked={selectedSubcats.includes(subcat)}
                onCheckedChange={() => onToggleSubcat(subcat)}
                className="rounded-none border-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`cat-${subcat}`}
                className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              >
                {subcat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t border-border">
        <h4 className="text-sm font-medium uppercase tracking-widest mb-4">Artisans</h4>
        <div className="space-y-3">
          {categoryArtisans.map((artisan) => (
            <div key={artisan.id} className="flex items-center space-x-3">
              <Checkbox
                id={`art-${artisan.id}`}
                checked={selectedArtisans.includes(artisan.id)}
                onCheckedChange={() => onToggleArtisan(artisan.id)}
                className="rounded-none border-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`art-${artisan.id}`}
                className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              >
                {artisan.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t border-border">
        <h4 className="text-sm font-medium uppercase tracking-widest mb-4">Prix</h4>
        <RadioGroup
          value={priceRange}
          onValueChange={(v) => onPriceRangeChange(v as PriceRangeFilter)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="all" id="r-all" />
            <Label htmlFor="r-all" className="text-sm font-normal cursor-pointer text-muted-foreground">
              Tous les prix
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="under100" id="r-1" />
            <Label htmlFor="r-1" className="text-sm font-normal cursor-pointer text-muted-foreground">
              Moins de 100€
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="100-250" id="r-2" />
            <Label htmlFor="r-2" className="text-sm font-normal cursor-pointer text-muted-foreground">
              100€ - 250€
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="250-500" id="r-3" />
            <Label htmlFor="r-3" className="text-sm font-normal cursor-pointer text-muted-foreground">
              250€ - 500€
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="over500" id="r-4" />
            <Label htmlFor="r-4" className="text-sm font-normal cursor-pointer text-muted-foreground">
              Plus de 500€
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="pt-8 border-t border-border flex items-center justify-between">
        <Label htmlFor="in-stock" className="text-sm font-medium uppercase tracking-widest cursor-pointer">
          En stock seulement
        </Label>
        <Switch id="in-stock" checked={inStockOnly} onCheckedChange={onInStockChange} />
      </div>
    </div>
  );
}
