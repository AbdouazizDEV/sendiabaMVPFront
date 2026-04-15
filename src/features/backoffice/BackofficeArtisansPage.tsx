import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "wouter";

import { useAuth } from "@/app/state";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

type ArtisanStatus = "Actif" | "En attente" | "Suspendu";

type ArtisanProfile = {
  id: string;
  fullName: string;
  craft: string;
  city: string;
  email: string;
  phone: string;
  photoUrl: string;
  bio: string;
  status: ArtisanStatus;
};

const STATIC_ARTISANS: ArtisanProfile[] = [
  {
    id: "ART-3021",
    fullName: "Awa Ndiaye",
    craft: "Maroquinerie",
    city: "Dakar",
    email: "awa.ndiaye@sendiaba.com",
    phone: "+221 77 102 00 11",
    photoUrl:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
    bio: "Artisane specialisee dans les sacs et accessoires en cuir naturel.",
    status: "Actif",
  },
  {
    id: "ART-3022",
    fullName: "Cheikh Mbodj",
    craft: "Sculpture sur bois",
    city: "Saint-Louis",
    email: "cheikh.mbodj@sendiaba.com",
    phone: "+221 77 318 42 90",
    photoUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    bio: "Sculpteur traditionnel proposant des pieces decoratives contemporaines.",
    status: "En attente",
  },
  {
    id: "ART-3023",
    fullName: "Nene Faye",
    craft: "Textile",
    city: "Thies",
    email: "nene.faye@sendiaba.com",
    phone: "+221 76 490 18 33",
    photoUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    bio: "Creation de tissus artisanaux avec techniques de teinture locale.",
    status: "Actif",
  },
];

function statusClasses(status: ArtisanStatus): string {
  if (status === "Actif") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-700";
  if (status === "Suspendu") return "border-rose-500/40 bg-rose-500/10 text-rose-700";
  return "border-amber-500/40 bg-amber-500/10 text-amber-700";
}

export default function BackofficeArtisansPage() {
  const { session, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && session?.role === "admin";
  const [artisans, setArtisans] = useState<ArtisanProfile[]>(STATIC_ARTISANS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Tous" | ArtisanStatus>("Tous");
  const [editingArtisan, setEditingArtisan] = useState<ArtisanProfile | null>(null);
  const [draftArtisan, setDraftArtisan] = useState<ArtisanProfile | null>(null);

  const filteredArtisans = useMemo(() => {
    return artisans.filter((artisan) => {
      const bySearch =
        search.trim() === "" ||
        artisan.fullName.toLowerCase().includes(search.toLowerCase()) ||
        artisan.email.toLowerCase().includes(search.toLowerCase()) ||
        artisan.craft.toLowerCase().includes(search.toLowerCase());
      const byStatus = statusFilter === "Tous" || artisan.status === statusFilter;
      return bySearch && byStatus;
    });
  }, [artisans, search, statusFilter]);

  const openEditor = (artisan: ArtisanProfile) => {
    setEditingArtisan(artisan);
    setDraftArtisan({ ...artisan });
  };

  const closeEditor = () => {
    setEditingArtisan(null);
    setDraftArtisan(null);
  };

  const updateDraft = <K extends keyof ArtisanProfile>(key: K, value: ArtisanProfile[K]) => {
    if (!draftArtisan) return;
    setDraftArtisan({ ...draftArtisan, [key]: value });
  };

  const onPhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !draftArtisan) return;

    const reader = new FileReader();
    reader.onload = () => {
      const next = typeof reader.result === "string" ? reader.result : draftArtisan.photoUrl;
      setDraftArtisan((current) => (current ? { ...current, photoUrl: next } : current));
    };
    reader.readAsDataURL(file);
  };

  const onSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingArtisan || !draftArtisan) return;
    setArtisans((current) =>
      current.map((artisan) => (artisan.id === editingArtisan.id ? draftArtisan : artisan)),
    );
    closeEditor();
  };

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background px-6 py-20 md:px-12">
        <div className="mx-auto max-w-3xl border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Cette zone est reservee aux administrateurs.
          </p>
          <Link href="/">
            <Button className="mt-6 rounded-none uppercase tracking-[0.2em]">
              Retour a l'accueil
            </Button>
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
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Back-office / Artisans</p>
          <h1 className="mt-4 font-serif text-5xl">Gestion des artisans</h1>
          <p className="mt-3 text-muted-foreground">
            Modifiez les informations profil artisan, y compris la photo et les details publics.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="border border-border bg-card/40 p-4 md:col-span-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recherche</p>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nom, email ou metier..."
              className="mt-2 h-11 w-full border border-border bg-background/80 px-3 text-sm outline-none transition-colors focus:border-primary/70"
            />
          </div>
          <div className="border border-border bg-card/40 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Statut</p>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "Tous" | ArtisanStatus)}
              className="mt-2 h-11 w-full border border-border bg-background/80 px-3 text-sm outline-none transition-colors focus:border-primary/70"
            >
              <option value="Tous">Tous</option>
              <option value="Actif">Actif</option>
              <option value="En attente">En attente</option>
              <option value="Suspendu">Suspendu</option>
            </select>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredArtisans.map((artisan, index) => (
            <motion.article
              key={artisan.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="border border-border bg-card/35 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <img
                    src={artisan.photoUrl}
                    alt={artisan.fullName}
                    className="h-16 w-16 rounded-full border border-border object-cover"
                  />
                  <div>
                    <p className="font-medium">{artisan.fullName}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {artisan.craft}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{artisan.email}</p>
                  </div>
                </div>
                <span className={`inline-block border px-2 py-1 text-xs ${statusClasses(artisan.status)}`}>
                  {artisan.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                <p>Ville: {artisan.city}</p>
                <p>ID: {artisan.id}</p>
              </div>

              <div className="mt-5 flex justify-end">
                <Button
                  variant="outline"
                  className="rounded-none uppercase tracking-[0.18em]"
                  onClick={() => openEditor(artisan)}
                >
                  Modifier
                </Button>
              </div>
            </motion.article>
          ))}
          {filteredArtisans.length === 0 && (
            <div className="border border-border px-4 py-10 text-center text-sm text-muted-foreground xl:col-span-2">
              Aucun artisan ne correspond aux filtres.
            </div>
          )}
        </section>
      </motion.div>

      <AnimatePresence>
        {editingArtisan && draftArtisan && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEditor}
          >
            <motion.form
              onSubmit={onSave}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-3xl border border-border bg-background p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">Edition artisan</p>
                  <h2 className="mt-2 font-serif text-3xl">{draftArtisan.fullName}</h2>
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
                    onChange={(event) => updateDraft("photoUrl", event.target.value)}
                    placeholder="URL de la photo"
                    className="h-10 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
                  />
                  <label className="block border border-border px-3 py-2 text-center text-xs uppercase tracking-[0.18em]">
                    Importer une photo
                    <input type="file" accept="image/*" className="hidden" onChange={onPhotoUpload} />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Nom complet</span>
                    <input
                      type="text"
                      value={draftArtisan.fullName}
                      onChange={(event) => updateDraft("fullName", event.target.value)}
                      className="h-10 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Metier</span>
                    <input
                      type="text"
                      value={draftArtisan.craft}
                      onChange={(event) => updateDraft("craft", event.target.value)}
                      className="h-10 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Email</span>
                    <input
                      type="email"
                      value={draftArtisan.email}
                      onChange={(event) => updateDraft("email", event.target.value)}
                      className="h-10 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Telephone</span>
                    <input
                      type="text"
                      value={draftArtisan.phone}
                      onChange={(event) => updateDraft("phone", event.target.value)}
                      className="h-10 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Ville</span>
                    <input
                      type="text"
                      value={draftArtisan.city}
                      onChange={(event) => updateDraft("city", event.target.value)}
                      className="h-10 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Statut</span>
                    <select
                      value={draftArtisan.status}
                      onChange={(event) => updateDraft("status", event.target.value as ArtisanStatus)}
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
                      value={draftArtisan.bio}
                      onChange={(event) => updateDraft("bio", event.target.value)}
                      className="min-h-28 w-full border border-border bg-background/80 px-3 py-2 text-sm outline-none focus:border-primary/70"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none uppercase tracking-[0.2em]"
                  onClick={closeEditor}
                >
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
