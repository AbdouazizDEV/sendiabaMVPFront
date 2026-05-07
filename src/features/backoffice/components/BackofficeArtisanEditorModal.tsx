import { AnimatePresence, motion } from "framer-motion";
import type { ChangeEvent, FormEvent } from "react";

import { Button } from "@/components/ui/button";
import type { BackofficeArtisan, BackofficeArtisanStatus } from "@/services/backoffice-artisans-service";

export type BackofficeArtisanEditorModalProps = {
  open: boolean;
  draftArtisan: BackofficeArtisan | null;
  isSaving: boolean;
  onClose: () => void;
  onDraftChange: <K extends keyof BackofficeArtisan>(key: K, value: BackofficeArtisan[K]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onPhotoFileSelected: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function BackofficeArtisanEditorModal({
  open,
  draftArtisan,
  isSaving,
  onClose,
  onDraftChange,
  onSubmit,
  onPhotoFileSelected,
}: BackofficeArtisanEditorModalProps) {
  return (
    <AnimatePresence>
      {open && draftArtisan && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-border bg-background p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary">Edition artisan</p>
                <h2 className="mt-2 font-serif text-3xl">{draftArtisan.fullName}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{draftArtisan.id}</p>
              </div>
              <Button type="button" variant="outline" className="rounded-none uppercase tracking-[0.2em]" onClick={onClose}>
                Fermer
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
              <div className="space-y-3">
                <img
                  src={draftArtisan.photoUrl}
                  alt={draftArtisan.fullName}
                  className="h-52 w-full border border-border object-cover"
                />
                <input
                  type="url"
                  value={draftArtisan.photoUrl}
                  onChange={(event) => onDraftChange("photoUrl", event.target.value)}
                  placeholder="URL de la photo"
                  className="h-10 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
                />
                <label className="block cursor-pointer border border-border px-3 py-2 text-center text-xs uppercase tracking-[0.18em]">
                  Importer une photo
                  <input type="file" accept="image/*" className="hidden" onChange={onPhotoFileSelected} />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Nom complet</span>
                  <input
                    type="text"
                    value={draftArtisan.fullName}
                    onChange={(event) => onDraftChange("fullName", event.target.value)}
                    className="h-10 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Metier</span>
                  <input
                    type="text"
                    value={draftArtisan.craft}
                    onChange={(event) => onDraftChange("craft", event.target.value)}
                    className="h-10 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Email</span>
                  <input
                    type="email"
                    value={draftArtisan.email}
                    onChange={(event) => onDraftChange("email", event.target.value)}
                    className="h-10 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Telephone</span>
                  <input
                    type="text"
                    value={draftArtisan.phone}
                    onChange={(event) => onDraftChange("phone", event.target.value)}
                    className="h-10 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Ville</span>
                  <input
                    type="text"
                    value={draftArtisan.city}
                    onChange={(event) => onDraftChange("city", event.target.value)}
                    className="h-10 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Statut</span>
                  <select
                    value={draftArtisan.status}
                    onChange={(event) =>
                      onDraftChange("status", event.target.value as BackofficeArtisanStatus)
                    }
                    className="h-10 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
                  >
                    <option value="Actif">Actif</option>
                    <option value="En attente">En attente</option>
                    <option value="Suspendu">Suspendu</option>
                  </select>
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Biographie</span>
                  <textarea
                    value={draftArtisan.bio ?? ""}
                    onChange={(event) => onDraftChange("bio", event.target.value)}
                    className="min-h-28 w-full border border-border bg-background/80 px-3 py-2 text-sm outline-none focus:border-primary/70"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" className="rounded-none uppercase tracking-[0.2em]" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSaving} className="rounded-none uppercase tracking-[0.2em]">
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
