export type PaymentMethod = "card" | "mobile_money" | "bank_transfer" | "cash_on_delivery";

export type CheckoutDetails = {
  fullName: string;
  phone: string;
  country: string;
  city: string;
  district: string;
  addressLine: string;
  postalCode?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
};

export type OrderLine = {
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
};

export type OrderStatus = "pending" | "confirmed" | "in_preparation" | "shipped";

export type Order = {
  id: string;
  userId: string;
  userEmail: string;
  userDisplayName: string;
  createdAt: string;
  status: OrderStatus;
  lines: OrderLine[];
  subtotal: number;
  shippingFee: number;
  total: number;
  checkout: CheckoutDetails;
};
