import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClipboardList, Download, TrendingUp, WalletCards } from "lucide-react";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

type Props = {
  weeklyPerformance: Array<{ week: string; vendas: number; gastos: number }>;
  salesTotal: number;
  expensesTotal: number;
  ordersCount: number;
};

const topProducts = [
  { name: "Coxinha de Frango", count: 87, revenue: 391.50 },
  { name: "Empada de Frango", count: 64, revenue: 256.00 },
  { name: "Risole de Camarao", count: 43, revenue: 215.00 },
  { name: "Quibe Assado", count: 39, revenue: 136.50 },
  { name: "Pastel de Carne", count: 35, revenue: 140.00 },
];

const hourlyData = [
  { hora: "10h", pedidos: 2 },
  { hora: "11h", pedidos: 4 },
  { hora: "12h", pedidos: 8 },
  { hora: "13h", pedidos: 12 },
  { hora: "14h", pedidos: 6 },
  { hora: "15h", pedidos: 5 },
  { hora: "16h", pedidos: 9 },
  { hora: "17h", pedidos: 14 },
  { hora: "18h", pedidos: 18 },
  { hora: "19h", pedidos: 16 },
  { hora: "20h", pedidos: 11 },
  { hora: "21h", pedidos: 7 },
];

type Period = "semana" | "mes" | "ano";

const periodLabels: Record<Period, string> = {
  semana: "Esta semana",
  mes: "Este mes",
  ano: "Este ano",
};

export function RelatoriosPage({ weeklyPerformance, salesTotal, expensesTotal, ordersCount }: Props) {
  const [period, setPeriod] = useState<Period>("mes");

  const ticketMedio = ordersCount > 0 ? salesTotal / ordersCount : 0;
  const margem = salesTotal > 0 ? Math.round(((salesTotal - expensesTotal) / salesTotal) * 100) : 0;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">Analise de desempenho</span>
          <h2 className="page-title">Relatorios</h2>
        </div>
        <div className="page-actions">
          <div className="period-tabs">
            {(["semana", "mes", "ano"] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                className={`period-btn ${period === p ? "active" : ""}`}
                onClick={() => setPeriod(p)}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>
          <button type="button" className="secondary">
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      <section className="metric-grid" aria-label="Metricas do periodo">
        <article>
          <div className="metric-icon"><WalletCards size={22} /></div>
          <span>Receita total</span>
          <strong>{money.format(salesTotal)}</strong>
          <small>+12% vs mes anterior</small>
        </article>
        <article>
          <div className="metric-icon"><TrendingUp size={22} /></div>
          <span>Ticket medio</span>
          <strong>{money.format(ticketMedio)}</strong>
          <small>Por pedido no periodo</small>
        </article>
        <article>
          <div className="metric-icon"><ClipboardList size={22} /></div>
          <span>Total de pedidos</span>
          <strong>{ordersCount}</strong>
          <small>Pedidos no periodo</small>
        </article>
        <article>
          <div className="metric-icon"><TrendingUp size={22} /></div>
          <span>Margem de lucro</span>
          <strong>{margem}%</strong>
          <small>Resultado liquido</small>
        </article>
      </section>

      <div className="reports-grid">
        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Segunda a domingo</span>
              <h2>Vendas vs Gastos</h2>
            </div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee8f5" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Bar dataKey="vendas" name="Vendas" fill="#f8b400" radius={[8, 8, 0, 0]} />
                <Bar dataKey="gastos" name="Gastos" fill="#2f3437" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Mais vendidos</span>
              <h2>Top produtos</h2>
            </div>
          </div>
          <div className="top-products">
            {topProducts.map((p, i) => (
              <div key={p.name} className="product-row">
                <span className="product-rank">{i + 1}</span>
                <div className="product-info">
                  <strong>{p.name}</strong>
                  <span>{p.count} unidades vendidas</span>
                </div>
                <strong className="product-revenue">{money.format(p.revenue)}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel chart-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Distribuicao de pedidos</span>
            <h2>Horarios de pico</h2>
          </div>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee8f5" />
              <XAxis dataKey="hora" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="pedidos" name="Pedidos" fill="#ff8a13" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
