import { useState } from "react";
import { Bell, CreditCard, MapPin, Store } from "lucide-react";

type Tab = "negocio" | "pagamentos" | "entrega" | "notificacoes";

const tabs: { id: Tab; label: string; Icon: typeof Store }[] = [
  { id: "negocio", label: "Negocio", Icon: Store },
  { id: "pagamentos", label: "Pagamentos", Icon: CreditCard },
  { id: "entrega", label: "Entrega", Icon: MapPin },
  { id: "notificacoes", label: "Notificacoes", Icon: Bell },
];

export function ConfiguracoesPage() {
  const [tab, setTab] = useState<Tab>("negocio");

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">Configuracoes do sistema</span>
          <h2 className="page-title">Ajustes</h2>
        </div>
      </div>

      <div className="settings-layout">
        <nav className="settings-tabs" aria-label="Secoes de configuracao">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              className={`settings-tab ${tab === id ? "active" : ""}`}
              onClick={() => setTab(id)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="settings-content">
          {tab === "negocio" && <NegocioTab />}
          {tab === "pagamentos" && <PagamentosTab />}
          {tab === "entrega" && <EntregaTab />}
          {tab === "notificacoes" && <NotificacoesTab />}
        </div>
      </div>
    </div>
  );
}

function NegocioTab() {
  return (
    <section className="panel settings-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Informacoes do negocio</span>
          <h2>Dados da loja</h2>
        </div>
      </div>
      <div className="settings-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Nome da loja</label>
            <input className="form-input" type="text" defaultValue="Lene Salgados" />
          </div>
          <div className="form-group">
            <label className="form-label">Tipo de negocio</label>
            <input className="form-input" type="text" defaultValue="Salgados &amp; Delivery" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Telefone / WhatsApp</label>
            <input className="form-input" type="tel" defaultValue="(11) 99000-0000" />
          </div>
          <div className="form-group">
            <label className="form-label">E-mail de contato</label>
            <input className="form-input" type="email" defaultValue="lene@salgados.com.br" />
          </div>
        </div>
        <div className="form-group form-group-full">
          <label className="form-label">Endereco</label>
          <input className="form-input" type="text" defaultValue="Rua das Flores, 123 - Sao Paulo, SP" />
        </div>
        <div className="form-group form-group-full">
          <label className="form-label">Horario de funcionamento</label>
          <input className="form-input" type="text" defaultValue="Segunda a Sabado, das 10h as 20h" />
        </div>
        <button type="button" className="save-btn">Salvar alteracoes</button>
      </div>
    </section>
  );
}

function PagamentosTab() {
  const methods = [
    { label: "Pix", sub: "Chave: (11) 99000-0000", on: true },
    { label: "Dinheiro", sub: "Troco disponivel", on: true },
    { label: "Cartao de credito", sub: "Maquininha presencial", on: true },
    { label: "Cartao de debito", sub: "Maquininha presencial", on: false },
    { label: "Vale-refeicao", sub: "VR, Alelo, Sodexo", on: false },
  ];

  return (
    <section className="panel settings-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Formas de pagamento</span>
          <h2>Metodos aceitos</h2>
        </div>
      </div>
      <div className="settings-form">
        <div className="toggle-list">
          {methods.map((m) => (
            <div key={m.label} className="toggle-row">
              <div>
                <strong>{m.label}</strong>
                <span>{m.sub}</span>
              </div>
              <div className={`toggle-switch ${m.on ? "on" : ""}`} role="switch" aria-checked={m.on} />
            </div>
          ))}
        </div>
        <button type="button" className="save-btn">Salvar alteracoes</button>
      </div>
    </section>
  );
}

function EntregaTab() {
  return (
    <section className="panel settings-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Configuracoes de entrega</span>
          <h2>Area e taxas</h2>
        </div>
      </div>
      <div className="settings-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Pedido minimo</label>
            <input className="form-input" type="text" defaultValue="R$ 20,00" />
          </div>
          <div className="form-group">
            <label className="form-label">Taxa de entrega padrao</label>
            <input className="form-input" type="text" defaultValue="R$ 5,00" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Raio de entrega (km)</label>
            <input className="form-input" type="text" defaultValue="5 km" />
          </div>
          <div className="form-group">
            <label className="form-label">Tempo estimado de entrega</label>
            <input className="form-input" type="text" defaultValue="30 a 45 minutos" />
          </div>
        </div>
        <div className="form-group form-group-full">
          <label className="form-label">Entrega gratis acima de</label>
          <input className="form-input" type="text" defaultValue="R$ 80,00" />
        </div>
        <div className="toggle-list">
          <div className="toggle-row">
            <div>
              <strong>Aceitar retirada no local</strong>
              <span>Clientes podem retirar o pedido pessoalmente</span>
            </div>
            <div className="toggle-switch on" role="switch" aria-checked={true} />
          </div>
          <div className="toggle-row">
            <div>
              <strong>Pedidos agendados</strong>
              <span>Permitir encomendas com data futura</span>
            </div>
            <div className="toggle-switch on" role="switch" aria-checked={true} />
          </div>
        </div>
        <button type="button" className="save-btn">Salvar alteracoes</button>
      </div>
    </section>
  );
}

function NotificacoesTab() {
  const notifs = [
    { label: "Novo pedido", sub: "Alerta sonoro e visual ao receber pedido", on: true },
    { label: "Pedido cancelado", sub: "Aviso imediato de cancelamentos", on: true },
    { label: "Estoque baixo", sub: "Notificar quando item estiver abaixo do minimo", on: true },
    { label: "Resumo diario", sub: "Relatorio automatico ao final do dia", on: false },
    { label: "Metas de venda", sub: "Avisar ao atingir metas mensais", on: false },
  ];

  return (
    <section className="panel settings-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Preferencias de aviso</span>
          <h2>Notificacoes</h2>
        </div>
      </div>
      <div className="settings-form">
        <div className="toggle-list">
          {notifs.map((n) => (
            <div key={n.label} className="toggle-row">
              <div>
                <strong>{n.label}</strong>
                <span>{n.sub}</span>
              </div>
              <div className={`toggle-switch ${n.on ? "on" : ""}`} role="switch" aria-checked={n.on} />
            </div>
          ))}
        </div>
        <button type="button" className="save-btn">Salvar alteracoes</button>
      </div>
    </section>
  );
}
