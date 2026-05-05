import { StaticArtisanRepository, StaticProductRepository } from "@/infrastructure/repositories";
import {
  ArtisanService,
  ArtisanDashboardService,
  AuthService,
  BackofficeArtisansService,
  BackofficeDashboardService,
  BackofficeUsersService,
  CartService,
  CatalogService,
  CatalogPublicService,
  CertificationService,
  CheckoutService,
  ContentPublicService,
  CustomerCartService,
  CustomerCatalogService,
  CustomerOrdersService,
  HomePublicService,
  OrderService,
  ProductService,
  UserProfileService,
} from "@/services";

export type AppServices = {
  artisanService: ArtisanService;
  productService: ProductService;
  catalogService: CatalogService;
  catalogPublicService: CatalogPublicService;
  certificationService: CertificationService;
  authService: AuthService;
  cartService: CartService;
  orderService: OrderService;
  checkoutService: CheckoutService;
  customerCartService: CustomerCartService;
  customerCatalogService: CustomerCatalogService;
  customerOrdersService: CustomerOrdersService;
  contentPublicService: ContentPublicService;
  homePublicService: HomePublicService;
  userProfileService: UserProfileService;
  artisanDashboardService: ArtisanDashboardService;
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
      catalogPublicService: new CatalogPublicService(),
      certificationService: new CertificationService(),
      authService: new AuthService(),
      cartService,
      orderService,
      checkoutService: new CheckoutService(cartService, productService, orderService),
      customerCartService: new CustomerCartService(),
      customerCatalogService: new CustomerCatalogService(),
      customerOrdersService: new CustomerOrdersService(),
      contentPublicService: new ContentPublicService(),
      homePublicService: new HomePublicService(),
      userProfileService: new UserProfileService(),
      artisanDashboardService: new ArtisanDashboardService(),
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
