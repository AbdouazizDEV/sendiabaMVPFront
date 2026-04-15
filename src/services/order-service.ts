import type { Order, OrderLine } from "@/domain/types";

const ORDERS_KEY = "sendiaba.orders";

function inBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeRead<T>(key: string, fallback: T): T {
  if (!inBrowser()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  if (!inBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function createOrderId(): string {
  return `cmd-${Math.random().toString(36).slice(2, 10)}`;
}

type CreateOrderInput = {
  userId: string;
  userEmail: string;
  userDisplayName: string;
  lines: OrderLine[];
  shippingFee: number;
  checkout: Order["checkout"];
};

export class OrderService {
  listAll(): Order[] {
    return safeRead<Order[]>(ORDERS_KEY, []);
  }

  listForUser(userId: string): Order[] {
    return this.listAll()
      .filter((order) => order.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getById(id: string): Order | undefined {
    return this.listAll().find((order) => order.id === id);
  }

  create(input: CreateOrderInput): Order {
    const subtotal = input.lines.reduce(
      (sum, line) => sum + line.unitPrice * line.quantity,
      0,
    );
    const order: Order = {
      id: createOrderId(),
      userId: input.userId,
      userEmail: input.userEmail,
      userDisplayName: input.userDisplayName,
      createdAt: new Date().toISOString(),
      status: "pending",
      lines: input.lines,
      subtotal,
      shippingFee: input.shippingFee,
      total: subtotal + input.shippingFee,
      checkout: input.checkout,
    };

    const orders = this.listAll();
    safeWrite(ORDERS_KEY, [order, ...orders]);
    return order;
  }
}
