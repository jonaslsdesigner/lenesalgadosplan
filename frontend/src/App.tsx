import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BadgeDollarSign,
  Bell,
  CalendarClock,
  ChartNoAxesCombined,
  ChefHat,
  ClipboardList,
  CreditCard,
  Home,
  Menu,
  MessageSquare,
  PackageOpen,
  Plus,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Truck,
  WalletCards
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import "./App.css";
import leneLogo from "./assets/LOGOTIPO PRINCIPAL.png";
import { isSupabaseReady } from "./lib/supabase";
import { FinanceiroPage } from "./pages/FinanceiroPage";
import { PedidosPage } from "./pages/PedidosPage";
import { EstoquePage } from "./pages/EstoquePage";
import { MensagensPage } from "./pages/MensagensPage";
import { RelatoriosPage } from "./pages/RelatoriosPage";
import { ConfiguracoesPage } from "./pages/ConfiguracoesPage";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

type Page =
  | "dashboard"
  | "financeiro"
  | "pedidos"
  | "estoque"
  | "clientes"
  | "relatorios"
  | "configuracoes";

export type Order = {
  id: string;
  displayId: string;
  customer: string;
  type: string;
  scheduledLabel?: string;
  status: "novo" | "em_preparo" | "pronto" | "entregue";
  payment: string;
  total: number;
};

type DashboardData = {
  monthLabel: string;
  metrics: {
    salesTotal: number;
    expensesTotal: number;
    companyExpenses: number;
    netProfit: number;
    ordersCount: number;
    scheduledOrdersCount: number;
    growthPercent: number;
    profitMarginPercent: number;
  };
  weeklyPerformance: Array<{ week: string; vendas: number; gastos: number }>;
  lowStock: Array<{ id: string; name: string; current: number; minimum: number; unit: string }>;
  activeOrders: Order[];
};

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const statusLabel = {
  novo: "Novo",
  em_preparo: "Em preparo",
  pronto: "Pronto",
  entregue: "Entregue"
};

const pageH1: Record<Page, string> = {
  dashboard: "Ola, Lene",
  financeiro: "Financeiro",
  pedidos: "Pedidos",
  estoque: "Estoque",
  clientes: "Mensagens",
  relatorios: "Relatorios",
  configuracoes: "Ajustes"
};

const pageEyebrow: Record<Page, string> = {
  dashboard: "",
  financeiro: "Maio 2025",
  pedidos: "Pedidos do dia",
  estoque: "Controle de insumos",
  clientes: "Clientes cadastrados",
  relatorios: "Analise de desempenho",
  configuracoes: "Configuracoes do sistema"
};

function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/api/dashboard`)
      .then((response) => {
        if (!response.ok) throw new Error("API indisponivel");
        return response.json() as Promise<DashboardData>;
      })
      .then((data) => {
        setDashboard(data);
        setApiError(false);
      })
      .catch(() => setApiError(true));
  }, []);

  function goTo(p: Page) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      setPage(p);
    };
  }

  const metrics = dashboard?.metrics;
  const orders = dashboard?.activeOrders ?? [];
  const lowStock = dashboard?.lowStock ?? [];
  const monthLabel = dashboard?.monthLabel ?? "Carregando";
  const netProfit = metrics?.netProfit ?? 0;
  const salesTotal = metrics?.salesTotal ?? 0;
  const expensesTotal = metrics?.expensesTotal ?? 0;
  const ticketAverage = orders.length
    ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length
    : 0;
  const firstOrders = orders.slice(0, 3);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img className="brand-mark" src={leneLogo} alt="Lene Salgados" />
          <div>
            <strong>Lene Salgados</strong>
            <span>Delivery</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Menu principal">
          <a className={page === "dashboard" ? "active" : ""} href="#dashboard" onClick={goTo("dashboard")}>
            <Home size={19} />
            Dashboard
          </a>
          <a className={page === "financeiro" ? "active" : ""} href="#financeiro" onClick={goTo("financeiro")}>
            <BadgeDollarSign size={19} />
            Financeiro
          </a>
          <a className={page === "pedidos" ? "active" : ""} href="#pedidos" onClick={goTo("pedidos")}>
            <ShoppingBag size={19} />
            Pedidos
          </a>
          <a className={page === "estoque" ? "active" : ""} href="#estoque" onClick={goTo("estoque")}>
            <PackageOpen size={19} />
            Estoque
          </a>
          <a className={page === "clientes" ? "active" : ""} href="#clientes" onClick={goTo("clientes")}>
            <MessageSquare size={19} />
            Mensagens
          </a>
          <a className={page === "relatorios" ? "active" : ""} href="#relatorios" onClick={goTo("relatorios")}>
            <ChartNoAxesCombined size={19} />
            Relatorios
          </a>
          <a className={page === "configuracoes" ? "active" : ""} href="#configuracoes" onClick={goTo("configuracoes")}>
            <Settings size={19} />
            Ajustes
          </a>
        </nav>

        <div className="role-card">
          <ShieldCheck size={18} />
          <div>
            <strong>Perfil Admin</strong>
            <span>Acesso total para a Lene</span>
          </div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <span className="eyebrow">{page === "dashboard" ? monthLabel : pageEyebrow[page]}</span>
            <h1>{pageH1[page]}</h1>
          </div>
          <label className="search-box">
            <Search size={20} />
            <input type="search" placeholder="Busque pedidos, produtos ou clientes..." />
          </label>
          <div className="actions">
            <button type="button" className="icon-button" aria-label="Abrir notificacoes">
              <Bell size={20} />
            </button>
            {(page === "dashboard" || page === "financeiro") && (
              <>
                <button type="button" className="secondary">
                  <Plus size={17} />
                  Nova saida
                </button>
                <button type="button">
                  <Plus size={17} />
                  Nova entrada
                </button>
              </>
            )}
            {page === "pedidos" && (
              <button type="button">
                <Plus size={17} />
                Novo pedido
              </button>
            )}
            {page === "estoque" && (
              <button type="button">
                <Plus size={17} />
                Novo item
              </button>
            )}
          </div>
        </header>

        {page === "dashboard" && (
          <div className="workspace">
            <section className="main-column">
              {apiError && (
                <div className="setup-alert danger">
                  <AlertTriangle size={18} />
                  API local indisponivel. Inicie o backend com `npm run dev:backend`.
                </div>
              )}

              <section className="metric-grid" aria-label="Resumo mensal">
                <article>
                  <div className="metric-icon">
                    <WalletCards size={22} />
                  </div>
                  <span>Total de vendas</span>
                  <strong>{money.format(salesTotal)}</strong>
                  <small>+{metrics?.growthPercent ?? 0}% vs mes anterior</small>
                </article>
                <article>
                  <div className="metric-icon">
                    <CreditCard size={22} />
                  </div>
                  <span>Total de gastos</span>
                  <strong>{money.format(expensesTotal)}</strong>
                  <small>Empresa: {money.format(metrics?.companyExpenses ?? 0)}</small>
                </article>
                <article>
                  <div className="metric-icon">
                    <ChartNoAxesCombined size={22} />
                  </div>
                  <span>Lucro liquido</span>
                  <strong>{money.format(netProfit)}</strong>
                  <small>Margem atual de {metrics?.profitMarginPercent ?? 0}%</small>
                </article>
                <article>
                  <div className="metric-icon">
                    <ClipboardList size={22} />
                  </div>
                  <span>Pedidos do mes</span>
                  <strong>{metrics?.ordersCount ?? 0}</strong>
                  <small>{metrics?.scheduledOrdersCount ?? 0} encomendas agendadas</small>
                </article>
              </section>

              <section className="dashboard-grid">
                <article className="panel chart-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">Segunda a domingo</span>
                      <h2>Desempenho semanal</h2>
                    </div>
                    <a href="#relatorios" onClick={goTo("relatorios")}>Ver tudo</a>
                  </div>
                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={dashboard?.weeklyPerformance ?? []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee8f5" />
                        <XAxis dataKey="week" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip formatter={(value) => `R$ ${value}`} />
                        <Bar dataKey="vendas" fill="#f8b400" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="gastos" fill="#2f3437" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </article>

                <article className="panel stock-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">Atencao</span>
                      <h2>Estoque baixo</h2>
                    </div>
                    <AlertTriangle size={20} />
                  </div>
                  <ul className="stock-list">
                    {lowStock.map((item) => (
                      <li key={item.id}>
                        <span>{item.name}</span>
                        <strong>
                          {item.current}/{item.minimum} {item.unit}
                        </strong>
                      </li>
                    ))}
                  </ul>
                </article>
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">Dados locais</span>
                    <h2>Pedidos ativos</h2>
                  </div>
                  <a href="#pedidos" onClick={goTo("pedidos")}>Ver tudo</a>
                </div>
                <div className="orders-table">
                  {orders.map((order) => (
                    <div className="order-row" key={order.id}>
                      <strong>{order.displayId}</strong>
                      <span>{order.customer}</span>
                      <span>
                        {order.type}
                        {order.scheduledLabel ? ` ${order.scheduledLabel}` : ""}
                      </span>
                      <span className={`status ${order.status.replace("_", "-")}`}>
                        {statusLabel[order.status]}
                      </span>
                      <span>{order.payment}</span>
                      <strong>{money.format(order.total)}</strong>
                    </div>
                  ))}
                </div>
              </section>
            </section>

            <aside className="right-panel" aria-label="Resumo operacional">
              <div className="panel-actions">
                <button type="button" className="icon-button" aria-label="Abrir cozinha">
                  <ChefHat size={20} />
                </button>
                <button type="button" className="icon-button" aria-label="Abrir menu">
                  <Menu size={20} />
                </button>
              </div>

              <section>
                <h2>Seu saldo</h2>
                <div className="balance-card">
                  <span>Lucro liquido</span>
                  <strong>{money.format(netProfit)}</strong>
                  <small>{monthLabel}</small>
                </div>
              </section>

              <section className="side-section">
                <span className="eyebrow">Resumo rapido</span>
                <div className="quick-grid">
                  <article>
                    <CalendarClock size={20} />
                    <strong>{metrics?.scheduledOrdersCount ?? 0}</strong>
                    <span>Agendados</span>
                  </article>
                  <article>
                    <Truck size={20} />
                    <strong>{orders.length}</strong>
                    <span>Ativos</span>
                  </article>
                  <article>
                    <ReceiptText size={20} />
                    <strong>{money.format(ticketAverage)}</strong>
                    <span>Ticket medio</span>
                  </article>
                </div>
              </section>

              <section className="side-section">
                <div className="panel-heading compact">
                  <div>
                    <span className="eyebrow">Fila</span>
                    <h2>Pedidos recentes</h2>
                  </div>
                </div>
                <div className="side-orders">
                  {firstOrders.map((order) => (
                    <article key={order.id}>
                      <div className="order-avatar">
                        {order.displayId.replace("#", "").slice(-2)}
                      </div>
                      <div>
                        <strong>{order.customer}</strong>
                        <span>{statusLabel[order.status]}</span>
                      </div>
                      <b>{money.format(order.total)}</b>
                    </article>
                  ))}
                </div>
              </section>

              <section className="coupon-card">
                <BadgeDollarSign size={22} />
                <span>Relatorio do dia</span>
                <strong>{money.format(salesTotal - expensesTotal)}</strong>
              </section>
            </aside>
          </div>
        )}

        {page === "financeiro" && (
          <FinanceiroPage
            salesTotal={salesTotal}
            expensesTotal={expensesTotal}
            netProfit={netProfit}
            ordersCount={metrics?.ordersCount ?? 0}
          />
        )}
        {page === "pedidos" && <PedidosPage orders={orders} />}
        {page === "estoque" && <EstoquePage lowStock={lowStock} />}
        {page === "clientes" && <MensagensPage />}
        {page === "relatorios" && (
          <RelatoriosPage
            weeklyPerformance={dashboard?.weeklyPerformance ?? []}
            salesTotal={salesTotal}
            expensesTotal={expensesTotal}
            ordersCount={metrics?.ordersCount ?? 0}
          />
        )}
        {page === "configuracoes" && <ConfiguracoesPage />}
      </section>
    </main>
  );
}

export default App;
