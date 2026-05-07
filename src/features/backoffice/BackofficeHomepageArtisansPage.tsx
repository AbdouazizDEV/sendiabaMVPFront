import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";

import { getServices } from "@/app/di/services";
import { useAuth } from "@/app/state";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import type { BackofficeArtisan } from "@/services/backoffice-artisans-service";
import type { FeaturedHomepageArtisan } from "@/services/backoffice-homepage-featured-artisans-service";

import { AdminBackButton } from "./components/AdminBackButton";
import { BackofficeArtisanEditorModal } from "./components/BackofficeArtisanEditorModal";

function artisanToFeatured(artisan: BackofficeArtisan, sortOrder: number): FeaturedHomepageArtisan {
  return {
    sortOrder,
    publicId: "",
    userId: artisan.id,
    displayName: artisan.fullName,
    referenceCode: "",
    craft: artisan.craft,
    city: artisan.city,
    avatarUrl: artisan.photoUrl,
  };
}

function reindex(items: FeaturedHomepageArtisan[]): FeaturedHomepageArtisan[] {
  return items.map((item, index) => ({ ...item, sortOrder: index }));
}

function mergeFeaturedWithArtisan(
  featured: FeaturedHomepageArtisan[],
  updated: BackofficeArtisan,
): FeaturedHomepageArtisan[] {
  return featured.map((row) =>
    row.userId === updated.id
      ? {
          ...row,
          displayName: updated.fullName,
          craft: updated.craft,
          city: updated.city,
          avatarUrl: updated.photoUrl,
        }
      : row,
  );
}

export default function BackofficeHomepageArtisansPage() {
  const { session, isAuthenticated } = useAuth();
  const {
    authService,
    backofficeArtisansService,
    backofficeHomepageFeaturedArtisansService,
  } = getServices();
  const isAdmin = isAuthenticated && session?.role === "admin";

  const [featured, setFeatured] = useState<FeaturedHomepageArtisan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerResults, setPickerResults] = useState<BackofficeArtisan[]>([]);
  const [pickerLoading, setPickerLoading] = useState(false);

  const [editingArtisan, setEditingArtisan] = useState<BackofficeArtisan | null>(null);
  const [draftArtisan, setDraftArtisan] = useState<BackofficeArtisan | null>(null);
  const [isSavingArtisan, setIsSavingArtisan] = useState(false);

  const loadFeatured = useCallback(async () => {
    const token = authService.getAccessToken();
    if (!token) {
      setErrorMessage("Session invalide. Veuillez vous reconnecter.");
      return;
    }
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const rows = await backofficeHomepageFeaturedArtisansService.list(token);
      setFeatured(reindex(rows.sort((a, b) => a.sortOrder - b.sortOrder)));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible de charger la selection.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [authService, backofficeHomepageFeaturedArtisansService]);

  useEffect(() => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }
    void loadFeatured();
  }, [isAdmin, loadFeatured]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      const token = authService.getAccessToken();
      if (!token) return;
      try {
        setPickerLoading(true);
        const data = await backofficeArtisansService.list(token, {
          search: pickerSearch.trim() || undefined,
          status: "Actif",
          page: 1,
          limit: 15,
        });
        if (!cancelled) setPickerResults(data.items);
      } catch {
        if (!cancelled) setPickerResults([]);
      } finally {
        if (!cancelled) setPickerLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [authService, backofficeArtisansService, isAdmin, pickerSearch]);

  const selectedIds = new Set(featured.map((f) => f.userId));

  const openArtisanEditor = async (userId: string) => {
    const token = authService.getAccessToken();
    if (!token) {
      setErrorMessage("Session invalide. Veuillez vous reconnecter.");
      return;
    }
    try {
      const details = await backofficeArtisansService.getById(token, userId);
      setEditingArtisan(details);
      setDraftArtisan(details);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible de charger le detail artisan.",
      );
    }
  };

  const closeArtisanEditor = () => {
    setEditingArtisan(null);
    setDraftArtisan(null);
  };

  const updateDraft = <K extends keyof BackofficeArtisan>(key: K, value: BackofficeArtisan[K]) => {
    if (!draftArtisan) return;
    setDraftArtisan({ ...draftArtisan, [key]: value });
  };

  const onPhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const token = authService.getAccessToken();
    if (!file || !draftArtisan || !token) return;
    try {
      setIsSavingArtisan(true);
      const data = await backofficeArtisansService.uploadPhoto(token, draftArtisan.id, file);
      setDraftArtisan((current) => (current ? { ...current, photoUrl: data.photoUrl } : current));
      setFeatured((prev) =>
        mergeFeaturedWithArtisan(prev, { ...draftArtisan, photoUrl: data.photoUrl }),
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Upload photo impossible.");
    } finally {
      setIsSavingArtisan(false);
    }
  };

  const onSaveArtisan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = authService.getAccessToken();
    if (!editingArtisan || !draftArtisan || !token) return;
    try {
      setIsSavingArtisan(true);
      const updated = await backofficeArtisansService.update(token, editingArtisan.id, {
        fullName: draftArtisan.fullName,
        craft: draftArtisan.craft,
        city: draftArtisan.city,
        email: draftArtisan.email,
        phone: draftArtisan.phone,
        photoUrl: draftArtisan.photoUrl,
        bio: draftArtisan.bio,
        status: draftArtisan.status,
      });
      setFeatured((prev) => mergeFeaturedWithArtisan(prev, updated));
      setPickerResults((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a)),
      );
      setSuccessMessage("Fiche artisan mise a jour.");
      closeArtisanEditor();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Mise a jour artisan impossible.");
    } finally {
      setIsSavingArtisan(false);
    }
  };

  const addArtisan = (artisan: BackofficeArtisan) => {
    if (selectedIds.has(artisan.id)) return;
    setFeatured((prev) => reindex([...prev, artisanToFeatured(artisan, prev.length)]));
    setSuccessMessage(null);
  };

  const removeAt = (index: number) => {
    setFeatured((prev) => reindex(prev.filter((_, i) => i !== index)));
    setSuccessMessage(null);
  };

  const move = (index: number, delta: number) => {
    setFeatured((prev) => {
      const next = [...prev];
      const j = index + delta;
      if (j < 0 || j >= next.length) return prev;
      const tmp = next[index];
      next[index] = next[j]!;
      next[j] = tmp!;
      return reindex(next);
    });
    setSuccessMessage(null);
  };

  const save = async () => {
    const token = authService.getAccessToken();
    if (!token) return;
    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      const payload = featured.map((item, index) => ({
        userId: item.userId,
        sortOrder: index,
        ...(item.publicId ? { publicId: item.publicId } : {}),
      }));
      const updated = await backofficeHomepageFeaturedArtisansService.save(token, payload);
      setFeatured(reindex(updated.sort((a, b) => a.sortOrder - b.sortOrder)));
      setSuccessMessage("Selection enregistree. La section d'accueil affichera ces artisans.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible d'enregistrer la selection.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background px-6 py-20 md:px-12">
        <div className="mx-auto max-w-3xl border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">Cette zone est reservee aux administrateurs.</p>
          <Link href="/">
            <Button className="mt-6 rounded-none uppercase tracking-[0.2em]">Retour a l'accueil</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 pb-16 pt-32 md:px-12">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-7xl space-y-8"
      >
        <header className="border border-border bg-muted/20 p-8">
          <AdminBackButton />
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Back-office / Accueil</p>
          <h1 className="mt-4 font-serif text-5xl">Artisans mis en avant</h1>
          <p className="mt-3 text-muted-foreground">
            Cliquez sur un artisan pour ouvrir sa fiche (meme edition que dans{' '}
            <Link href="/backoffice/artisans" className="underline underline-offset-4">
              Gestion des artisans
            </Link>
            ). Enregistrez la selection pour publier l&apos;ordre sur la page d&apos;accueil (
            <code className="text-xs">GET /v1/home/artisans</code>).
          </p>
          {errorMessage && (
            <p className="mt-4 border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="mt-4 border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800">
              {successMessage}
            </p>
          )}
        </header>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            className="rounded-none uppercase tracking-[0.2em]"
            disabled={isSaving}
            onClick={() => void save()}
          >
            {isSaving ? "Enregistrement..." : "Enregistrer la selection"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-none uppercase tracking-[0.2em]"
            disabled={isLoading}
            onClick={() => void loadFeatured()}
          >
            Recharger depuis le serveur
          </Button>
        </div>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <div className="space-y-4 border border-border bg-card/30 p-6">
            <h2 className="font-serif text-2xl">Selection actuelle ({featured.length})</h2>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Chargement...</p>
            ) : featured.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun artisan selectionne : l&apos;API publique peut n&apos;afficher qu&apos;un jeu par defaut.
              </p>
            ) : (
              <ul className="space-y-3">
                {featured.map((item, index) => (
                  <li
                    key={item.userId}
                    className="flex flex-wrap items-center gap-3 border border-border bg-background/60 p-3"
                  >
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 cursor-pointer gap-3 rounded-sm text-left outline-none ring-offset-background transition hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-primary"
                      onClick={() => void openArtisanEditor(item.userId)}
                    >
                      <img
                        src={item.avatarUrl || "https://placehold.co/64x64"}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-full border border-border object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{item.displayName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.craft} · {item.city}
                          {item.publicId ? ` · ${item.publicId}` : ""}
                        </p>
                        <p className="truncate text-[10px] text-muted-foreground">{item.userId}</p>
                      </div>
                    </button>
                    <div className="flex flex-wrap gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="h-8 rounded-none px-2 text-xs"
                        onClick={() => void openArtisanEditor(item.userId)}
                      >
                        Modifier fiche
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-none px-2 text-xs"
                        disabled={index === 0}
                        onClick={() => move(index, -1)}
                      >
                        Haut
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-none px-2 text-xs"
                        disabled={index >= featured.length - 1}
                        onClick={() => move(index, 1)}
                      >
                        Bas
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 rounded-none px-2 text-xs text-destructive"
                        onClick={() => removeAt(index)}
                      >
                        Retirer
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-4 border border-border bg-card/30 p-6">
            <h2 className="font-serif text-2xl">Ajouter un artisan actif</h2>
            <input
              value={pickerSearch}
              onChange={(event) => setPickerSearch(event.target.value)}
              placeholder="Rechercher par nom, email, metier..."
              className="h-11 w-full border border-border bg-background px-3 text-sm outline-none focus:border-primary/70"
            />
            {pickerLoading ? (
              <p className="text-xs text-muted-foreground">Recherche...</p>
            ) : (
              <ul className="max-h-[420px] space-y-2 overflow-y-auto">
                {pickerResults.map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-center justify-between gap-2 border border-border/80 bg-background/50 px-3 py-2 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{a.fullName}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {a.craft} · {a.city}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-none text-xs uppercase tracking-[0.12em]"
                        onClick={() => void openArtisanEditor(a.id)}
                      >
                        Fiche
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="h-8 rounded-none text-xs uppercase tracking-[0.12em]"
                        disabled={selectedIds.has(a.id)}
                        onClick={() => addArtisan(a)}
                      >
                        {selectedIds.has(a.id) ? "Deja dans la liste" : "Ajouter"}
                      </Button>
                    </div>
                  </li>
                ))}
                {pickerResults.length === 0 && (
                  <p className="text-xs text-muted-foreground">Aucun resultat.</p>
                )}
              </ul>
            )}
          </div>
        </section>
      </motion.div>

      <BackofficeArtisanEditorModal
        open={Boolean(editingArtisan && draftArtisan)}
        draftArtisan={draftArtisan}
        isSaving={isSavingArtisan}
        onClose={closeArtisanEditor}
        onDraftChange={updateDraft}
        onSubmit={onSaveArtisan}
        onPhotoFileSelected={onPhotoUpload}
      />
    </main>
  );
}
