import { useMemo, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";

import { useAuth } from "@/app/state";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

type StaticUser = {
  id: string;
  name: string;
  email: string;
  role: "Client" | "Artisan";
  status: "Actif" | "Inactif" | "Verification";
  city: string;
  joinedAt: string;
  totalOrders: number;
};

const STATIC_USERS: StaticUser[] = [
  {
    id: "USR-4012",
    name: "Aminata Diallo",
    email: "aminata@sendiaba.com",
    role: "Client",
    status: "Actif",
    city: "Dakar",
    joinedAt: "2026-02-03",
    totalOrders: 8,
  },
  {
    id: "USR-4013",
    name: "Mamadou Sarr",
    email: "mamadou@sendiaba.com",
    role: "Client",
    status: "Actif",
    city: "Dakar",
    joinedAt: "2026-02-03",
    totalOrders: 8,
  },
  {
    id: "USR-4014",
    name: "Ndeye Fall",
    email: "ndeye@sendiaba.com",
    role: "Artisan",
    status: "Verification",
    city: "Dakar",
    joinedAt: "2026-01-18",
    totalOrders: 12,
  },
  {
    id: "USR-4015",
    name: "Fatou Mbaye",
    email: "fatou@sendiaba.com",
    role: "Client",
    status: "Inactif",
    city: "Thies",
    joinedAt: "2025-12-10",
    totalOrders: 5,
  },
  {
    id: "USR-4016",
    name: "Amadou Diop",
    email: "amadou@sendiaba.com",
    role: "Artisan",
    status: "Actif",
    city: "Dakar",
    joinedAt: "2026-02-03",
    totalOrders: 8,
  },
  {
    id: "USR-4017",
    name: "Khadija Gueye",
    email: "khadija@sendiaba.com",
    role: "Client",
    status: "Actif",
    city: "Dakar",
    joinedAt: "2026-02-03",
    totalOrders: 8,
  },
];

function statusClasses(status: string): string {
  if (status === "Actif") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-700";
  if (status === "Inactif") return "border-zinc-500/40 bg-zinc-500/10 text-zinc-700";
  return "border-amber-500/40 bg-amber-500/10 text-amber-700";
}

export default function BackofficeUsersPage() {
  const { session, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && session?.role === "admin";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<"Tous" | StaticUser["role"]>("Tous");
  const [selectedStatus, setSelectedStatus] = useState<"Tous" | StaticUser["status"]>("Tous");
  const [selectedUser, setSelectedUser] = useState<StaticUser | null>(null);

  const filteredUsers = useMemo(() => {
    return STATIC_USERS.filter((user) => {
      const byQuery =
        searchQuery.trim() === "" ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());

      const byRole = selectedRole === "Tous" || user.role === selectedRole;
      const byStatus = selectedStatus === "Tous" || user.status === selectedStatus;

      return byQuery && byRole && byStatus;
    });
  }, [searchQuery, selectedRole, selectedStatus]);

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
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Back-office / Utilisateurs</p>
          <h1 className="mt-4 font-serif text-5xl">Gestion des utilisateurs</h1>
          <p className="mt-3 text-muted-foreground">
            Vue statique de l'interface administrateur pour organiser les comptes.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="border border-border bg-card/40 p-4 md:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recherche</p>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Rechercher par nom, email ou ID..."
              className="mt-2 h-11 w-full border border-border bg-background/80 px-3 text-sm outline-none transition-colors focus:border-primary/70"
            />
          </div>
          <div className="border border-border bg-card/40 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Role</p>
            <select
              value={selectedRole}
              onChange={(event) =>
                setSelectedRole(event.target.value as "Tous" | StaticUser["role"])
              }
              className="mt-2 h-11 w-full border border-border bg-background/80 px-3 text-sm outline-none transition-colors focus:border-primary/70"
            >
              <option value="Tous">Tous les roles</option>
              <option value="Client">Client</option>
              <option value="Artisan">Artisan</option>
            </select>
          </div>
          <div className="border border-border bg-card/40 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Statut</p>
            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.target.value as "Tous" | StaticUser["status"])
              }
              className="mt-2 h-11 w-full border border-border bg-background/80 px-3 text-sm outline-none transition-colors focus:border-primary/70"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="Verification">Verification</option>
            </select>
          </div>
        </section>

        <section className="overflow-hidden border border-border">
          <div className="grid grid-cols-[1.1fr_1.2fr_0.8fr_0.7fr_0.8fr] border-b border-border bg-muted/30 px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span>Nom</span>
            <span>Email</span>
            <span>Role</span>
            <span>Statut</span>
            <span className="text-right">Actions</span>
          </div>
          <div>
            {filteredUsers.map((user, index) => (
              <motion.article
                key={user.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="grid grid-cols-[1.1fr_1.2fr_0.8fr_0.7fr_0.8fr] items-center border-b border-border/70 px-4 py-4 text-sm"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.id}</p>
                </div>
                <p className="text-muted-foreground">{user.email}</p>
                <p>{user.role}</p>
                <span className={`inline-block border px-2 py-1 text-xs ${statusClasses(user.status)}`}>
                  {user.status}
                </span>
                <div className="text-right">
                  <Button
                    variant="outline"
                    className="h-8 rounded-none px-3 text-xs uppercase tracking-[0.18em]"
                    onClick={() => setSelectedUser(user)}
                  >
                    Voir
                  </Button>
                </div>
              </motion.article>
            ))}
            {filteredUsers.length === 0 && (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                Aucun utilisateur ne correspond a vos filtres.
              </div>
            )}
          </div>
        </section>
      </motion.div>

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl border border-border bg-background p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">Detail utilisateur</p>
                  <h2 className="mt-2 font-serif text-3xl">{selectedUser.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedUser.id}</p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-none px-3 text-xs uppercase tracking-[0.2em]"
                  onClick={() => setSelectedUser(null)}
                >
                  Fermer
                </Button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border border-border bg-card/35 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Email</p>
                  <p className="mt-2 text-sm">{selectedUser.email}</p>
                </div>
                <div className="border border-border bg-card/35 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Role</p>
                  <p className="mt-2 text-sm">{selectedUser.role}</p>
                </div>
                <div className="border border-border bg-card/35 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Statut</p>
                  <span
                    className={`mt-2 inline-block border px-2 py-1 text-xs ${statusClasses(selectedUser.status)}`}
                  >
                    {selectedUser.status}
                  </span>
                </div>
                <div className="border border-border bg-card/35 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Ville</p>
                  <p className="mt-2 text-sm">{selectedUser.city}</p>
                </div>
                <div className="border border-border bg-card/35 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Inscrit le</p>
                  <p className="mt-2 text-sm">{selectedUser.joinedAt}</p>
                </div>
                <div className="border border-border bg-card/35 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Commandes</p>
                  <p className="mt-2 text-sm">{selectedUser.totalOrders}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
