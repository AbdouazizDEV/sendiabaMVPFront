import { Link } from "wouter";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Artisan } from "@/domain/types";

type ProfileFavoriteArtisanCardProps = {
  artisans: readonly Artisan[];
  favoriteArtisan: Artisan | undefined;
  favoriteArtisanId?: string;
  onSelectFavoriteArtisan: (artisanId: string | undefined) => void;
};

export function ProfileFavoriteArtisanCard({
  artisans,
  favoriteArtisan,
  favoriteArtisanId,
  onSelectFavoriteArtisan,
}: ProfileFavoriteArtisanCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12 }}
      className="space-y-5 border border-border p-6"
    >
      <h2 className="font-serif text-3xl">Artisan favori</h2>

      <Select
        value={favoriteArtisanId ?? "none"}
        onValueChange={(value) => onSelectFavoriteArtisan(value === "none" ? undefined : value)}
      >
        <SelectTrigger className="h-11 rounded-none">
          <SelectValue placeholder="Choisir un artisan favori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Aucun artisan favori</SelectItem>
          {artisans.map((artisan) => (
            <SelectItem key={artisan.id} value={artisan.id}>
              {artisan.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {favoriteArtisan ? (
        <article className="grid grid-cols-[100px_1fr] gap-4 border border-border p-4">
          <img src={favoriteArtisan.image} alt={favoriteArtisan.name} className="h-24 w-24 object-cover" />
          <div>
            <p className="font-serif text-2xl">{favoriteArtisan.name}</p>
            <p className="text-sm text-muted-foreground">{favoriteArtisan.title} &mdash; {favoriteArtisan.location}</p>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{favoriteArtisan.bio}</p>
            <Link href={`/artisans/${favoriteArtisan.id}`}>
              <Button variant="link" className="h-auto p-0 pt-2 text-xs uppercase tracking-[0.2em]">
                Voir le profil artisan
              </Button>
            </Link>
          </div>
        </article>
      ) : (
        <p className="text-sm text-muted-foreground">Selectionnez un artisan pour voir ses informations ici.</p>
      )}
    </motion.section>
  );
}
