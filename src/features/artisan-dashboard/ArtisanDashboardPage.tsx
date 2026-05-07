import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "wouter";

import { getServices } from "@/app/di/services";
import { useAuth } from "@/app/state";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  ArtisanNotification,
  ArtisanOrder,
  ArtisanOrderTrackingEvent,
  ArtisanCustomer,
  ArtisanDashboardKpis,
  ArtisanMeProfile,
  ArtisanProduct,
  UpsertArtisanProductPayload,
} from "@/services/artisan-dashboard-service";

type ProductFormState = {
  id?: string;
  name: string;
  description: string;
  details: string;
  categorySlug: string;
  subcategorySlug: string;
  price: string;
  inStock: boolean;
  stockQuantity: string;
  tag: string;
  file: File | null;
};

const DEFAULT_FORM: ProductFormState = {
  name: "",
  description: "",
  details: "",
  categorySlug: "maroquinerie",
  subcategorySlug: "",
  price: "",
  inStock: true,
  stockQuantity: "20",
  tag: "",
  file: null,
};

const CATEGORY_OPTIONS = [
  { value: "maroquinerie", label: "Maroquinerie" },
  { value: "maison", label: "Maison" },
  { value: "decoration", label: "Decoration" },
  { value: "coffrets", label: "Coffrets" },
];

function toPayload(form: ProductFormState): UpsertArtisanProductPayload {
  const parsedStock = Number(form.stockQuantity);
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    details: form.details.trim(),
    categorySlug: form.categorySlug,
    subcategorySlug: form.subcategorySlug.trim() || undefined,
    price: Number(form.price),
    inStock: form.inStock,
    stockQuantity: Number.isFinite(parsedStock) ? Math.max(0, parsedStock) : 0,
    tag: form.tag.trim() || undefined,
    file: form.file ?? undefined,
  };
}

function orderStatusClass(status: string): string {
  if (status === "pending") return "border-amber-500/40 bg-amber-500/10 text-amber-700";
  if (status === "confirmed") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-700";
  if (status === "rejected") return "border-red-500/40 bg-red-500/10 text-red-700";
  if (status === "in_preparation") return "border-blue-500/40 bg-blue-500/10 text-blue-700";
  if (status === "shipped") return "border-violet-500/40 bg-violet-500/10 text-violet-700";
  if (status === "delivered") return "border-zinc-500/40 bg-zinc-500/10 text-zinc-700";
  return "border-border bg-muted/30 text-foreground";
}

export default function ArtisanDashboardPage() {
  const { session, isAuthenticated } = useAuth();
  const { authService, artisanDashboardService } = getServices();

  const isArtisan = isAuthenticated && session?.role === "artisan";

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [profile, setProfile] = useState<ArtisanMeProfile | null>(null);
  const [kpis, setKpis] = useState<ArtisanDashboardKpis | null>(null);
  const [products, setProducts] = useState<ArtisanProduct[]>([]);
  const [customers, setCustomers] = useState<ArtisanCustomer[]>([]);
  const [orders, setOrders] = useState<ArtisanOrder[]>([]);
  const [notifications, setNotifications] = useState<ArtisanNotification[]>([]);
  const [trackingEvents, setTrackingEvents] = useState<ArtisanOrderTrackingEvent[]>([]);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<string | null>(null);

  const [productSearch, setProductSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [inStockFilter, setInStockFilter] = useState<"all" | "true" | "false">("all");
  const [customersSearch, setCustomersSearch] = useState("");
  const [ordersSearch, setOrdersSearch] = useState("");
  const [ordersStatus, setOrdersStatus] = useState<string>("all");
  const [unreadOnlyNotifications, setUnreadOnlyNotifications] = useState(false);

  const [upsertOpen, setUpsertOpen] = useState(false);
  const [form, setForm] = useState<ProductFormState>(DEFAULT_FORM);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [promotionPercent, setPromotionPercent] = useState("20");
  const [promotionReason, setPromotionReason] = useState("Promo artisan");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const canSubmitForm = useMemo(() => {
    if (!form.name.trim()) return false;
    if (!form.description.trim()) return false;
    if (!form.price.trim()) return false;
    if (Number(form.price) <= 0) return false;
    if (Number(form.stockQuantity) < 0) return false;
    return true;
  }, [form]);

  const loadDashboardData = async () => {
    const accessToken = authService.getAccessToken();
    if (!accessToken) {
      setErrorMessage("Session invalide. Veuillez vous reconnecter.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const [me, dashboardKpis, productsRes, customersRes] = await Promise.all([
        artisanDashboardService.getMe(accessToken),
        artisanDashboardService.getKpis(accessToken),
        artisanDashboardService.listProducts(accessToken, {
          search: productSearch,
          category: categoryFilter === "all" ? undefined : categoryFilter,
          inStock:
            inStockFilter === "all"
              ? undefined
              : inStockFilter === "true",
          page: 1,
          limit: 20,
        }),
        artisanDashboardService.listCustomers(accessToken, {
          search: customersSearch,
          page: 1,
          limit: 20,
        }),
      ]);

      const [ordersRes, notificationsRes] = await Promise.all([
        artisanDashboardService.listOrders(accessToken, {
          search: ordersSearch,
          status: ordersStatus === "all" ? undefined : ordersStatus,
          page: 1,
          limit: 20,
        }),
        artisanDashboardService.listNotifications(accessToken, {
          unreadOnly: unreadOnlyNotifications,
          page: 1,
          limit: 20,
        }),
      ]);

      setProfile(me);
      setKpis(dashboardKpis);
      setProducts(productsRes.items);
      setCustomers(customersRes.items);
      setOrders(ordersRes.items);
      setNotifications(notificationsRes);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de charger le dashboard artisan.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isArtisan) {
      setIsLoading(false);
      return;
    }
    void loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isArtisan,
    categoryFilter,
    inStockFilter,
    productSearch,
    customersSearch,
    ordersSearch,
    ordersStatus,
    unreadOnlyNotifications,
  ]);

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setEditingProductId(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setUpsertOpen(true);
  };

  const openEditDialog = async (productId: string) => {
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;
    try {
      setErrorMessage(null);
      const product = await artisanDashboardService.getProductById(accessToken, productId);
      setEditingProductId(product.id);
      setForm({
        id: product.id,
        name: product.name,
        description: "",
        details: "",
        categorySlug: product.category,
        subcategorySlug: product.subcategory ?? "",
        price: String(product.price),
        inStock: product.inStock,
        stockQuantity: String(product.stockQuantity ?? 0),
        tag: product.tag ?? "",
        file: null,
      });
      setUpsertOpen(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible de charger le produit.",
      );
    }
  };

  const submitProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmitForm) return;
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;

    try {
      setIsSaving(true);
      setErrorMessage(null);
      const payload = toPayload(form);
      if (editingProductId) {
        await artisanDashboardService.updateProduct(accessToken, editingProductId, payload);
      } else {
        await artisanDashboardService.createProduct(accessToken, payload);
      }
      setUpsertOpen(false);
      resetForm();
      await loadDashboardData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible d'enregistrer le produit.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;
    try {
      setErrorMessage(null);
      await artisanDashboardService.deleteProduct(accessToken, productId);
      await loadDashboardData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Suppression du produit impossible.",
      );
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  const applyPromotionOnSelected = async () => {
    const accessToken = authService.getAccessToken();
    if (!accessToken || selectedProductIds.length === 0) return;
    try {
      setErrorMessage(null);
      await artisanDashboardService.applyPromotion(accessToken, {
        productIds: selectedProductIds,
        percent: Number(promotionPercent),
        reason: promotionReason.trim() || undefined,
      });
      await loadDashboardData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible d'appliquer la promotion.",
      );
    }
  };

  const cancelPromotionOnSelected = async () => {
    const accessToken = authService.getAccessToken();
    if (!accessToken || selectedProductIds.length === 0) return;
    try {
      setErrorMessage(null);
      await artisanDashboardService.cancelPromotion(accessToken, {
        productIds: selectedProductIds,
      });
      await loadDashboardData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible d'annuler la promotion.",
      );
    }
  };

  const applyStockUpdate = async (productId: string, stockQuantity: number) => {
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;
    try {
      setErrorMessage(null);
      await artisanDashboardService.updateStocks(accessToken, {
        items: [{ productId, stockQuantity }],
      });
      await loadDashboardData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Mise a jour du stock impossible.",
      );
    }
  };

  const updateOrderStatus = async (orderId: string, status: "confirmed" | "rejected") => {
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;
    try {
      setErrorMessage(null);
      await artisanDashboardService.updateOrderStatus(accessToken, orderId, {
        status,
        note: status === "confirmed" ? "Commande validee." : "Commande rejetee.",
      });
      await loadDashboardData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Mise a jour du statut impossible.",
      );
    }
  };

  const sendProgressMail = async (orderId: string) => {
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;
    try {
      setErrorMessage(null);
      await artisanDashboardService.sendOrderProgressMail(accessToken, orderId, {
        status: "in_preparation",
        message: "Votre commande est en preparation.",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Envoi de mail impossible.",
      );
    }
  };

  const openTracking = async (orderId: string) => {
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;
    try {
      setErrorMessage(null);
      const tracking = await artisanDashboardService.getOrderTracking(accessToken, orderId);
      setSelectedTrackingOrder(orderId);
      setTrackingEvents(tracking.events ?? []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Tracking commande indisponible.",
      );
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;
    try {
      await artisanDashboardService.markNotificationAsRead(accessToken, notificationId);
      await loadDashboardData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de marquer la notification comme lue.",
      );
    }
  };

  const markAllNotificationsRead = async () => {
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;
    try {
      await artisanDashboardService.markAllNotificationsAsRead(accessToken);
      await loadDashboardData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de marquer toutes les notifications comme lues.",
      );
    }
  };

  if (!isArtisan) {
    return (
      <main className="min-h-screen bg-background px-6 py-20 md:px-12">
        <Navbar />
        <div className="mx-auto mt-20 max-w-3xl border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Cette zone est reservee aux artisans connectes.
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
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto space-y-8 px-6 pb-20 pt-32 md:px-12">
        <header className="border border-border bg-muted/20 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">
            Espace artisan
          </p>
          <h1 className="mt-4 font-serif text-5xl">Dashboard artisan</h1>
          <p className="mt-3 text-muted-foreground">
            {profile
              ? `${profile.displayName} — gérez votre catalogue et suivez vos clients.`
              : "Chargement de votre profil artisan..."}
          </p>
          {errorMessage && (
            <p className="mt-4 border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          )}
        </header>

        {isLoading ? (
          <p className="text-muted-foreground">Chargement des donnees artisan...</p>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <article className="border border-border p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Produits
                </p>
                <p className="mt-2 font-serif text-3xl">{kpis?.totalProducts ?? 0}</p>
              </article>
              <article className="border border-border p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Commandes
                </p>
                <p className="mt-2 font-serif text-3xl">{kpis?.totalOrders ?? 0}</p>
              </article>
              <article className="border border-border p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Clients
                </p>
                <p className="mt-2 font-serif text-3xl">{kpis?.totalCustomers ?? 0}</p>
              </article>
              <article className="border border-border p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Articles vendus
                </p>
                <p className="mt-2 font-serif text-3xl">{kpis?.totalItemsSold ?? 0}</p>
              </article>
              <article className="border border-border p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Revenus
                </p>
                <p className="mt-2 font-serif text-3xl">
                  {(kpis?.totalRevenue ?? 0).toLocaleString("fr-FR")} FCFA
                </p>
              </article>
            </section>

            <section className="space-y-4 border border-border p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-serif text-3xl">Mes produits</h2>
                <Button
                  className="rounded-none uppercase tracking-[0.2em]"
                  onClick={openCreateDialog}
                >
                  Ajouter un produit
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Recherche
                  </span>
                  <Input
                    value={productSearch}
                    onChange={(event) => setProductSearch(event.target.value)}
                    placeholder="Nom, tag..."
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Categorie
                  </span>
                  <select
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    className="h-11 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
                  >
                    <option value="all">Toutes</option>
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Stock
                  </span>
                  <select
                    value={inStockFilter}
                    onChange={(event) =>
                      setInStockFilter(event.target.value as "all" | "true" | "false")
                    }
                    className="h-11 w-full border border-border bg-background/80 px-3 text-sm outline-none focus:border-primary/70"
                  >
                    <option value="all">Tous</option>
                    <option value="true">En stock</option>
                    <option value="false">Rupture</option>
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-1 gap-3 border border-border/70 p-4 md:grid-cols-[1fr_160px_auto_auto]">
                <Input
                  value={promotionReason}
                  onChange={(event) => setPromotionReason(event.target.value)}
                  placeholder="Raison de promo"
                />
                <Input
                  type="number"
                  min={1}
                  max={95}
                  value={promotionPercent}
                  onChange={(event) => setPromotionPercent(event.target.value)}
                  placeholder="%"
                />
                <Button
                  variant="outline"
                  className="rounded-none text-xs uppercase tracking-[0.2em]"
                  disabled={selectedProductIds.length === 0}
                  onClick={() => void applyPromotionOnSelected()}
                >
                  Appliquer promo
                </Button>
                <Button
                  variant="outline"
                  className="rounded-none text-xs uppercase tracking-[0.2em]"
                  disabled={selectedProductIds.length === 0}
                  onClick={() => void cancelPromotionOnSelected()}
                >
                  Annuler promo
                </Button>
              </div>
              <div className="space-y-3">
                {products.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucun produit trouve avec les filtres actuels.
                  </p>
                ) : (
                  products.map((product) => (
                    <article
                      key={product.id}
                      className="grid grid-cols-[24px_72px_1fr_auto] items-center gap-4 border border-border p-3"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                      />
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-16 w-16 object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {product.category} • {product.inStock ? "En stock" : "Rupture"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {product.price.toLocaleString("fr-FR")} FCFA
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Stock: {product.stockQuantity ?? 0}
                          {product.promotionActive && product.promotionPercent
                            ? ` • Promo -${product.promotionPercent}%`
                            : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className="rounded-none text-xs uppercase tracking-[0.2em]"
                          onClick={() => void openEditDialog(product.id)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-none text-xs uppercase tracking-[0.2em]"
                          onClick={() =>
                            void applyStockUpdate(
                              product.id,
                              Math.max(0, (product.stockQuantity ?? 0) + 1),
                            )
                          }
                        >
                          + Stock
                        </Button>
                        <Button
                          variant="ghost"
                          className="rounded-none text-xs uppercase tracking-[0.2em] text-destructive"
                          onClick={() => void deleteProduct(product.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="space-y-4 border border-border p-6">
              <h2 className="font-serif text-3xl">Mes clients</h2>
              <Input
                value={customersSearch}
                onChange={(event) => setCustomersSearch(event.target.value)}
                placeholder="Recherche client (nom, email)"
              />
              {customers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucun client pour le moment.
                </p>
              ) : (
                <div className="space-y-3">
                  {customers.map((customer) => (
                    <article
                      key={customer.id}
                      className="grid grid-cols-1 gap-2 border border-border p-4 md:grid-cols-4"
                    >
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.city ?? "-"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Commandes: {customer.totalOrders ?? 0}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-4 border border-border p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-serif text-3xl">Commandes artisan</h2>
                <Button
                  variant="outline"
                  className="rounded-none text-xs uppercase tracking-[0.2em]"
                  onClick={() => void loadDashboardData()}
                >
                  Actualiser
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input
                  value={ordersSearch}
                  onChange={(event) => setOrdersSearch(event.target.value)}
                  placeholder="Recherche commande"
                />
                <select
                  value={ordersStatus}
                  onChange={(event) => setOrdersStatus(event.target.value)}
                  className="h-10 border border-border bg-background px-3 text-sm outline-none"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                  <option value="rejected">rejected</option>
                  <option value="in_preparation">in_preparation</option>
                  <option value="shipped">shipped</option>
                  <option value="delivered">delivered</option>
                </select>
              </div>
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune commande trouvee.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <article
                      key={order.id}
                      className="grid grid-cols-1 gap-3 border border-border p-4 md:grid-cols-[1fr_auto]"
                    >
                      <div>
                        <p className="font-medium">{order.orderNumber ?? order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.customerName ?? order.customerEmail ?? "Client"}
                        </p>
                        <span
                          className={`mt-2 inline-block border px-2 py-1 text-xs ${orderStatusClass(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="outline"
                          className="rounded-none text-xs uppercase tracking-[0.2em]"
                          onClick={() => void updateOrderStatus(order.id, "confirmed")}
                        >
                          Valider
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-none text-xs uppercase tracking-[0.2em]"
                          onClick={() => void updateOrderStatus(order.id, "rejected")}
                        >
                          Rejeter
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-none text-xs uppercase tracking-[0.2em]"
                          onClick={() => void sendProgressMail(order.id)}
                        >
                          Progress mail
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-none text-xs uppercase tracking-[0.2em]"
                          onClick={() => void openTracking(order.id)}
                        >
                          Tracking
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-4 border border-border p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-serif text-3xl">Notifications</h2>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={unreadOnlyNotifications}
                      onChange={(event) => setUnreadOnlyNotifications(event.target.checked)}
                    />
                    Non lues
                  </label>
                  <Button
                    variant="outline"
                    className="rounded-none text-xs uppercase tracking-[0.2em]"
                    onClick={() => void markAllNotificationsRead()}
                  >
                    Tout marquer lu
                  </Button>
                </div>
              </div>
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune notification.</p>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <article
                      key={notification.id}
                      className="flex items-center justify-between gap-3 border border-border p-4"
                    >
                      <div>
                        <p className="font-medium">{notification.title ?? "Notification"}</p>
                        <p className="text-sm text-muted-foreground">
                          {notification.message ?? "-"}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <Button
                          variant="outline"
                          className="rounded-none text-xs uppercase tracking-[0.2em]"
                          onClick={() => void markNotificationRead(notification.id)}
                        >
                          Marquer lue
                        </Button>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </section>

      <Dialog
        open={upsertOpen}
        onOpenChange={(open) => {
          setUpsertOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProductId ? "Modifier le produit" : "Ajouter un produit"}
            </DialogTitle>
            <DialogDescription>
              Renseignez les informations produit puis validez.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitProduct} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <Label htmlFor="productName">Nom</Label>
                <Input
                  id="productName"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  required
                />
              </label>
              <label className="space-y-2">
                <Label htmlFor="productPrice">Prix</Label>
                <Input
                  id="productPrice"
                  type="number"
                  min={1}
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, price: event.target.value }))
                  }
                  required
                />
              </label>
              <label className="space-y-2">
                <Label htmlFor="productTag">Tag</Label>
                <Input
                  id="productTag"
                  value={form.tag}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, tag: event.target.value }))
                  }
                />
              </label>
              <label className="space-y-2">
                <Label htmlFor="productStockQuantity">Stock initial</Label>
                <Input
                  id="productStockQuantity"
                  type="number"
                  min={0}
                  value={form.stockQuantity}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      stockQuantity: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="space-y-2">
                <Label htmlFor="productCategory">Categorie</Label>
                <select
                  id="productCategory"
                  value={form.categorySlug}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      categorySlug: event.target.value,
                    }))
                  }
                  className="h-10 w-full border border-border bg-background px-3 text-sm outline-none"
                >
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <Label htmlFor="productSubcategory">Sous-categorie</Label>
                <Input
                  id="productSubcategory"
                  value={form.subcategorySlug}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      subcategorySlug: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, inStock: event.target.checked }))
                  }
                />
                <span className="text-sm">En stock</span>
              </label>
              <label className="space-y-2 md:col-span-2">
                <Label htmlFor="productDescription">Description</Label>
                <Textarea
                  id="productDescription"
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <Label htmlFor="productDetails">Details du produit</Label>
                <p className="text-xs text-muted-foreground">
                  Une ligne = un point de detail (envoye comme liste au serveur).
                </p>
                <Textarea
                  id="productDetails"
                  value={form.details}
                  placeholder={"Exemple :\nCuir pleine fleur\nFabrique a la main\nDelai 10 jours"}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, details: event.target.value }))
                  }
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <Label htmlFor="productFile">Image produit</Label>
                <Input
                  id="productFile"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      file: event.target.files?.[0] ?? null,
                    }))
                  }
                />
              </label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setUpsertOpen(false)}
                className="rounded-none uppercase tracking-[0.2em]"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={!canSubmitForm || isSaving}
                className="rounded-none uppercase tracking-[0.2em]"
              >
                {isSaving
                  ? "Enregistrement..."
                  : editingProductId
                    ? "Mettre a jour"
                    : "Creer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedTrackingOrder != null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTrackingOrder(null);
            setTrackingEvents([]);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suivi de commande</DialogTitle>
            <DialogDescription>
              {selectedTrackingOrder ?? "Aucune commande selectionnee"}
            </DialogDescription>
          </DialogHeader>
          {trackingEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun evenement de tracking.</p>
          ) : (
            <div className="space-y-3">
              {trackingEvents.map((event, index) => (
                <article key={`${event.status}-${event.createdAt ?? index}`} className="border border-border p-3">
                  <p className="font-medium">{event.status}</p>
                  <p className="text-sm text-muted-foreground">{event.message ?? "-"}</p>
                  <p className="text-xs text-muted-foreground">{event.createdAt ?? ""}</p>
                </article>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}
