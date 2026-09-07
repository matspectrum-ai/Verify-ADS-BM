"use client";

import Link from "next/link";
import { useState } from "react";
import { AmbientBackground } from "../components/ambient-background";
import styles from "./minha-area.module.css";

type IconName = "globe" | "check" | "chart" | "zap" | "building" | "server" | "menu" | "pickaxe" | "user" | "book" | "logout";

function Icon({ name }: { name: IconName }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "globe") return <svg {...common}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20M2 12h20"/></svg>;
  if (name === "check") return <svg {...common}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>;
  if (name === "chart") return <svg {...common}><path d="M3 3v16a2 2 0 0 0 2 2h16M18 17V9M13 17V5M8 17v-3"/></svg>;
  if (name === "zap") return <svg {...common}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>;
  if (name === "building") return <svg {...common}><path d="M3 21h18M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/></svg>;
  if (name === "server") return <svg {...common}><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/></svg>;
  if (name === "menu") return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
  if (name === "pickaxe") return <svg {...common}><path d="m14 13-8.4 8.4a1 1 0 0 1-3-3L11 10M16 4a13 13 0 0 0-10-1.6M16 12a20 20 0 0 1 3 5.8"/><path d="m18.4 3.4 2.2 2.2-5.3 5.3a1.2 1.2 0 0 1-1.7 0l-2.3-2.3z"/></svg>;
  if (name === "user") return <svg {...common}><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/></svg>;
  if (name === "book") return <svg {...common}><path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>;
  return <svg {...common}><path d="m16 17 5-5-5-5M21 12H9M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>;
}

const stats = [
  { label: "Total de Domínios", value: 0, icon: "globe" as const, tone: "blue" },
  { label: "Domínios Verificados", value: 0, icon: "check" as const, tone: "green" },
  { label: "Landing Pages Ativas", value: 0, icon: "chart" as const, tone: "purple" },
  { label: "Novos este Mês", value: 0, icon: "zap" as const, tone: "orange" },
];

function AccountMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.accountMenuWrap}>
      <button className={styles.accountButton} aria-label="Abrir menu da conta" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span className={styles.avatar}>N</span><span className={styles.accountName}>nonton</span><Icon name="menu" />
      </button>
      {open && <div className={styles.dropdown}>
        <div className={styles.dropdownIdentity}><strong>nonton</strong><span>conta de demonstração</span></div>
        <nav>
          <Link href="/minerar"><Icon name="pickaxe" />Minerar CNPJs</Link>
          <Link href="/minha-area"><Icon name="chart" />Minha Área</Link>
          <Link href="/minha-conta"><Icon name="user" />Minha Conta</Link>
          <Link href="/dashboard/docs"><Icon name="book" />Manual / Ajuda</Link>
        </nav>
        <button className={styles.logout}><Icon name="logout" />Sair</button>
      </div>}
    </div>
  );
}

function EmptyCompanies() {
  return <section>
    <h2 className={styles.sectionHeading}><span aria-hidden="true">📋</span> Minhas Empresas Ativas</h2>
    <div className={styles.emptyCard}>
      <div className={styles.emptyIcon}><Icon name="globe" /></div>
      <h3>Nenhuma empresa salva</h3>
      <p>Minere um CNPJ, abra o Dossiê Empresarial e clique em Salvar para adicionar uma empresa aqui.</p>
      <Link className={styles.actionButton} href="/minerar"><span>＋</span> Ir para Mineração</Link>
      <div className={styles.tipDivider} />
      <div className={styles.tipBadge}>💡 <strong>Dica Rápida</strong></div>
      <div className={styles.tipBox}>
        <p><b>1.</b><span>Busque por um CNPJ no Score-Scanner e abra o <strong>Dossiê Empresarial</strong>.</span></p>
        <p><b>2.</b><span>Role até a seção <strong>📊 Verificação de Domínio</strong>.</span></p>
        <p><b>3.</b><span>Clique em <strong>Adicionar Domínio</strong> para começar a rastrear.</span></p>
      </div>
    </div>
  </section>;
}

function EmptyDomains() {
  return <div className={styles.domainsGrid}>
    <section className={styles.connectCard}>
      <div className={styles.connectIcon}><Icon name="globe" /></div>
      <h3>Conectar Domínio</h3>
      <p>Use seu domínio ou subdomínio para suas landing pages.</p>
      <label>Seu Domínio<input placeholder="Ex: lp.minhaloja.com ou sualoja.com.br" /></label>
      <button type="button">Continuar</button>
    </section>
    <section className={styles.domainEmpty}><div><Icon name="globe" /></div><h3>Nenhum domínio conectado</h3><p>Use o formulário ao lado para conectar seu primeiro domínio personalizado.</p></section>
  </div>;
}

export default function MinhaAreaPage() {
  const [tab, setTab] = useState<"empresas" | "domains">("empresas");
  return <main className={styles.page}>
    <AmbientBackground />
    <div className={styles.shell}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>PAINEL DE CONTROLE</span>
          <h1>Minha Área</h1>
          <p>Gerencie suas empresas e domínios verificados</p>
        </div>
        <div className={styles.identity}><div><strong>Olá, nonton</strong><span>conta autenticada</span></div><AccountMenu /></div>
      </header>
      <section className={styles.stats}>
        {stats.map(stat => <article className={styles.statCard} key={stat.label} data-tone={stat.tone}>
          <div className={styles.statIcon}><Icon name={stat.icon} /></div>
          <strong>{stat.value}</strong><span>{stat.label}</span>
        </article>)}
      </section>
      <div className={styles.tabs} role="tablist">
        <button className={tab === "empresas" ? styles.activeTab : ""} onClick={() => setTab("empresas")}><Icon name="building" />Minhas Empresas Ativas</button>
        <button className={tab === "domains" ? styles.activeTab : ""} onClick={() => setTab("domains")}><Icon name="server" />Domínios Próprios (White Label)</button>
      </div>
      {tab === "empresas" ? <EmptyCompanies /> : <EmptyDomains />}
    </div>
  </main>;
}
