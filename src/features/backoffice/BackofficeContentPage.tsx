import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "wouter";

import { getServices } from "@/app/di/services";
import { useAuth } from "@/app/state";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  MANAGED_CONTENT_ENTRIES,
  type ManagedContentEntry,
} from "@/content/managed-content";

import { AdminBackButton } from "./components/AdminBackButton";

type RemoteEntry = {
  value: string;
  isOverridden?: boolean;
};

export default function BackofficeContentPage() {
  const { session, isAuthenticated } = useAuth();
  const { authService, backofficeContentService } = getServices();
  const isAdmin = isAuthenticated && session?.role === "admin";

  const [pageFilter, setPageFilter] = useState<"Tous" | ManagedContentEntry["scope"]>("Tous");
  const [search, setSearch] = useState("");
  const [editingEntry, setEditingEntry] = useState<ManagedContentEntry | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [remoteByKey, setRemoteByKey] = useState<Record<string, RemoteEntry>>({});
  const [remoteMeta, setRemoteMeta] = useState<Record<string, { scope?: string; label?: string }>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    const accessToken = authService.getAccessToken();
    if (!accessToken) {
      setErrorMessage("Session invalide. Veuillez vous reconnecter.");
      return;
    }
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const rows = await backofficeContentService.list(accessToken);
      const next: Record<string, RemoteEntry> = {};
      const meta: Record<string, { scope?: string; label?: string }> = {};
      for (const row of rows) {
        next[row.key] = {
          value: row.value,
          isOverridden: row.isOverridden,
        };
        meta[row.key] = { scope: row.scope, label: row.label };
      }
      setRemoteByKey(next);
      setRemoteMeta(meta);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible de charger le contenu administrateur.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [authService, backofficeContentService]);

  useEffect(() => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }
    void loadEntries();
  }, [isAdmin, loadEntries]);

  const allEntries = useMemo((): ManagedContentEntry[] => {
    const known = new Set(MANAGED_CONTENT_ENTRIES.map((e) => e.key));
    const extra: ManagedContentEntry[] = [];
    for (const key of Object.keys(remoteByKey)) {
      if (!known.has(key)) {
        extra.push({
          key,
          scope: remoteMeta[key]?.scope ?? "autre",
          label: remoteMeta[key]?.label ?? key,
          defaultValue: "",
        });
      }
    }
    return [...MANAGED_CONTENT_ENTRIES, ...extra];
  }, [remoteByKey, remoteMeta]);

  const resolveDisplay = useCallback(
    (entry: ManagedContentEntry): string => {
      const remote = remoteByKey[entry.key];
      if (remote) return remote.value;
      return entry.defaultValue;
    },
    [remoteByKey],
  );

  const isPersonalized = useCallback(
    (entry: ManagedContentEntry): boolean => {
      const remote = remoteByKey[entry.key];
      if (!remote) return false;
      if (typeof remote.isOverridden === "boolean") return remote.isOverridden;
      return remote.value !== entry.defaultValue;
    },
    [remoteByKey],
  );

  const filteredEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      const byPage = pageFilter === "Tous" || entry.scope === pageFilter;
      const display = resolveDisplay(entry);
      const bySearch =
        search.trim() === "" ||
        entry.label.toLowerCase().includes(search.toLowerCase()) ||
        entry.key.toLowerCase().includes(search.toLowerCase()) ||
        display.toLowerCase().includes(search.toLowerCase()) ||
        entry.defaultValue.toLowerCase().includes(search.toLowerCase());
      return byPage && bySearch;
    });
  }, [allEntries, pageFilter, resolveDisplay, search]);

  const openEditor = (entry: ManagedContentEntry) => {
    setEditingEntry(entry);
    setDraftValue(resolveDisplay(entry));
  };

  const closeEditor = () => {
    setEditingEntry(null);
    setDraftValue("");
  };

  const saveEntry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingEntry) return;
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;
    try {
      setIsSaving(true);
      setErrorMessage(null);
      const updated = await backofficeContentService.updateEntry(
        accessToken,
        editingEntry.key,
        draftValue,
      );
      setRemoteByKey((prev) => ({
        ...prev,
        [editingEntry.key]: {
          value: updated.value,
          isOverridden: updated.isOverridden ?? true,
        },
      }));
      closeEditor();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible d'enregistrer cette entree.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefault = async () => {
    if (!editingEntry) return;
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;
    try {
      setIsResetting(true);
      setErrorMessage(null);
      await backofficeContentService.deleteOverride(accessToken, editingEntry.key);
      await loadEntries();
      closeEditor();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible de reinitialiser cette entree.",
      );
    } finally {
      setIsResetting(false);
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

  if (isLoading) {
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
            Contenu synchronise avec l'API administrateur (cles locales pour les libelles et valeurs par defaut).
          </p>
          {errorMessage && (
            <p className="mt-4 border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          )}
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="border border-border bg-card/40 p-4 md:col-span-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recherche de contenu</p>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Label, cle ou texte..."
              className="mt-2 h-11 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
            />
          </div>
          <div className="border border-border bg-card/40 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Page</p>
            <select
              value={pageFilter}
              onChange={(event) =>
                setPageFilter(event.target.value as "Tous" | ManagedContentEntry["scope"])
              }
              className="mt-2 h-11 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
            >
              <option value="Tous">Toutes</option>
              <option value="home">Accueil</option>
              <option value="cart">Panier</option>
              <option value="category">Categorie</option>
              <option value="collections">Collections</option>
              <option value="artisans">Artisans</option>
              <option value="checkout">Checkout</option>
              <option value="autre">Autres cles</option>
            </select>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredEntries.map((entry, index) => (
            <motion.article
              key={entry.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="border border-border bg-card/35 p-5"
            >
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{entry.scope}</p>
                <h3 className="font-serif text-2xl">{entry.label}</h3>
                <p className="text-xs text-muted-foreground">{entry.key}</p>
                <p className="line-clamp-3 text-sm">{resolveDisplay(entry)}</p>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    {isPersonalized(entry) ? "Personnalise" : "Valeur par defaut"}
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-none uppercase tracking-[0.18em]"
                    onClick={() => openEditor(entry)}
                  >
                    Modifier
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
          {filteredEntries.length === 0 && (
            <div className="border border-border px-4 py-10 text-center text-sm text-muted-foreground xl:col-span-2">
              Aucun contenu ne correspond aux filtres.
            </div>
          )}
        </section>
      </motion.div>

      <AnimatePresence>
        {editingEntry && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEditor}
          >
            <motion.form
              onSubmit={(e) => void saveEntry(e)}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-4xl border border-border bg-background p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">Edition contenu</p>
                  <h2 className="mt-2 font-serif text-3xl">{editingEntry.label}</h2>
                  <p className="text-xs text-muted-foreground">{editingEntry.key}</p>
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
                  <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Texte editable</span>
                  <textarea
                    value={draftValue}
                    onChange={(event) => setDraftValue(event.target.value)}
                    className="min-h-44 w-full border border-border bg-background/80 px-3 py-2 text-sm outline-none focus:border-primary/70"
                  />
                </label>
                <div className="border border-border bg-card/30 p-3">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Valeur par defaut (reference)</p>
                  <p className="mt-2 text-sm">{editingEntry.defaultValue || "—"}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none uppercase tracking-[0.2em]"
                  disabled={isResetting || isSaving || !isPersonalized(editingEntry)}
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
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
