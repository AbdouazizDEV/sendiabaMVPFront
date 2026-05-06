import { ChevronLeft } from "lucide-react";
import { Link, useLocation } from "wouter";

import { Button } from "@/components/ui/button";

export function AdminBackButton() {
  const [location] = useLocation();
  const isDashboardRoot = location === "/backoffice" || location === "/backoffice/";

  const href = isDashboardRoot ? "/" : "/backoffice";
  const label = isDashboardRoot ? "Retour au site" : "Retour au tableau de bord";

  return (
    <div className="mb-4">
      <Link href={href}>
        <Button
          type="button"
          variant="ghost"
          className="h-9 gap-2 rounded-none px-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
          {label}
        </Button>
      </Link>
    </div>
  );
}
