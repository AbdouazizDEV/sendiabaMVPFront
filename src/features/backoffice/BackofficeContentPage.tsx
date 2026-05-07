import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "wouter";

import { getServices } from "@/app/di/services";
import { useAuth } from "@/app/state";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import type { BackofficeContentEntryDetail, BackofficeContentListItem } from "@/services/backoffice-content-service";
import { effectiveValueFromListItem } from "@/services/backoffice-content-service";

import { AdminBackButton } from "./components/AdminBackButton";

const PAGE_SIZE = 30;

function isImageEntryKey(key: string, label: string): boolean {
  const k = key.toLowerCase();
  const l = label.toLowerCase();
  if (l.includes("image") || l.includes("photo") || l.includes("banniere")) return true;
  if (k.includes("imageurl") || k.includes("backgroundimage") || k.includes(".image")) return true;
  if ((k.includes("image") || k.includes("photo")) && k.includes("url")) return true;
  return false;
}

export default function BackofficeContentPage() {
  const { session, isAuthenticated } = useAuth();
  const { authService, backofficeContentService } = getServices();
  const isAdmin = isAuthenticated && session?.role === "admin";

  const [scopeFilter, setScopeFilter] = useState<string>("Tous");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const [items, setItems] = useState<BackofficeContentListItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [rowDrafts, setRowDrafts] = useState<Record<string, string>>({});
  const [baselineByKey, setBaselineByKey] = useState<Record<string, string>>({});

  const [isLoading, setIsLoading] = useState(true);
  const [isBulkSaving, setIsBulkSaving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [editingDetail, setEditingDetail] = useState<BackofficeContentEntryDetail | null>(null);
  const [editorLoading, setEditorLoading] = useState(false);
  const [draftValue, setDraftValue] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchQuery(searchInput), 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, scopeFilter]);

  const scopeForApi = scopeFilter === "Tous" ? undefined : scopeFilter;

  const loadPage = useCallback(async () => {
    const accessToken = authService.getAccessToken();
    if (!accessToken) {
      setErrorMessage("Session invalide. Veuillez vous reconnecter.");
      return;
    }
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await backofficeContentService.list(accessToken, {
        scope: scopeForApi,
        search: searchQuery.trim() || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setItems(data.items);
      setPagination(data.pagination);
      const baseline: Record<string, string> = {};
      for (const it of data.items) {
        baseline[it.key] = effectiveValueFromListItem(it);
      }
      setBaselineByKey(baseline);
      setRowDrafts({ ...baseline });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible de charger le contenu administrateur.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [authService, backofficeContentService, page, scopeForApi, searchQuery]);

  useEffect(() => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }
    void loadPage();
  }, [isAdmin, loadPage]);

  const dirtyCount = useMemo(() => {
    return items.filter((it) => (rowDrafts[it.key] ?? "") !== (baselineByKey[it.key] ?? "")).length;
  }, [items, rowDrafts, baselineByKey]);

  const updateRowDraft = (key: string, value: string) => {
    setRowDrafts((prev) => ({ ...prev, [key]: value }));
  };

  const saveAllDirty = async () => {
    const accessToken = authService.getAccessToken();
    if (!accessToken || dirtyCount === 0) return;
    try {
      setIsBulkSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      const bulkItems = items
        .filter((it) => (rowDrafts[it.key] ?? "") !== (baselineByKey[it.key] ?? ""))
        .map((it) => ({
          key: it.key,
          value: rowDrafts[it.key] ?? "",
          scope: it.scope,
          label: it.label,
          defaultValue: it.defaultValue,
        }));
      const result = await backofficeContentService.bulkUpdate(accessToken, bulkItems);
      setSuccessMessage(`${result.updatedCount} entree(s) enregistree(s).`);
      await loadPage();
    } catch (error) {
      setSuccessMessage(null);
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible d'enregistrer en masse.",
      );
    } finally {
      setIsBulkSaving(false);
    }
  };

  const openEditor = async (entry: BackofficeContentListItem) => {
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;
    setEditorLoading(true);
    setEditingDetail(null);
    setDraftValue(effectiveValueFromListItem(entry));
    setErrorMessage(null);
    try {
      const detail = await backofficeContentService.getByKey(accessToken, entry.key);
      setEditingDetail(detail);
      setDraftValue(detail.effectiveValue);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible de charger le detail de l'entree.",
      );
    } finally {
      setEditorLoading(false);
    }
  };

  const closeEditor = () => {
    setEditingDetail(null);
    setDraftValue("");
    setEditorLoading(false);
  };

  const saveEntry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingDetail) return;
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;
    try {
      setIsSaving(true);
      setErrorMessage(null);
      await backofficeContentService.updateEntry(accessToken, editingDetail.key, {
        value: draftValue,
        scope: editingDetail.scope,
        label: editingDetail.label,
        defaultValue: editingDetail.defaultValue,
      });
      setSuccessMessage("Contenu mis a jour.");
      closeEditor();
      await loadPage();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible d'enregistrer cette entree.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefault = async () => {
    if (!editingDetail) return;
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;
    try {
      setIsResetting(true);
      setErrorMessage(null);
      await backofficeContentService.deleteOverride(accessToken, editingDetail.key);
      setSuccessMessage("Personnalisation supprimee.");
      closeEditor();
      await loadPage();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible de reinitialiser cette entree.",
      );
    } finally {
      setIsResetting(false);
    }
  };

  const onPickImage = async (file: File | null) => {
    if (!file || !editingDetail) return;
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;
    try {
      setIsUploadingImage(true);
      setErrorMessage(null);
      const data = await backofficeContentService.uploadEntryImage(
        accessToken,
        editingDetail.key,
        file,
        {
          scope: editingDetail.scope,
          label: editingDetail.label,
          defaultValue: editingDetail.defaultValue,
        },
      );
      setDraftValue(data.effectiveValue);
      setSuccessMessage("Image importee.");
      await loadPage();
      const refreshed = await backofficeContentService.getByKey(accessToken, editingDetail.key);
      setEditingDetail(refreshed);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible d'importer l'image.",
      );
    } finally {
      setIsUploadingImage(false);
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

  if (isLoading && items.length === 0) {
    return (
      <main className="min-h-screen bg-background px-6 pb-16 pt-32 md:px-12">
        <Navbar />
        <div className="mx-auto max-w-7xl">
          <AdminBackButton />
          <p className="text-muted-foreground">Chargement du contenu...</p>
        </div>
      </main>
    );
  }

  const modalTitle = editingDetail?.label ?? "";

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
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Back-office / Contenu</p>
          <h1 className="mt-4 font-serif text-5xl">Gestion de contenu</h1>
          <p className="mt-3 text-muted-foreground">
            Filtres et pagination cote serveur. Enregistrez plusieurs lignes modifiees avec un seul envoi.
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

        {isLoading && items.length > 0 && (
          <p className="text-xs text-muted-foreground">Actualisation de la page...</p>
        )}

        <section className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end">
          <div className="min-w-0 flex-1 border border-border bg-card/40 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recherche</p>
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Cle, label, texte..."
              className="mt-2 h-11 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
            />
          </div>
          <div className="w-full border border-border bg-card/40 p-4 md:w-48">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Scope</p>
            <select
              value={scopeFilter}
              onChange={(event) => setScopeFilter(event.target.value)}
              className="mt-2 h-11 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
            >
              <option value="Tous">Tous</option>
              <option value="home">home</option>
              <option value="cart">cart</option>
              <option value="category">category</option>
              <option value="collections">collections</option>
              <option value="artisans">artisans</option>
              <option value="checkout">checkout</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              className="rounded-none uppercase tracking-[0.2em]"
              disabled={isBulkSaving || dirtyCount === 0 || isLoading}
              onClick={() => void saveAllDirty()}
            >
              {isBulkSaving ? "Enregistrement..." : `Enregistrer tout (${dirtyCount})`}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-none uppercase tracking-[0.2em]"
              disabled={isLoading}
              onClick={() => void loadPage()}
            >
              Actualiser
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {items.map((entry, index) => (
            <motion.article
              key={entry.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="border border-border bg-card/35 p-5"
            >
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{entry.scope}</p>
                <h3 className="font-serif text-2xl">{entry.label}</h3>
                <p className="text-xs text-muted-foreground">{entry.key}</p>
                <textarea
                  value={rowDrafts[entry.key] ?? ""}
                  onChange={(event) => updateRowDraft(entry.key, event.target.value)}
                  rows={4}
                  className="w-full border border-border bg-background/80 px-3 py-2 text-sm outline-none focus:border-primary/70"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <p className="text-xs text-muted-foreground">
                    {entry.isCustomized ? "Personnalise" : "Valeur par defaut"}
                    {(rowDrafts[entry.key] ?? "") !== (baselineByKey[entry.key] ?? "") ? " · Modifie" : ""}
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-none uppercase tracking-[0.18em]"
                    onClick={() => void openEditor(entry)}
                  >
                    Detail
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
          {items.length === 0 && (
            <div className="border border-border px-4 py-10 text-center text-sm text-muted-foreground xl:col-span-2">
              Aucune entree sur cette page.
            </div>
          )}
        </section>

        {pagination.totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border border-border bg-card/20 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} / {pagination.totalPages} · {pagination.total} entree(s)
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-none uppercase tracking-[0.15em]"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Precedent
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-none uppercase tracking-[0.15em]"
                disabled={page >= pagination.totalPages || isLoading}
                onClick={() => setPage((p) => p + 1)}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {(editingDetail || editorLoading) && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEditor}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-border bg-background p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              {editorLoading && (
                <p className="text-sm text-muted-foreground">Chargement du detail...</p>
              )}
              {editingDetail && (
                <form onSubmit={(e) => void saveEntry(e)}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-primary">Edition contenu</p>
                      <h2 className="mt-2 font-serif text-3xl">{modalTitle}</h2>
                      <p className="text-xs text-muted-foreground">{editingDetail.key}</p>
                      {editingDetail.updatedAt && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Derniere mise a jour : {editingDetail.updatedAt}
                          {editingDetail.updatedBy
                            ? ` · ${editingDetail.updatedBy.displayName}`
                            : ""}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-none uppercase tracking-[0.2em]"
                      onClick={closeEditor}
                    >
                      Fermer
                    </Button>
                  </div>

                  <div className="mt-6 space-y-4">
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Valeur effective</span>
                      <textarea
                        value={draftValue}
                        onChange={(event) => setDraftValue(event.target.value)}
                        className="min-h-44 w-full border border-border bg-background/80 px-3 py-2 text-sm outline-none focus:border-primary/70"
                      />
                    </label>

                    {isImageEntryKey(editingDetail.key, editingDetail.label) && (
                      <div className="border border-border bg-card/30 p-3">
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Image (upload)</p>
                        <input
                          type="file"
                          accept="image/*"
                          className="mt-2 w-full text-sm"
                          disabled={isUploadingImage}
                          onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            void onPickImage(file);
                            event.target.value = "";
                          }}
                        />
                        {isUploadingImage && (
                          <p className="mt-2 text-xs text-muted-foreground">Import en cours...</p>
                        )}
                      </div>
                    )}

                    <div className="border border-border bg-card/30 p-3">
                      <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Valeur par defaut</p>
                      <p className="mt-2 text-sm">{editingDetail.defaultValue || "—"}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-none uppercase tracking-[0.2em]"
                      disabled={isResetting || isSaving || !editingDetail.isCustomized}
                      onClick={() => void resetToDefault()}
                    >
                      Reinitialiser
                    </Button>
                    <Button type="button" variant="outline" className="rounded-none uppercase tracking-[0.2em]" onClick={closeEditor}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={isSaving || isResetting} className="rounded-none uppercase tracking-[0.2em]">
                      {isSaving ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
