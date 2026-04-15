import type { AuthSession, CheckoutDetails, Order, OrderLine, Product } from "@/domain/types";

import { CartService } from "./cart-service";
import { OrderService } from "./order-service";
import { ProductService } from "./product-service";

const DEFAULT_SHIPPING_FEE = 35;

export class CheckoutService {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
  ) {}

  getCartProducts(): Array<{ product: Product; quantity: number }> {
    return this.cartService.getItems().reduce<Array<{ product: Product; quantity: number }>>(
      (acc, item) => {
        const product = this.productService.getById(item.productId);
        if (product) {
          acc.push({ product, quantity: item.quantity });
        }
        return acc;
      },
      [],
    );
  }

  placeOrder(session: AuthSession, checkout: CheckoutDetails): Order {
    const lines: OrderLine[] = this.getCartProducts().map(({ product, quantity }) => ({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      unitPrice: product.price,
      quantity,
    }));

    if (lines.length === 0) {
      throw new Error("Votre panier est vide.");
    }

    const order = this.orderService.create({
      userId: session.id,
      userDisplayName: session.displayName,
      userEmail: session.email,
      lines,
      shippingFee: DEFAULT_SHIPPING_FEE,
      checkout,
    });

    this.cartService.clear();
    return order;
  }
}
