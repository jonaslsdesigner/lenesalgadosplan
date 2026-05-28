import { useState } from "react";
import { ChevronRight, ShoppingBag } from "lucide-react";
import type { Order } from "../App";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

type Props = {
  orders: Order[];
};

const statusLabel: Record<Order["status"], string> = {
  novo: "Novo",
  em_preparo: "Em preparo",
  pronto: "Pronto",
  entregue: "Entregue",
};

const extraOrders: Order[] = [
  { id: "e1", displayId: "#P-038", customer: "Fernanda Lima", type: "Entrega", status: "entregue", payment: "Pix", total: 45.00 },
  { id: "e2", displayId: "#P-037", customer: "Carlos Silva", type: "Retirada", status: "entregue", payment: "Dinheiro", total: 29.50 },
  { id: "e3", displayId: "#P-036", customer: "Juliana Costa", type: "Entrega", status: "entregue", payment: "Cartao", total: 72.00 },
  { id: "e4", displayId: "#P-035", customer: "Rafael Alves", type: "Retirada", status: "entregue", payment: "Pix", total: 38.50 },
  { id: "e5", displayId: "#P-034", customer: "Beatriz Santos", type: "Entrega", status: "entregue", payment: "Pix", total: 91.00 },
  { id: "e6", displayId: "#P-033", customer: "Marcelo Teixeira", type: "Entrega", status: "entregue", payment: "Cartao", total: 56.00 },
];

type FilterTab = "todos" | Order["status"];

export function PedidosPage({ orders }: Props) {
  const [filter, setFilter] = useState<FilterTab>("todos");
  const allOrders = [...orders, ...extraOrders];

  const filtered = filter === "todos" ? allOrders : allOrders.filter((o) => o.status === filter);

  const counts: Record<FilterTab, number> = {
    todos: allOrders.length,
    novo: allOrders.filter((o) => o.status === "novo").length,
    em_preparo: allOrders.filter((o) => o.status === "em_preparo").length,
    pronto: allOrders.filter((o) => o.status === "pronto").length,
    entregue: allOrders.filter((o) => o.status === "entregue").length,
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "novo", label: "Novos" },
    { key: "em_preparo", label: "Em preparo" },
    { key: "pronto", label: "Prontos" },
    { key: "entregue", label: "Entregues" },
  ];

  return (
    <div className="page-content">
      <div className="filter-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab-btn ${filter === tab.key ? "active" : ""}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            <span className="tab-count">{counts[tab.key]}</span>
          </button>
        ))}
      </div>

      <section className="panel">
        <div className="orders-table-header">
          <span>Pedido</span>
          <span>Cliente</span>
          <span>Tipo</span>
          <span>Status</span>
          <span>Pagamento</span>
          <span>Total</span>
          <span></span>
        </div>
        <div className="orders-table">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <ShoppingBag size={36} />
              <span>Nenhum pedido com este status</span>
            </div>
          ) : (
            filtered.map((order) => (
              <div className="order-row order-row-ext" key={order.id}>
                <strong>{order.displayId}</strong>
                <span>{order.customer}</span>
                <span>{order.type}{order.scheduledLabel ? ` ${order.scheduledLabel}` : ""}</span>
                <span className={`status ${order.status.replace("_", "-")}`}>
                  {statusLabel[order.status]}
                </span>
                <span>{order.payment}</span>
                <strong>{money.format(order.total)}</strong>
                <button type="button" className="icon-button row-action" aria-label="Ver detalhes">
                  <ChevronRight size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
