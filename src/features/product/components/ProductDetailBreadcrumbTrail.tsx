import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Product } from "@/domain/types";
import { CATEGORY_LABELS } from "@/content/collection-categories";

type ProductDetailBreadcrumbTrailProps = {
  product: Product;
};

export function ProductDetailBreadcrumbTrail({ product }: ProductDetailBreadcrumbTrailProps) {
  return (
    <Breadcrumb className="mb-10">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="text-[10px] uppercase tracking-widest hover:text-primary transition-colors">
            Accueil
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/collections" className="text-[10px] uppercase tracking-widest hover:text-primary transition-colors">
            Collections
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            href={`/collections/${product.category}`}
            className="text-[10px] uppercase tracking-widest hover:text-primary transition-colors"
          >
            {CATEGORY_LABELS[product.category]}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-[10px] uppercase tracking-widest text-foreground/60">{product.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
