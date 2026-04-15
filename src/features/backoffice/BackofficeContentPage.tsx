import { useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "wouter";

import { useAuth } from "@/app/state";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  MANAGED_CONTENT_ENTRIES,
  readContentOverrides,
  writeContentOverrides,
  type ManagedContentEntry,
} from "@/content/managed-content";

export default function BackofficeContentPage() {
  const { session, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && session?.role === "admin";

  const [pageFilter, setPageFilter] = useState<"Tous" | ManagedContentEntry["scope"]>("Tous");
  const [search, setSearch] = useState("");
  const [editingEntry, setEditingEntry] = useState<ManagedContentEntry | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [overrides, setOverrides] = useState<Record<string, string>>(() => readContentOverrides());

  const filteredEntries = useMemo(() => {
    return MANAGED_CONTENT_ENTRIES.filter((entry) => {
      const byPage = pageFilter === "Tous" || entry.scope === pageFilter;
      const bySearch =
        search.trim() === "" ||
        entry.label.toLowerCase().includes(search.toLowerCase()) ||
        entry.key.toLowerCase().includes(search.toLowerCase()) ||
        entry.defaultValue.toLowerCase().includes(search.toLowerCase());
      return byPage && bySearch;
    });
  }, [pageFilter, search]);

  const openEditor = (entry: ManagedContentEntry) => {
    setEditingEntry(entry);
    setDraftValue(overrides[entry.key] ?? entry.defaultValue);
  };

  const closeEditor = () => {
    setEditingEntry(null);
    setDraftValue("");
  };

  const saveEntry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingEntry) return;
    const next = { ...overrides, [editingEntry.key]: draftValue };
    setOverrides(next);
    writeContentOverrides(next);
    closeEditor();
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
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Back-office / Contenu</p>
          <h1 className="mt-4 font-serif text-5xl">Gestion de contenu</h1>
          <p className="mt-3 text-muted-foreground">
            Editez les textes des pages Home, Artisans, Panier, Categorie, Collections et Checkout.
          </p>
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
                <p className="line-clamp-3 text-sm">{overrides[entry.key] ?? entry.defaultValue}</p>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    {overrides[entry.key] ? "Personnalise" : "Valeur par defaut"}
                  </p>
                  <Button variant="outline" className="rounded-none uppercase tracking-[0.18em]" onClick={() => openEditor(entry)}>
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
              onSubmit={saveEntry}
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
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Valeur par defaut</p>
                  <p className="mt-2 text-sm">{editingEntry.defaultValue}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button type="button" variant="outline" className="rounded-none uppercase tracking-[0.2em]" onClick={closeEditor}>
                  Annuler
                </Button>
                <Button type="submit" className="rounded-none uppercase tracking-[0.2em]">
                  Enregistrer
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
