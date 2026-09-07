"use client";

import { FormEvent, useState } from "react";
import { AmbientBackground } from "../components/ambient-background";
import "./minha-conta.css";

type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  maxDomains: number;
  featured?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfeito para começar sua operação de ads",
    price: 100,
    maxDomains: 4,
    features: ["4 domínios ativos", "Landing pages ilimitadas", "Verificação CNPJ automática", "Dashboard de gerenciamento", "Suporte por email"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Ideal para agências e profissionais",
    price: 150,
    maxDomains: 10,
    featured: true,
    features: ["10 domínios ativos", "Landing pages ilimitadas", "Verificação CNPJ automática", "Dashboard avançado", "Suporte prioritário", "Relatórios detalhados"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Para grandes operações e agências",
    price: 250,
    maxDomains: 20,
    features: ["20 domínios ativos", "Landing pages ilimitadas", "Verificação CNPJ automática", "Dashboard enterprise", "Suporte VIP 24/7", "Relatórios personalizados", "API dedicada", "Gerente de conta"],
  },
];

function CheckIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>;
}

function SectionTitle({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="account-section-title">
      <span className="account-section-icon" aria-hidden="true">{icon}</span>
      <div><h2>{title}</h2>{subtitle ? <p>{subtitle}</p> : null}</div>
    </div>
  );
}

export default function MinhaContaPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [feedback, setFeedback] = useState("");

  function submitEmail(event: FormEvent) {
    event.preventDefault();
    setFeedback(email.trim() ? "Email atualizado! Verifique sua caixa de entrada para confirmar." : "Informe o novo email");
  }

  function submitPassword(event: FormEvent) {
    event.preventDefault();
    if (password.length < 6) return setFeedback("A senha deve ter pelo menos 6 caracteres");
    if (password !== passwordConfirm) return setFeedback("As senhas não coincidem");
    setFeedback("Senha alterada com sucesso!");
  }

  return (
    <main className="account-page">
      <AmbientBackground compact />
      <section className="account-shell">
        <header className="account-header">
          <div>
            <span className="account-eyebrow">PAINEL DE CONTROLE</span>
            <h1>Minha Conta</h1>
            <p>Gerencie seu plano e configurações de acesso</p>
          </div>
          <div className="account-user">
            <div className="account-greeting"><strong>Olá, usuário</strong><span>conta autenticada</span></div>
            <div className="account-profile-wrap">
              <button className="account-profile-button" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
                <span className="account-avatar">N</span><span>usuário</span><span className="account-menu-mark">{menuOpen ? "×" : "☰"}</span>
              </button>
              {menuOpen ? <AccountProfileMenu /> : null}
            </div>
          </div>
        </header>

        <section className="account-card">
          <SectionTitle icon="💳" title="Assinatura e Plano" />
          <div className="account-empty-plan">
            <span aria-hidden="true">⚡</span>
            <strong>Nenhum plano ativo</strong>
            <p>Escolha um plano abaixo</p>
          </div>
        </section>

        <section className="account-card" id="planos">
          <SectionTitle icon="⚡" title="Planos Disponíveis" subtitle="Pagamento via PIX · Renovação mensal" />
          <div className="account-plan-grid">
            {plans.map((plan) => (
              <article className={`account-plan ${plan.featured ? "featured" : ""}`} key={plan.id}>
                {plan.featured ? <span className="popular-badge">POPULAR</span> : null}
                <h3>{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
                <div className="plan-price"><small>R$</small><strong>{plan.price}</strong><span>/mês</span></div>
                <div className="plan-domains"><strong>{plan.maxDomains}</strong><span>domínios</span></div>
                <ul>{plan.features.slice(0, 4).map((feature) => <li key={feature}><CheckIcon />{feature}</li>)}</ul>
                <button type="button" onClick={() => setSelectedPlan(plan)}>Pagar com PIX <span>›</span></button>
              </article>
            ))}
          </div>
        </section>

        <section className="account-card">
          <SectionTitle icon="🔒" title="Segurança e Acesso" />
          <div className="security-grid">
            <form className="security-panel" onSubmit={submitEmail}>
              <h3>✉ Alterar Email</h3>
              <p>Email atual: <span>conta autenticada</span></p>
              <input aria-label="Novo endereço de email" type="email" placeholder="Novo endereço de email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button type="submit">Alterar Email</button>
            </form>
            <form className="security-panel" onSubmit={submitPassword}>
              <h3>🔒 Alterar Senha</h3>
              <input aria-label="Nova senha" type="password" placeholder="Nova senha" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <input aria-label="Confirmar nova senha" type="password" placeholder="Confirmar nova senha" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required />
              <button className="orange" type="submit">🔒 Alterar Senha</button>
            </form>
          </div>
          {feedback ? <p className="account-feedback" role="status">{feedback}</p> : null}
        </section>
      </section>
      {selectedPlan ? <PixModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} /> : null}
    </main>
  );
}

function AccountProfileMenu() {
  async function logout() {
    localStorage.clear();
    sessionStorage.clear();
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch { /* redirect regardless */ }
    window.location.href = "/login";
  }

  return (
    <div className="account-profile-menu" role="menu">
      <div className="account-profile-menu-head"><strong>usuário</strong><span>conta autenticada</span></div>
      <a href="/minerar" role="menuitem">⛏ <span>Minerar CNPJs</span></a>
      <a href="/minha-area" role="menuitem">▦ <span>Minha Área</span></a>
      <a href="/minha-conta" role="menuitem">◯ <span>Minha Conta</span></a>
      <a href="/dashboard/docs" role="menuitem">▤ <span>Manual / Ajuda</span></a>
      <div className="account-profile-separator" />
      <button type="button" role="menuitem" onClick={logout}>↪ <span>Sair</span></button>
    </div>
  );
}

function PixModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  return (
    <div className="pix-layer" role="dialog" aria-modal="true" aria-labelledby="pix-title">
      <button className="pix-backdrop" aria-label="Fechar pagamento" onClick={onClose} />
      <section className="pix-modal">
        <header>
          <div><h2 id="pix-title">Pagar via PIX</h2><p>{plan.name} · R$ {plan.price.toFixed(2).replace(".", ",")}/mês</p></div>
          <button type="button" aria-label="Fechar" onClick={onClose}>×</button>
        </header>
        <div className="pix-loading">
          <span className="spinner" aria-hidden="true" />
          <p>Gerando dados do Pix...</p>
        </div>
      </section>
    </div>
  );
}
