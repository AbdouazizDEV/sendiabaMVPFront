import { StaticArtisanRepository, StaticProductRepository } from "@/infrastructure/repositories";
import {
  ArtisanService,
  AuthService,
  BackofficeArtisansService,
  BackofficeDashboardService,
  BackofficeUsersService,
  CartService,
  CatalogService,
  CertificationService,
  CheckoutService,
  OrderService,
  ProductService,
  UserProfileService,
} from "@/services";

export type AppServices = {
  artisanService: ArtisanService;
  productService: ProductService;
  catalogService: CatalogService;
  certificationService: CertificationService;
  authService: AuthService;
  cartService: CartService;
  orderService: OrderService;
  checkoutService: CheckoutService;
  userProfileService: UserProfileService;
  backofficeDashboardService: BackofficeDashboardService;
  backofficeArtisansService: BackofficeArtisansService;
  backofficeUsersService: BackofficeUsersService;
};

let instance: AppServices | null = null;

export function getServices(): AppServices {
  if (!instance) {
    const artisanRepository = new StaticArtisanRepository();
    const productRepository = new StaticProductRepository();

    const productService = new ProductService(productRepository);
    const cartService = new CartService();
    const orderService = new OrderService();

    instance = {
      artisanService: new ArtisanService(artisanRepository),
      productService,
      catalogService: new CatalogService(productRepository, artisanRepository),
      certificationService: new CertificationService(),
      authService: new AuthService(),
      cartService,
      orderService,
      checkoutService: new CheckoutService(cartService, productService, orderService),
      userProfileService: new UserProfileService(),
      backofficeDashboardService: new BackofficeDashboardService(),
      backofficeArtisansService: new BackofficeArtisansService(),
      backofficeUsersService: new BackofficeUsersService(),
    };
  }
  return instance;
}

export function resetServicesForTests(): void {
  instance = null;
}
