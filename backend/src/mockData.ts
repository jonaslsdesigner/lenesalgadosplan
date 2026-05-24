export type OrderStatus = "novo" | "em_preparo" | "pronto" | "entregue";
export type PaymentMethod = "PIX" | "Dinheiro" | "Cartao";
export type OrderType = "Delivery do dia" | "Encomenda";

export type LocalOrder = {
  id: string;
  displayId: string;
  customer: string;
  customerPhone: string;
  customerAddress?: string;
  type: OrderType;
  scheduledLabel?: string;
  status: OrderStatus;
  payment: PaymentMethod;
  paymentReceived: boolean;
  items: string[];
  total: number;
  createdAt: string;
  notes?: string;
};

const orders: LocalOrder[] = [];

export const mockData = {
  monthLabel: "Maio 2026",
  metrics: {
    salesTotal: 0,
    expensesTotal: 0,
    companyExpenses: 0,
    personalExpenses: 0,
    netProfit: 0,
    ordersCount: 0,
    scheduledOrdersCount: 0,
    growthPercent: 0,
    profitMarginPercent: 0
  },
  weeklyPerformance: [
    { week: "Sem 1", vendas: 0, gastos: 0 },
    { week: "Sem 2", vendas: 0, gastos: 0 },
    { week: "Sem 3", vendas: 0, gastos: 0 },
    { week: "Sem 4", vendas: 0, gastos: 0 }
  ],
  lowStock: [],
  orders
};

export function createLocalOrder(input: {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: Array<{ name: string; quantity: number; notes?: string }>;
  paymentMethod?: "pix" | "dinheiro" | "cartao";
  orderType: "delivery" | "encomenda";
  scheduledAt?: string;
  notes?: string;
}) {
  const nextNumber =
    1040 +
    mockData.orders.length +
    Math.floor(Math.random() * 40);

  const order: LocalOrder = {
    id: `ord-${nextNumber}`,
    displayId: `#${nextNumber}`,
    customer: input.customerName,
    customerPhone: input.customerPhone,
    customerAddress: input.customerAddress,
    type: input.orderType === "encomenda" ? "Encomenda" : "Delivery do dia",
    scheduledLabel: input.scheduledAt
      ? new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
          timeZone: "America/Sao_Paulo"
        }).format(new Date(input.scheduledAt))
      : undefined,
    status: "novo",
    payment:
      input.paymentMethod === "dinheiro"
        ? "Dinheiro"
        : input.paymentMethod === "cartao"
          ? "Cartao"
          : "PIX",
    paymentReceived: false,
    items: input.items.map((item) => {
      const note = item.notes ? ` (${item.notes})` : "";
      return `${item.quantity} ${item.name}${note}`;
    }),
    total: 0,
    createdAt: new Date().toISOString(),
    notes: input.notes
  };

  mockData.orders.unshift(order);
  mockData.metrics.ordersCount += 1;
  return order;
}
