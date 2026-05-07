import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "wouter";

import { getServices } from "@/app/di/services";
import { useAuth } from "@/app/state";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import type { BackofficeCategory } from "@/services/backoffice-categories-service";

import { AdminBackButton } from "./components/AdminBackButton";

type FormState = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  sortOrder: string;
  file: File | null;
};

const emptyForm = (): FormState => ({
  slug: "",
  title: "",
  subtitle: "",
  description: "",
  href: "",
  sortOrder: "0",
  file: null,
});

export default function BackofficeCategoriesPage() {
  const { isAuthenticated, session } = useAuth();
  const { authService, backofficeCategoriesService } = getServices();
  const isAdmin = isAuthenticated && session?.role === "admin";

  const [categories, setCategories] = useState<BackofficeCategory[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<FormState>(emptyForm);
  const [isCreating, setIsCreating] = useState(false);

  const [editing, setEditing] = useState<BackofficeCategory | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setSearchQuery(searchInput), 300);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const loadCategories = useCallback(async () => {
    const token = authService.getAccessToken();
    if (!token) {
      setErrorMessage("Session invalide. Veuillez vous reconnecter.");
      return;
    }
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await backofficeCategoriesService.list(token, searchQuery.trim() || undefined);
      setCategories(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible de charger les categories.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [authService, backofficeCategoriesService, searchQuery]);

  useEffect(() => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }
    void loadCategories();
  }, [isAdmin, loadCategories]);

  const openEdit = (cat: BackofficeCategory) => {
    setEditing(cat);
    setEditForm({
      slug: cat.slug,
      title: cat.title,
      subtitle: cat.subtitle ?? "",
      description: cat.description ?? "",
      href: cat.href ?? "",
      sortOrder: String(cat.sortOrder),
      file: null,
    });
  };

  const submitCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = authService.getAccessToken();
    if (!token) return;
    try {
      setIsCreating(true);
      setErrorMessage(null);
      await backofficeCategoriesService.create(token, {
        slug: createForm.slug.trim(),
        title: createForm.title.trim(),
        subtitle: createForm.subtitle.trim() || undefined,
        description: createForm.description.trim() || undefined,
        href: createForm.href.trim() || undefined,
        sortOrder: Number.parseInt(createForm.sortOrder, 10) || 0,
        file: createForm.file,
      });
      setCreateOpen(false);
      setCreateForm(emptyForm());
      await loadCategories();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible de creer la categorie.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const submitEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const token = authService.getAccessToken();
    if (!token) return;
    try {
      setIsUpdating(true);
      setErrorMessage(null);
      await backofficeCategoriesService.update(token, editing.id, {
        slug: editForm.slug.trim(),
        title: editForm.title.trim(),
        subtitle: editForm.subtitle.trim() || undefined,
        description: editForm.description.trim() || undefined,
        href: editForm.href.trim() || undefined,
        sortOrder: Number.parseInt(editForm.sortOrder, 10) || 0,
        file: editForm.file,
      });
      setEditing(null);
      await loadCategories();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible de mettre a jour la categorie.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const removeCategory = async (id: string) => {
    const token = authService.getAccessToken();
    if (!token) return;
    if (!window.confirm("Supprimer cette categorie ?")) return;
    try {
      setDeletingId(id);
      setErrorMessage(null);
      await backofficeCategoriesService.delete(token, id);
      await loadCategories();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible de supprimer la categorie.",
      );
    } finally {
      setDeletingId(null);
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
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Back-office / Categories</p>
          <h1 className="mt-4 font-serif text-5xl">Gestion des categories</h1>
          <p className="mt-3 text-muted-foreground">
            Liste, creation, mise a jour (multipart) et suppression via l'API administrateur.
          </p>
          {errorMessage && (
            <p className="mt-4 border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          )}
        </header>

        <section className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="min-w-0 flex-1 border border-border bg-card/40 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recherche</p>
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Slug ou titre..."
              className="mt-2 h-11 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
            />
          </div>
          <Button
            type="button"
            className="rounded-none uppercase tracking-[0.2em]"
            onClick={() => {
              setCreateForm(emptyForm());
              setCreateOpen(true);
            }}
          >
            Nouvelle categorie
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-none uppercase tracking-[0.2em]"
            disabled={isLoading}
            onClick={() => void loadCategories()}
          >
            Actualiser
          </Button>
        </section>

        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : (
          <section className="overflow-x-auto border border-border">
            <div className="grid min-w-[640px] grid-cols-[1fr_1fr_0.7fr_0.6fr_auto] border-b border-border bg-muted/30 px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span>Titre</span>
              <span>Slug</span>
              <span>Produits</span>
              <span>Ordre</span>
              <span className="text-right">Actions</span>
            </div>
            <div>
              {categories.map((cat, index) => (
                <motion.article
                  key={cat.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="grid min-w-[640px] grid-cols-[1fr_1fr_0.7fr_0.6fr_auto] items-center gap-2 border-b border-border/70 px-4 py-4 text-sm"
                >
                  <div>
                    <p className="font-medium">{cat.title}</p>
                    {cat.imageUrl && (
                      <p className="truncate text-xs text-muted-foreground">{cat.imageUrl}</p>
                    )}
                  </div>
                  <p className="text-muted-foreground">{cat.slug}</p>
                  <p>{cat.productCount}</p>
                  <p>{cat.sortOrder}</p>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 rounded-none px-3 text-xs uppercase tracking-[0.15em]"
                      onClick={() => openEdit(cat)}
                    >
                      Modifier
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 rounded-none px-3 text-xs uppercase tracking-[0.15em] text-destructive hover:text-destructive"
                      disabled={deletingId === cat.id}
                      onClick={() => void removeCategory(cat.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </motion.article>
              ))}
              {categories.length === 0 && (
                <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                  Aucune categorie.
                </div>
              )}
            </div>
          </section>
        )}
      </motion.div>

      <AnimatePresence>
        {createOpen && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCreateOpen(false)}
          >
            <motion.form
              onSubmit={(e) => void submitCreate(e)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-border bg-background p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 className="font-serif text-2xl">Nouvelle categorie</h2>
              <div className="mt-4 grid gap-3">
                <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Slug *
                  <input
                    required
                    value={createForm.slug}
                    onChange={(e) => setCreateForm((f) => ({ ...f, slug: e.target.value }))}
                    className="mt-1 h-10 w-full border border-border bg-background px-2 text-sm"
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Titre *
                  <input
                    required
                    value={createForm.title}
                    onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
                    className="mt-1 h-10 w-full border border-border bg-background px-2 text-sm"
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Sous-titre
                  <input
                    value={createForm.subtitle}
                    onChange={(e) => setCreateForm((f) => ({ ...f, subtitle: e.target.value }))}
                    className="mt-1 h-10 w-full border border-border bg-background px-2 text-sm"
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Description
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className="mt-1 w-full border border-border bg-background px-2 py-1 text-sm"
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Lien (href)
                  <input
                    value={createForm.href}
                    onChange={(e) => setCreateForm((f) => ({ ...f, href: e.target.value }))}
                    className="mt-1 h-10 w-full border border-border bg-background px-2 text-sm"
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Ordre
                  <input
                    type="number"
                    value={createForm.sortOrder}
                    onChange={(e) => setCreateForm((f) => ({ ...f, sortOrder: e.target.value }))}
                    className="mt-1 h-10 w-full border border-border bg-background px-2 text-sm"
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Image
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 w-full text-sm"
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, file: e.target.files?.[0] ?? null }))
                    }
                  />
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button type="button" variant="outline" className="rounded-none uppercase tracking-[0.2em]" onClick={() => setCreateOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isCreating} className="rounded-none uppercase tracking-[0.2em]">
                  {isCreating ? "Creation..." : "Creer"}
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editing && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditing(null)}
          >
            <motion.form
              onSubmit={(e) => void submitEdit(e)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-border bg-background p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 className="font-serif text-2xl">Modifier {editing.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{editing.id}</p>
              <div className="mt-4 grid gap-3">
                <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Slug *
                  <input
                    required
                    value={editForm.slug}
                    onChange={(e) => setEditForm((f) => ({ ...f, slug: e.target.value }))}
                    className="mt-1 h-10 w-full border border-border bg-background px-2 text-sm"
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Titre *
                  <input
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                    className="mt-1 h-10 w-full border border-border bg-background px-2 text-sm"
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Sous-titre
                  <input
                    value={editForm.subtitle}
                    onChange={(e) => setEditForm((f) => ({ ...f, subtitle: e.target.value }))}
                    className="mt-1 h-10 w-full border border-border bg-background px-2 text-sm"
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Description
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className="mt-1 w-full border border-border bg-background px-2 py-1 text-sm"
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Lien (href)
                  <input
                    value={editForm.href}
                    onChange={(e) => setEditForm((f) => ({ ...f, href: e.target.value }))}
                    className="mt-1 h-10 w-full border border-border bg-background px-2 text-sm"
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Ordre
                  <input
                    type="number"
                    value={editForm.sortOrder}
                    onChange={(e) => setEditForm((f) => ({ ...f, sortOrder: e.target.value }))}
                    className="mt-1 h-10 w-full border border-border bg-background px-2 text-sm"
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Nouvelle image (optionnel)
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 w-full text-sm"
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, file: e.target.files?.[0] ?? null }))
                    }
                  />
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button type="button" variant="outline" className="rounded-none uppercase tracking-[0.2em]" onClick={() => setEditing(null)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isUpdating} className="rounded-none uppercase tracking-[0.2em]">
                  {isUpdating ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
