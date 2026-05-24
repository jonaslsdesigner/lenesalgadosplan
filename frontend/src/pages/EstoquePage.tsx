import { AlertTriangle, Package, PackageOpen, TrendingDown } from "lucide-react";

type LowStockItem = {
  id: string;
  name: string;
  current: number;
  minimum: number;
  unit: string;
};

type Props = {
  lowStock: LowStockItem[];
};

type StockStatus = "ok" | "baixo" | "critico";

type StockItem = {
  id: string;
  name: string;
  category: string;
  current: number;
  minimum: number;
  unit: string;
  price: number;
  status: StockStatus;
};

const allStock: StockItem[] = [
  { id: "s1", name: "Frango desfiado", category: "Proteinas", current: 1.2, minimum: 3.0, unit: "kg", price: 18.90, status: "critico" },
  { id: "s2", name: "Massa para coxinha", category: "Massas", current: 2.5, minimum: 5.0, unit: "kg", price: 8.50, status: "baixo" },
  { id: "s3", name: "Queijo mucarel", category: "Laticinios", current: 1.8, minimum: 2.0, unit: "kg", price: 34.90, status: "baixo" },
  { id: "s4", name: "Farinha de trigo", category: "Massas", current: 8.0, minimum: 5.0, unit: "kg", price: 4.20, status: "ok" },
  { id: "s5", name: "Oleo de soja", category: "Condimentos", current: 4.5, minimum: 3.0, unit: "L", price: 6.80, status: "ok" },
  { id: "s6", name: "Caixas descartaveis", category: "Embalagens", current: 45, minimum: 100, unit: "unid.", price: 0.35, status: "critico" },
  { id: "s7", name: "Guardanapos", category: "Embalagens", current: 200, minimum: 150, unit: "unid.", price: 0.05, status: "ok" },
  { id: "s8", name: "Sal refinado", category: "Condimentos", current: 1.5, minimum: 1.0, unit: "kg", price: 2.50, status: "ok" },
  { id: "s9", name: "Manteiga", category: "Laticinios", current: 0.8, minimum: 1.5, unit: "kg", price: 22.00, status: "critico" },
  { id: "s10", name: "Tempero completo", category: "Condimentos", current: 3, minimum: 2, unit: "pct", price: 4.90, status: "ok" },
  { id: "s11", name: "Palitos para salgado", category: "Embalagens", current: 120, minimum: 200, unit: "unid.", price: 0.02, status: "baixo" },
  { id: "s12", name: "Sacos plasticos", category: "Embalagens", current: 80, minimum: 100, unit: "unid.", price: 0.08, status: "baixo" },
];

const statusConfig: Record<StockStatus, { label: string; cls: string }> = {
  ok: { label: "OK", cls: "stock-status-ok" },
  baixo: { label: "Baixo", cls: "stock-status-baixo" },
  critico: { label: "Critico", cls: "stock-status-critico" },
};

export function EstoquePage({ lowStock: _ }: Props) {
  const criticos = allStock.filter((i) => i.status === "critico").length;
  const baixos = allStock.filter((i) => i.status === "baixo").length;
  const ok = allStock.filter((i) => i.status === "ok").length;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">Controle de insumos</span>
          <h2 className="page-title">Estoque</h2>
        </div>
      </div>

      <section className="metric-grid" aria-label="Resumo do estoque">
        <article>
          <div className="metric-icon"><Package size={22} /></div>
          <span>Total de itens</span>
          <strong>{allStock.length}</strong>
          <small>Produtos cadastrados</small>
        </article>
        <article>
          <div className="metric-icon" style={{ background: "#e9f8ef", color: "#247647" }}>
            <PackageOpen size={22} />
          </div>
          <span>Em dia</span>
          <strong>{ok}</strong>
          <small>Itens com estoque normal</small>
        </article>
        <article>
          <div className="metric-icon" style={{ background: "#fff0e7", color: "#bc4306" }}>
            <TrendingDown size={22} />
          </div>
          <span>Estoque baixo</span>
          <strong>{baixos}</strong>
          <small>Atencao, repor em breve</small>
        </article>
        <article>
          <div className="metric-icon" style={{ background: "#ffe4de", color: "#8e271e" }}>
            <AlertTriangle size={22} />
          </div>
          <span>Criticos</span>
          <strong>{criticos}</strong>
          <small>Repor imediatamente</small>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Todos os itens</span>
            <h2>Inventario completo</h2>
          </div>
        </div>
        <div className="stock-table">
          <div className="stock-row stock-header">
            <span>Item</span>
            <span>Categoria</span>
            <span>Qtd. atual</span>
            <span>Minimo</span>
            <span>Unidade</span>
            <span>Preco unit.</span>
            <span>Status</span>
          </div>
          {allStock.map((item) => (
            <div key={item.id} className="stock-row">
              <strong>{item.name}</strong>
              <span>{item.category}</span>
              <span>{item.current}</span>
              <span>{item.minimum}</span>
              <span>{item.unit}</span>
              <span>R$ {item.price.toFixed(2).replace(".", ",")}</span>
              <span className={`stock-status-badge ${statusConfig[item.status].cls}`}>
                {statusConfig[item.status].label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
