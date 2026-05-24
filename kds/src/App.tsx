import { useEffect, useState } from "react";
import { Bell, Clock, Maximize2 } from "lucide-react";
import "./App.css";
import leneLogo from "./assets/LOGOTIPO PRINCIPAL.png";
import { isSupabaseReady } from "./lib/supabase";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

type KitchenOrder = {
  id: string;
  displayId: string;
  customer: string;
  status: "novo" | "em_preparo" | "pronto" | "entregue";
  createdAt: string;
  items: string[];
};

const statusLabels = {
  novo: "Novo",
  em_preparo: "Em preparo",
  pronto: "Pronto",
  entregue: "Entregue"
};

function App() {
  const [activeOrders, setActiveOrders] = useState<KitchenOrder[]>([]);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const loadOrders = () => {
      fetch(`${apiUrl}/api/orders?active=true`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("API indisponivel");
          }
          return response.json() as Promise<{ orders: KitchenOrder[] }>;
        })
        .then((data) => {
          setActiveOrders(data.orders.filter((order) => order.status !== "entregue"));
          setApiError(false);
        })
        .catch(() => setApiError(true));
    };

    loadOrders();
    const interval = window.setInterval(loadOrders, 5000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="kds-screen">
      <header className="kds-header">
        <div className="title-block">
          <img className="kds-logo" src={leneLogo} alt="Lene Salgados" />
          <div>
            <span>Delivery</span>
            <h1>Lene Salgados KDS</h1>
          </div>
        </div>
        <div className="header-actions">
          <div className="live-pill">
            <Bell size={18} />
            {isSupabaseReady ? "Tempo real ativo" : "Dados locais"}
          </div>
          <button type="button" aria-label="Tela cheia">
            <Maximize2 size={20} />
          </button>
        </div>
      </header>

      {apiError && (
        <div className="kds-alert">
          API local indisponivel. Inicie o backend para carregar os pedidos.
        </div>
      )}

      <section className="orders-board" aria-label="Pedidos ativos">
        {activeOrders.map((order) => (
          <article className={`order-card ${order.status.replace("_", "-")}`} key={order.id}>
            <div className="card-top">
              <strong>{order.displayId}</strong>
              <span>{statusLabels[order.status as keyof typeof statusLabels]}</span>
            </div>
            <h2>{order.customer}</h2>
            <ul>
              {order.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <footer>
              <Clock size={20} />
              Entrada:{" "}
              {new Intl.DateTimeFormat("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
              }).format(new Date(order.createdAt))}
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
