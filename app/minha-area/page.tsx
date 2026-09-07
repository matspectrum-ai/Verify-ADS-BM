"use client";

import { useState } from "react";
import { AmbientBackground } from "../components/ambient-background";
import "./minha-area.css";

type IconName = "globe" | "check" | "chart" | "zap" | "building" | "server" | "mine" | "grid" | "user" | "book" | "logout";

const metrics = [
  { icon: "globe" as const, tone: "blue", value: "0", label: "Total de Domínios" },
  { icon: "check" as const, tone: "green", value: "0", label: "Domínios Verificados" },
  { icon: "chart" as const, tone: "purple", value: "0", label: "Landing Pages Ativas" },
  { icon: "zap" as const, tone: "orange", value: "0", label: "Novos este Mês" },
];

function Icon({ name }: { name: IconName }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<IconName, React.ReactNode> = {
    globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
    zap: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
    building: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 9h2M14 9h2M8 13h2M14 13h2M10 20v-3h4v3" /></>,
    server: <><rect x="4" y="5" width="16" height="5" rx="1" /><rect x="4" y="14" width="16" height="5" rx="1" /><path d="M8 7.5h.01M8 16.5h.01" /></>,
    mine: <><path d="M4 20 14 10M10 6l8 8M14 4l6 6" /><path d="M3 17l4 4" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    user: <><circle cx="12" cy="8" r="3" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5A2.5 2.5 0 0 1 20 21.5z" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
  };
  return <svg aria-hidden="true" {...common}>{paths[name]}</svg>;
}

export default function MinhaAreaPage() {
  const [activeTab, setActiveTab] = useState<"empresas" | "dominios">("empresas");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="dashboard-page">
      <AmbientBackground compact />
      <section className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">PAINEL DE CONTROLE</span>
            <h1>Minha Área</h1>
            <p>Gerencie suas empresas e domínios verificados</p>
          </div>

          <div className="dashboard-user">
            <div className="dashboard-greeting">
              <strong>Olá, usuário</strong>
              <span>conta autenticada</span>
            </div>
            <div className="profile-wrap">
              <button className="profile-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen}>
                <span className="profile-avatar">N</span>
                <span>usuário</span>
                <span className="profile-menu-mark">{menuOpen ? "×" : "☰"}</span>
              </button>
              {menuOpen ? <ProfileMenu /> : null}
            </div>
          </div>
        </header>
        <section className="dashboard-metrics" aria-label="Resumo da conta">
          {metrics.map((metric) => (
            <article className="dashboard-metric-card" key={metric.label}>
              <div className={`dashboard-metric-icon tone-${metric.tone}`}><Icon name={metric.icon} /></div>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </section>

        <div className="dashboard-tabs" role="tablist" aria-label="Área de empresas">
          <button type="button" className={activeTab === "empresas" ? "active" : ""} onClick={() => setActiveTab("empresas")} role="tab" aria-selected={activeTab === "empresas"}>
            <Icon name="building" /> Minhas Empresas Ativas
          </button>
          <button type="button" className={activeTab === "dominios" ? "active" : ""} onClick={() => setActiveTab("dominios")} role="tab" aria-selected={activeTab === "dominios"}>
            <Icon name="server" /> Domínios Próprios (White Label)
          </button>
        </div>

        <section className="dashboard-content-card">
          <h2>{activeTab === "empresas" ? "📋 Minhas Empresas Ativas" : "🌐 Domínios Próprios (White Label)"}</h2>
          {activeTab === "empresas" ? <CompanyEmptyState /> : <DomainEmptyState />}
        </section>
      </section>
    </main>
  );
}

function CompanyEmptyState() {
  return (
    <div className="dashboard-empty-state">
      <div className="empty-icon"><Icon name="globe" /><span>×</span></div>
      <h3>Nenhuma empresa salva</h3>
      <p>Minere um CNPJ, abra o Dossiê Empresarial e clique em Salvar para adicionar uma empresa aqui.</p>
      <a href="/minerar" className="dashboard-secondary-button"><span>＋</span> Ir para Mineração</a>
      <div className="quick-tip">
        <span className="quick-tip-label">💡 Dica Rápida</span>
        <p>Busque por um CNPJ na Score-Scanner e abra o Dossiê Empresarial para salvar empresas na sua área.</p>
      </div>
    </div>
  );
}

function DomainEmptyState() {
  return (
    <div className="dashboard-empty-state compact-empty">
      <div className="empty-icon"><Icon name="server" /></div>
      <h3>Nenhum domínio próprio</h3>
      <p>Os domínios White Label vinculados à sua conta aparecerão aqui.</p>
    </div>
  );
}

function ProfileMenu() {
  async function logout() {
    localStorage.clear();
    sessionStorage.clear();
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch { /* redirect regardless */ }
    window.location.href = "/login";
  }

  return (
    <div className="profile-menu" role="menu">
      <div className="profile-menu-head">
        <strong>usuário</strong>
        <span>conta autenticada</span>
      </div>
      <a href="/minerar" role="menuitem"><Icon name="mine" /> Minerar CNPJs</a>
      <a href="/minha-area" role="menuitem"><Icon name="grid" /> Minha Área</a>
      <a href="/minha-conta" role="menuitem"><Icon name="user" /> Minha Conta</a>
      <a href="/dashboard/docs" role="menuitem"><Icon name="book" /> Manual / Ajuda</a>
      <div className="profile-menu-separator" />
      <button type="button" className="danger" role="menuitem" onClick={logout}><Icon name="logout" /> Sair</button>
    </div>
  );
}
