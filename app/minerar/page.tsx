"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AmbientBackground } from "../components/ambient-background";
import styles from "./minerar.module.css";
import { CNPJ_WORDLIST_2025 } from "./cnpj-wordlist";
import { cnpjCache } from "./cnpj-cache";

const WELCOME_KEY = "verifyads_welcome_seen";

type Progress = { tried: number; found: number; target: number; percentage: number };
type Company = { cnpj: string; trust_score?: number; razao_social?: string; nome_fantasia?: string; situacao_cadastral?: number | string; tipo_situacao_cadastral?: string; capital_social?: number; municipio?: string; uf?: string; porte?: string; cnae_fiscal?: number | string; cnae_fiscal_descricao?: string; data_abertura?: string; telefone?: string; email?: string; logradouro?: string; numero?: string; bairro?: string; cep?: string; natureza_juridica?: string; ativa?: boolean };

type CachedCompany = Company & { found_at?: string; times_verified?: number };

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

function formatCnpj(cnpj: string) {
  const digits = cnpj.replace(/\D/g, "");
  return digits.length === 14 ? digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5") : cnpj;
}

function formatCurrency(value?: number) {
  return Number(value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function scoreLabel(score: number) {
  if (score >= 90) return "EXCELENTE";
  if (score >= 80) return "ÓTIMO";
  if (score >= 70) return "BOM";
  if (score >= 60) return "REGULAR";
  return "BAIXO";
}

function CompanyModal({ company, onClose, onSave }: { company: Company; onClose: () => void; onSave: () => void }) {
  const score = Number(company.trust_score ?? 0);
  const address = [company.logradouro, company.numero, company.bairro].filter(Boolean).join(", ");
  return <div className={styles.modalLayer} role="dialog" aria-modal="true" aria-label="Detalhes da empresa">
    <button className={styles.backdrop} aria-label="Fechar detalhes" onClick={onClose} />
    <section className={styles.detailCard}>
      <div className={styles.detailHeader}><div><span className={styles.detailEyebrow}>EMPRESA ENCONTRADA</span><h2>{company.razao_social || company.nome_fantasia || "Empresa"}</h2><p>CNPJ: {formatCnpj(company.cnpj)}</p></div><button onClick={onClose} className={styles.detailClose} aria-label="Fechar">×</button></div>
      <div className={styles.scorePanel}><div><strong>{score}</strong><span>Trust Score</span></div><b>{scoreLabel(score)}</b></div>
      <dl className={styles.detailGrid}>
        <div><dt>Nome Fantasia</dt><dd>{company.nome_fantasia || "N/A"}</dd></div><div><dt>Situação</dt><dd>{company.tipo_situacao_cadastral || (company.ativa ? "ATIVA" : "N/A")}</dd></div>
        <div><dt>Capital Social</dt><dd>{formatCurrency(company.capital_social)}</dd></div><div><dt>Porte</dt><dd>{company.porte || "N/A"}</dd></div>
        <div><dt>Localização</dt><dd>{[company.municipio, company.uf].filter(Boolean).join(" - ") || "N/A"}</dd></div><div><dt>CNAE</dt><dd>{company.cnae_fiscal ? `${company.cnae_fiscal}${company.cnae_fiscal_descricao ? ` — ${company.cnae_fiscal_descricao}` : ""}` : "N/A"}</dd></div>
        <div><dt>Data de abertura</dt><dd>{company.data_abertura || "N/A"}</dd></div><div><dt>Telefone</dt><dd>{company.telefone || "N/A"}</dd></div>
        <div><dt>Email</dt><dd>{company.email || "N/A"}</dd></div><div><dt>Endereço</dt><dd>{address || "N/A"}</dd></div>
      </dl>
      <div className={styles.detailActions}><button onClick={onSave}>Salvar empresa</button><button onClick={onClose}>Fechar</button></div>
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
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
    setCompanies([]);
    setProgress({ tried: 0, found: 0, target: 20, percentage: 0 });
    setMining(true);
    let tried = 0;
    let found = 0;
    const target = 20;
    const seen = new Set<string>();
    const cached = cnpjCache.available().filter(item => Number(item.trust_score ?? 0) >= 65 && Number(item.capital_social ?? 0) <= 20000);
    const candidates = [...cached.map(item => item.cnpj), ...CNPJ_WORDLIST_2025];

    for (const cnpj of candidates) {
      if (stopRequested.current || found >= target) break;
      if (seen.has(cnpj) || cnpjCache.isBlacklisted(cnpj) || cnpjCache.isUsed(cnpj)) continue;
      seen.add(cnpj);
      const cachedCompany = cached.find(item => item.cnpj === cnpj);
      tried += 1;
      if (cachedCompany) {
        found += 1;
        setCompanies(prev => [...prev, cachedCompany]);
        setProgress({ tried, found, target, percentage: Math.min(100, Math.round((found / target) * 100)) });
        continue;
      }
      if (tried > MAX_LIVE_LOOKUPS) {
        setError("Limite de consultas ao provedor atingido. Tente novamente mais tarde.");
        break;
      }
      try {
        const response = await fetch(`/api/cnpj?cnpj=${encodeURIComponent(cnpj)}`, { cache: "no-store" });
        if (response.status === 429) {
          setError("A BrasilAPI limitou temporariamente as consultas. A mineração foi pausada.");
          break;
        }
        if (response.ok) {
          const company = await response.json() as Company;
          const capital = Number(company.capital_social ?? 0);
          const trustScore = Number(company.trust_score ?? 0);
          if (company.ativa && trustScore >= 65 && capital <= 20000) {
            found += 1;
            cnpjCache.addWhitelist(company);
            setCompanies(prev => [...prev, company]);
          } else {
            cnpjCache.addBlacklist(cnpj, company.ativa ? "FILTERED" : "INACTIVE");
          }
        } else if (response.status === 404) {
          cnpjCache.addBlacklist(cnpj, "NOT_FOUND");
        }
      } catch {
        cnpjCache.addBlacklist(cnpj, "ERROR");
      }
      setProgress({ tried, found, target, percentage: Math.min(100, Math.round((found / target) * 100)) });
      if (tried <= MAX_LIVE_LOOKUPS && !stopRequested.current) await new Promise(resolve => setTimeout(resolve, LOOKUP_DELAY_MS));
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

      {error && <section className={styles.errorState}><span>⚠️</span><p>{error}</p></section>}

      {!mining && companies.length === 0 && !error && <section className={styles.emptyState}>
        <div>🎯</div>
        <p>Configure os filtros e clique em &quot;MINERAR DADOS REAIS&quot;</p>
        <span>O sistema buscará automaticamente empresas que atendem aos critérios</span>
      </section>}

      {companies.length > 0 && <section className={styles.results}>
        <div className={styles.resultsHead}><div><span>RESULTADOS</span><h2>Empresas Encontradas</h2></div><strong>{companies.length}</strong></div>
        <div className={styles.resultGrid}>{companies.map(company => <article key={company.cnpj} className={styles.resultCard} onClick={() => setSelectedCompany(company)}>
          <div className={styles.resultTop}><span>ATIVA</span><b>{company.trust_score ?? "—"} · Trust Score</b></div>
          <div className={styles.resultIdentity}><div><h3>{company.razao_social || company.nome_fantasia || "Empresa sem nome"}</h3><p>CNPJ: {formatCnpj(company.cnpj)}</p></div><strong>{company.trust_score ?? "—"}</strong></div>
          <div className={styles.scoreLabel}>{scoreLabel(Number(company.trust_score ?? 0))}</div>
          <dl><div><dt>Capital Social</dt><dd>{formatCurrency(company.capital_social)}</dd></div><div><dt>Localização</dt><dd>{company.municipio || "N/A"} - {company.uf || "N/A"}</dd></div><div><dt>Porte</dt><dd>{company.porte || "N/A"}</dd></div><div><dt>CNAE</dt><dd>{company.cnae_fiscal || "N/A"}</dd></div></dl>
          <div className={styles.resultHint}>Clique para ver detalhes e salvar</div>
        </article>)}</div>
      </section>}

      <footer className={styles.footer}>© 2026 Score Scanner. Dados fornecidos pela <a href="https://brasilapi.com.br" target="_blank" rel="noreferrer">BrasilAPI</a></footer>
    </div>
    {welcome && <WelcomeModal onClose={dismissWelcome} />}
    {selectedCompany && <CompanyModal company={selectedCompany} onClose={() => setSelectedCompany(null)} onSave={() => { cnpjCache.markUsed(selectedCompany.cnpj); setSelectedCompany(null); setCompanies(prev => prev.filter(company => company.cnpj !== selectedCompany.cnpj)); }} />}
  </main>;
}
