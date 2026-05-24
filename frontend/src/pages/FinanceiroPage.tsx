import { ArrowDownLeft, ArrowUpRight, BadgeDollarSign, Clock, CreditCard, Filter, TrendingUp, WalletCards } from "lucide-react";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

type Props = {
  salesTotal: number;
  expensesTotal: number;
  netProfit: number;
  ordersCount: number;
};

const mockTransactions = [
  { id: "t1", date: "24/05", time: "16:32", category: "Pedido", description: "Entrega #P-047 - Carol Mendes", type: "entrada" as const, value: 52.00 },
  { id: "t2", date: "24/05", time: "15:10", category: "Ingredientes", description: "Frango desfiado - 5kg", type: "saida" as const, value: 95.00 },
  { id: "t3", date: "24/05", time: "14:55", category: "Pedido", description: "Retirada #P-046 - Joao Costa", type: "entrada" as const, value: 38.50 },
  { id: "t4", date: "23/05", time: "18:20", category: "Embalagens", description: "Caixas descartaveis - 200 unid.", type: "saida" as const, value: 67.80 },
  { id: "t5", date: "23/05", time: "17:45", category: "Pedido", description: "Entrega #P-045 - Ana Souza", type: "entrada" as const, value: 84.00 },
  { id: "t6", date: "23/05", time: "11:30", category: "Pedido", description: "Entrega #P-044 - Pedro Lima", type: "entrada" as const, value: 29.50 },
  { id: "t7", date: "22/05", time: "19:00", category: "Gas", description: "Botijao de gas 13kg", type: "saida" as const, value: 115.00 },
  { id: "t8", date: "22/05", time: "16:00", category: "Pedido", description: "Entrega #P-043 - Lucia Ferreira", type: "entrada" as const, value: 62.00 },
  { id: "t9", date: "22/05", time: "10:15", category: "Marketing", description: "Impulsionamento Instagram", type: "saida" as const, value: 50.00 },
  { id: "t10", date: "21/05", time: "17:30", category: "Pedido", description: "Entrega #P-042 - Roberto Alves", type: "entrada" as const, value: 71.00 },
  { id: "t11", date: "21/05", time: "09:00", category: "Ingredientes", description: "Queijo mucarel - 3kg", type: "saida" as const, value: 89.70 },
  { id: "t12", date: "20/05", time: "18:45", category: "Pedido", description: "Entrega #P-041 - Fernanda Dias", type: "entrada" as const, value: 45.00 },
];

const expenseCategories = [
  { name: "Ingredientes", total: 184.70, percent: 42 },
  { name: "Gas", total: 115.00, percent: 26 },
  { name: "Embalagens", total: 67.80, percent: 16 },
  { name: "Marketing", total: 50.00, percent: 11 },
  { name: "Outros", total: 22.00, percent: 5 },
];

export function FinanceiroPage({ salesTotal, expensesTotal, netProfit, ordersCount }: Props) {
  const pendentes = 156.50;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">Maio 2025</span>
          <h2 className="page-title">Financeiro</h2>
        </div>
        <div className="page-actions">
          <button type="button" className="secondary">
            <ArrowDownLeft size={16} />
            Nova saida
          </button>
          <button type="button">
            <ArrowUpRight size={16} />
            Nova entrada
          </button>
        </div>
      </div>

      <section className="metric-grid" aria-label="Resumo financeiro">
        <article>
          <div className="metric-icon"><WalletCards size={22} /></div>
          <span>Receita do mes</span>
          <strong>{money.format(salesTotal)}</strong>
          <small>{ordersCount} pedidos realizados</small>
        </article>
        <article>
          <div className="metric-icon"><CreditCard size={22} /></div>
          <span>Gastos do mes</span>
          <strong>{money.format(expensesTotal)}</strong>
          <small>Ingredientes, embalagens e mais</small>
        </article>
        <article>
          <div className="metric-icon"><TrendingUp size={22} /></div>
          <span>Saldo atual</span>
          <strong>{money.format(netProfit)}</strong>
          <small>Receita menos gastos totais</small>
        </article>
        <article>
          <div className="metric-icon"><Clock size={22} /></div>
          <span>A receber</span>
          <strong>{money.format(pendentes)}</strong>
          <small>Pedidos pendentes de confirmacao</small>
        </article>
      </section>

      <div className="fin-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Historico</span>
              <h2>Ultimas transacoes</h2>
            </div>
            <button type="button" className="icon-button" aria-label="Filtrar transacoes">
              <Filter size={18} />
            </button>
          </div>
          <div className="transactions-list">
            {mockTransactions.map((t) => (
              <div key={t.id} className="transaction-row">
                <div className={`tx-icon ${t.type}`}>
                  {t.type === "entrada" ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                </div>
                <div className="tx-info">
                  <strong>{t.description}</strong>
                  <span>{t.category} &bull; {t.date} as {t.time}</span>
                </div>
                <strong className={`tx-value ${t.type}`}>
                  {t.type === "entrada" ? "+" : "−"}{money.format(t.value)}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <div className="fin-sidebar">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Despesas de maio</span>
                <h2>Por categoria</h2>
              </div>
            </div>
            <div className="category-list">
              {expenseCategories.map((cat) => (
                <div key={cat.name} className="category-row">
                  <div className="category-row-info">
                    <strong>{cat.name}</strong>
                    <div className="category-bar-wrap">
                      <div className="category-bar" style={{ width: `${cat.percent}%` }} />
                    </div>
                  </div>
                  <strong className="tx-value saida">{money.format(cat.total)}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="panel fin-balance-card">
            <BadgeDollarSign size={26} className="fin-icon" />
            <span className="eyebrow">Saldo liquido &mdash; Maio</span>
            <strong className="fin-balance-value">{money.format(netProfit)}</strong>
            <span className="fin-sub">Lucro do mes atual</span>
          </section>
        </div>
      </div>
    </div>
  );
}
