import { MessageSquare, Phone, Search } from "lucide-react";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

type ContactStatus = "fiel" | "ativo" | "novo";

type Contact = {
  id: string;
  name: string;
  phone: string;
  lastOrder: string;
  lastValue: number;
  totalOrders: number;
  lastDate: string;
  status: ContactStatus;
};

const contacts: Contact[] = [
  { id: "c1", name: "Ana Souza", phone: "(11) 99123-4567", lastOrder: "#P-045", lastValue: 84.00, totalOrders: 12, lastDate: "Hoje, 17:45", status: "fiel" },
  { id: "c2", name: "Carol Mendes", phone: "(11) 98765-4321", lastOrder: "#P-047", lastValue: 52.00, totalOrders: 7, lastDate: "Hoje, 16:32", status: "ativo" },
  { id: "c3", name: "Joao Costa", phone: "(11) 91234-5678", lastOrder: "#P-046", lastValue: 38.50, totalOrders: 4, lastDate: "Hoje, 14:55", status: "ativo" },
  { id: "c4", name: "Lucia Ferreira", phone: "(11) 97654-3210", lastOrder: "#P-043", lastValue: 62.00, totalOrders: 19, lastDate: "Ontem, 16:00", status: "fiel" },
  { id: "c5", name: "Pedro Lima", phone: "(11) 96543-2109", lastOrder: "#P-044", lastValue: 29.50, totalOrders: 3, lastDate: "Ontem, 11:30", status: "ativo" },
  { id: "c6", name: "Roberto Alves", phone: "(11) 95432-1098", lastOrder: "#P-042", lastValue: 71.00, totalOrders: 8, lastDate: "Ontem, 17:30", status: "ativo" },
  { id: "c7", name: "Fernanda Dias", phone: "(11) 94321-0987", lastOrder: "#P-041", lastValue: 45.00, totalOrders: 25, lastDate: "22/05, 18:45", status: "fiel" },
  { id: "c8", name: "Carlos Silva", phone: "(11) 93210-9876", lastOrder: "#P-037", lastValue: 29.50, totalOrders: 2, lastDate: "22/05, 15:10", status: "ativo" },
  { id: "c9", name: "Juliana Costa", phone: "(11) 92109-8765", lastOrder: "#P-036", lastValue: 72.00, totalOrders: 6, lastDate: "21/05, 19:20", status: "ativo" },
  { id: "c10", name: "Rafael Alves", phone: "(11) 91098-7654", lastOrder: "#P-035", lastValue: 38.50, totalOrders: 11, lastDate: "20/05, 12:30", status: "fiel" },
  { id: "c11", name: "Beatriz Santos", phone: "(11) 90987-6543", lastOrder: "#P-034", lastValue: 91.00, totalOrders: 15, lastDate: "19/05, 18:00", status: "fiel" },
  { id: "c12", name: "Marina Oliveira", phone: "(11) 89876-5432", lastOrder: "#P-030", lastValue: 53.00, totalOrders: 1, lastDate: "15/05, 14:00", status: "novo" },
];

const statusConfig: Record<ContactStatus, { label: string; cls: string }> = {
  fiel: { label: "Cliente fiel", cls: "contact-fiel" },
  ativo: { label: "Ativo", cls: "contact-ativo" },
  novo: { label: "Novo", cls: "contact-novo" },
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function MensagensPage() {
  const fieis = contacts.filter((c) => c.status === "fiel").length;
  const ativos = contacts.filter((c) => c.status === "ativo").length;
  const novos = contacts.filter((c) => c.status === "novo").length;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">{contacts.length} clientes cadastrados</span>
          <h2 className="page-title">Clientes &amp; Mensagens</h2>
        </div>
        <div className="page-actions contact-summary">
          <span className="contact-summary-item fiel">{fieis} fieis</span>
          <span className="contact-summary-item ativo">{ativos} ativos</span>
          <span className="contact-summary-item novo">{novos} novos</span>
        </div>
      </div>

      <label className="search-box full-search">
        <Search size={18} />
        <input type="search" placeholder="Busque por nome ou telefone..." />
      </label>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Base de clientes</span>
            <h2>Todos os clientes</h2>
          </div>
        </div>
        <div className="contacts-list">
          <div className="contact-row contact-header">
            <span></span>
            <span>Cliente</span>
            <span>Pedidos</span>
            <span>Ultimo pedido</span>
            <span>Perfil</span>
            <span>Contato</span>
          </div>
          {contacts.map((c) => (
            <div key={c.id} className="contact-row">
              <div className="contact-avatar">{initials(c.name)}</div>
              <div className="contact-info">
                <strong>{c.name}</strong>
                <span>{c.phone}</span>
              </div>
              <div className="contact-orders">
                <strong>{c.totalOrders} pedido{c.totalOrders !== 1 ? "s" : ""}</strong>
                <span>Ticket: {money.format(c.lastValue)}</span>
              </div>
              <div className="contact-last">
                <strong>{c.lastOrder}</strong>
                <span>{c.lastDate}</span>
              </div>
              <span className={`contact-badge ${statusConfig[c.status].cls}`}>
                {statusConfig[c.status].label}
              </span>
              <div className="contact-actions">
                <a
                  href={`https://wa.me/55${c.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                  aria-label="Abrir WhatsApp"
                >
                  <MessageSquare size={15} />
                </a>
                <a href={`tel:${c.phone}`} className="contact-link" aria-label="Ligar">
                  <Phone size={15} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
