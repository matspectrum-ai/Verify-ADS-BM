"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AmbientBackground } from "../components/ambient-background";
import styles from "./minerar.module.css";
import { CNPJ_WORDLIST_2025 } from "./cnpj-wordlist";

const WELCOME_KEY = "verifyads_welcome_seen";

type Progress = { tried: number; found: number; target: number; percentage: number };
type Company = { cnpj: string; trust_score?: number; razao_social?: string; nome_fantasia?: string; situacao_cadastral?: number | string; capital_social?: number; municipio?: string; uf?: string; porte?: string; cnae_fiscal?: number | string; cnae_fiscal_descricao?: string; ativa?: boolean };

const MAX_LIVE_LOOKUPS = 8;
const LOOKUP_DELAY_MS = 1500;

function SvgIcon({ kind }: { kind: "menu" | "book" | "arrow" | "sparkles" | "zap" }) {
  const p = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "menu") return <svg {...p}><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
  if (kind === "book") return <svg {...p}><path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></svg>;
  if (kind === "arrow") return <svg {...p}><path d="M5 12h14m-7-7 7 7-7 7" /></svg>;
  if (kind === "zap") return <svg {...p}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>;
  return <svg {...p}><path d="m12 3 1.1 5.4a2 2 0 0 0 1.5 1.5L20 11l-5.4 1.1a2 2 0 0 0-1.5 1.5L12 19l-1.1-5.4a2 2 0 0 0-1.5-1.5L4 11l5.4-1.1a2 2 0 0 0 1.5-1.5z" /></svg>;
}

function Topbar() {
  const [open, setOpen] = useState(false);
  return <div className={styles.topbar}>
    <Link href="/minha-area" className={styles.miniBrand}><span>Verify</span><b>Ads</b></Link>
    <div className={styles.menuWrap}>
      <button onClick={() => setOpen(v => !v)} className={styles.menuButton}><span>N</span><b>nonton</b><SvgIcon kind="menu" /></button>
      {open && <div className={styles.dropdown}>
        <Link href="/minerar">Minerar CNPJs</Link>
        <Link href="/minha-area">Minha Área</Link>
        <Link href="/minha-conta">Minha Conta</Link>
        <Link href="/dashboard/docs">Manual / Ajuda</Link>
        <button type="button">Sair</button>
      </div>}
    </div>
  </div>;
}

function WelcomeModal({ onClose }: { onClose: () => void }) {
  const goHelp = () => { localStorage.setItem(WELCOME_KEY, "1"); window.location.href = "/dashboard/docs"; };
  return <div className={styles.modalLayer}>
    <button className={styles.backdrop} aria-label="Fechar guia" onClick={onClose} />
    <section className={styles.welcomeCard}>
      <div className={styles.welcomeBrand}><span>Verify</span><b>Ads</b></div>
      <span className={styles.welcomeBadge}><SvgIcon kind="sparkles" />Bem-vindo ao VerifyAds!</span>
      <h2>Antes de começar, confira nosso guia 👋</h2>
      <p>O VerifyAds é a ferramenta completa para verificar empresas no Facebook Ads. Em menos de 5 minutos você aprende tudo que precisa.</p>
      <div className={styles.guideItems}>
        <article><i><SvgIcon kind="menu" /></i><div><strong>Encontre o menu pelo ícone ☰</strong><span>No canto superior direito da tela, clique nas <b>3 barrinhas</b> (ícone ☰) para abrir o menu lateral com todas as páginas do sistema.</span></div></article>
        <article><i><SvgIcon kind="book" /></i><div><strong>Leia o manual antes de usar</strong><span>O <b>Central de Ajuda</b> no menu lateral tem o passo a passo completo: como gerar o PDF, criar sua landing page e verificar no Facebook.</span></div></article>
      </div>
      <div className={styles.modalActions}>
        <button onClick={goHelp}><SvgIcon kind="book" />Abrir Central de Ajuda<SvgIcon kind="arrow" /></button>
        <button onClick={onClose}>Já sei usar — começar a mineração</button>
      </div>
    </section>
  </div>;
}

function MiningProgress({ progress, onStop }: { progress: Progress; onStop: () => void }) {
  return <section className={styles.progressCard}>
    <div className={styles.progressHeader}><div><span className={styles.spinner} /> <strong>Minerando empresas...</strong></div><button onClick={onStop}>Parar</button></div>
    <div className={styles.progressRow}><span>Progresso:</span><strong>{progress.found} / {progress.target}</strong></div>
    <div className={styles.progressTrack}><i style={{ width: `${progress.percentage}%` }} /></div>
    <div className={styles.tried}>{progress.tried} CNPJs testados</div>
  </section>;
}

export default function MinerarPage() {
  const [welcome, setWelcome] = useState(false);
  const [mining, setMining] = useState(false);
  const [progress, setProgress] = useState<Progress>({ tried: 0, found: 0, target: 20, percentage: 0 });
  const [companies, setCompanies] = useState<Company[]>([]);
  const stopRequested = useRef(false);

  useEffect(() => {
    if (!localStorage.getItem(WELCOME_KEY)) {
      const id = setTimeout(() => setWelcome(true), 800);
      return () => clearTimeout(id);
    }
  }, []);

  const dismissWelcome = () => { localStorage.setItem(WELCOME_KEY, "1"); setWelcome(false); };
  const stopMining = () => { stopRequested.current = true; setMining(false); };
  const startMining = async () => {
    if (mining) return;
    stopRequested.current = false;
    setCompanies([]);
    setProgress({ tried: 0, found: 0, target: 20, percentage: 0 });
    setMining(true);
    let tried = 0;
    let found = 0;
    const target = 20;

    for (const cnpj of CNPJ_WORDLIST_2025.slice(0, MAX_LIVE_LOOKUPS)) {
      if (stopRequested.current || found >= target) break;
      tried += 1;
      try {
        const response = await fetch(`/api/cnpj?cnpj=${cnpj}`, { cache: "no-store" });
        if (response.status === 429) break;
        if (response.ok) {
          const company = await response.json() as Company & { trust_score?: number };
          const capital = Number(company.capital_social ?? 0);
          const trustScore = Number(company.trust_score ?? 0);
          if (company.ativa && trustScore >= 65 && capital <= 20000) {
            found += 1;
            setCompanies(prev => [...prev, company]);
          }
        }
      } catch { /* individual lookup failure does not abort the run */ }
      setProgress({ tried, found, target, percentage: Math.min(100, Math.round((found / target) * 100)) });
      if (tried < MAX_LIVE_LOOKUPS && !stopRequested.current) {
        await new Promise(resolve => setTimeout(resolve, LOOKUP_DELAY_MS));
      }
    }
    setMining(false);
  };

  return <main className={styles.page}>
    <AmbientBackground />
    <div className={styles.shell}>
      <Topbar />
      <header className={styles.hero}>
        <h1><span>Verify</span><b>Ads</b><small>V91</small></h1>
        <p>Empresas reais. Anúncios seguros</p>
      </header>

      <section className={styles.miningControl}>
        <p>🎯 O sistema vai buscar <strong>20 empresas ATIVAS</strong> com capital até <b>R$ 20.000</b></p>
        <button onClick={startMining} disabled={mining}><SvgIcon kind="sparkles" />{mining ? "MINERANDO..." : "🔄 MINERAR DADOS REAIS"}</button>
      </section>

      {mining && <MiningProgress progress={progress} onStop={stopMining} />}

      {!mining && companies.length === 0 && <section className={styles.emptyState}>
        <div>🎯</div>
        <p>Configure os filtros e clique em &quot;MINERAR DADOS REAIS&quot;</p>
        <span>O sistema buscará automaticamente empresas que atendem aos critérios</span>
      </section>}

      {companies.length > 0 && <section className={styles.results}>
        <div className={styles.resultsHead}><div><span>RESULTADOS</span><h2>Empresas encontradas</h2></div><strong>{companies.length} encontrada{companies.length === 1 ? "" : "s"}</strong></div>
        <div className={styles.resultGrid}>{companies.map(company => <article key={company.cnpj} className={styles.resultCard}>
          <div className={styles.resultTop}><span>ATIVA</span><b>Trust Score {company.trust_score ?? "—"}</b></div>
          <h3>{company.nome_fantasia || company.razao_social || "Empresa sem nome"}</h3>
          <p>{company.razao_social || "Razão social não informada"}</p>
          <dl><div><dt>CNPJ</dt><dd>{company.cnpj}</dd></div><div><dt>LOCALIZAÇÃO</dt><dd>{company.municipio || "—"}{company.uf ? ` / ${company.uf}` : ""}</dd></div><div><dt>CAPITAL SOCIAL</dt><dd>R$ {Number(company.capital_social ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</dd></div></dl>
        </article>)}</div>
      </section>}

      <footer className={styles.footer}>© 2026 Score Scanner. Dados fornecidos pela <a href="https://brasilapi.com.br" target="_blank" rel="noreferrer">BrasilAPI</a></footer>
    </div>
    {welcome && <WelcomeModal onClose={dismissWelcome} />}
  </main>;
}
