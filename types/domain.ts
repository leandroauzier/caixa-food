export const roles = ["ADMIN", "CAIXA", "COZINHA", "ATENDENTE"] as const;
export type Role = (typeof roles)[number];

export const orderTypes = ["BALCAO", "MESA", "DELIVERY", "RETIRADA"] as const;
export type OrderType = (typeof orderTypes)[number];

export const orderStatuses = [
  "NOVO",
  "EM_PREPARO",
  "PRONTO",
  "ENTREGUE",
  "CANCELADO",
] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const paymentMethods = [
  "DINHEIRO",
  "PIX",
  "CARTAO_CREDITO",
  "CARTAO_DEBITO",
] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

export const paymentStatuses = [
  "PENDENTE",
  "APROVADO",
  "RECUSADO",
  "CANCELADO",
  "ESTORNADO",
] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

export type SessionUser = {
  id: string;
  companyId: string;
  companyName: string;
  role: Role;
  name: string;
  email: string;
};

export type DashboardMetric = {
  label: string;
  value: string;
  hint: string;
};

export type CategorySummary = {
  id: string;
  name: string;
  description: string;
  productCount: number;
  active: boolean;
};

export type ProductSummary = {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  minStock: number;
  active: boolean;
  imageUrl: string;
  options: ProductOptionSummary[];
};

export type OrderLine = {
  productName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
  selectedOptions: OrderItemOptionSummary[];
};

export type OrderSummary = {
  id: string;
  code: number;
  type: OrderType;
  status: OrderStatus;
  customerName: string;
  tableNumber?: string;
  total: number;
  createdAt: string;
  notes?: string;
  items: OrderLine[];
};

export type ReportSummary = {
  title: string;
  value: string;
  description: string;
};

export type InventoryAlert = {
  productName: string;
  currentStock: number;
  minimumStock: number;
};

export type AppModule = {
  title: string;
  description: string;
  href: string;
  accent: string;
};

export type ProductOptionKind = "EXTRA" | "PORTION";

export type ProductOptionSummary = {
  id: string;
  productId: string;
  name: string;
  price: number;
  kind: ProductOptionKind;
};

export type OrderItemOptionSummary = {
  optionId: string;
  name: string;
  price: number;
  kind: ProductOptionKind;
};

export type StoreCategory = {
  id: string;
  companyId: string;
  name: string;
  description: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type StoreProduct = {
  id: string;
  companyId: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stockQuantity: number;
  minStock: number;
  active: boolean;
  stockControl: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StoreProductOption = {
  id: string;
  companyId: string;
  productId: string;
  name: string;
  price: number;
  kind: ProductOptionKind;
  active: boolean;
};

export type StoreOrderItem = {
  productId: string;
  productName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
  selectedOptions: OrderItemOptionSummary[];
};

export type StoreOrder = {
  id: string;
  companyId: string;
  code: number;
  type: OrderType;
  status: OrderStatus;
  customerName: string;
  tableNumber?: string;
  notes?: string;
  total: number;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  items: StoreOrderItem[];
  saleId?: string;
};

export type SaleRecordStatus = "ABERTA" | "PAGA" | "CANCELADA" | "ESTORNADA";

export type SaleRecord = {
  id: string;
  companyId: string;
  orderId: string;
  total: number;
  discount: number;
  status: SaleRecordStatus;
  createdById: string;
  createdAt: string;
  paidAt?: string;
};

export type PaymentRecord = {
  id: string;
  companyId: string;
  saleId: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  createdAt: string;
  paidAt?: string;
};

export type StockMovementRecord = {
  id: string;
  companyId: string;
  productId: string;
  productName: string;
  quantity: number;
  type: "ENTRADA" | "SAIDA" | "AJUSTE" | "PERDA";
  reason: string;
  userId: string;
  createdAt: string;
};

export type AppStore = {
  company: {
    id: string;
    name: string;
  };
  nextOrderCode: number;
  categories: StoreCategory[];
  products: StoreProduct[];
  productOptions: StoreProductOption[];
  orders: StoreOrder[];
  sales: SaleRecord[];
  payments: PaymentRecord[];
  stockMovements: StockMovementRecord[];
};
