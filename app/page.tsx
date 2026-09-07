import Link from "next/link";
import { AmbientBackground } from "./components/ambient-background";
import { Brand } from "./components/brand";

const benefits = [
  { tone: "emerald", icon: "message", title: "+2.000 Envios no WhatsApp", body: "Acesse a WhatsApp Business API com capacidade de envio em massa. Chegue a mais clientes com campanhas de marketing direto." },
  { tone: "blue", icon: "chart", title: "Limite de até $100k/dia", body: "Aumente seu limite diário de anúncios de $50 para até $100.000/dia. Escale suas campanhas sem restrições de gasto." },
  { tone: "purple", icon: "code", title: "Criar Apps no Facebook", body: "Desbloqueie developer features exclusivas do Meta para criar e publicar aplicativos vinculados à sua empresa verificada." },
  { tone: "red", icon: "shield", title: "Proteção Contra Imposores", body: "O Meta monitora ativamente tentativas de impersonação da sua marca, protegendo sua reputação e seus clientes." },
  { tone: "yellow", icon: "badge", title: "Selo Azul de Verificação", body: "Apareça como empresa legítima com o badge verificado nas buscas do Facebook e Instagram. Mais confiança, mais conversões." },
  { tone: "cyan", icon: "support", title: "Suporte Prioritário Meta", body: "Acesso direto a agentes do Meta para resolver limites de conta, bloqueios e problemas com campanhas rapidamente." },
] as const;

const metrics = [
  { value: "2.000+", label: "Envios WhatsApp", icon: "message" },
  { value: "$100k", label: "Limite Diário Possível", icon: "chart" },
  { value: "< 3min", label: "Para Configurar", icon: "zap" },
  { value: "100%", label: "Automatizado", icon: "phone" },
] as const;

const steps = [
  { icon: "globe", title: "Cadastre e Adicione seu Domínio", body: "Crie sua conta, informe o CNPJ da empresa e adicione o domínio que deseja verificar no Facebook Business." },
  { icon: "lock", title: "Configure o DNS em Minutos", body: "Siga as instruções geradas automaticamente. Adicione um registro CNAME ou A no seu registrador de domínio." },
  { icon: "check", title: "Verifique e Ative sua Empresa", body: 'Clique em "Verificar Conexão". O sistema checa o DNS em tempo real. Sua landing page verificada vai ao ar imediatamente.' },
] as const;

const plans = [
  { name: "Starter", price: "$100", domains: 4, popular: false, features: ["4 domínios verificados", "Landing pages automáticas", "Verificação DNS em tempo real", "Relatório de status", "Suporte por email"] },
  { name: "Business", price: "$150", domains: 8, popular: true, features: ["8 domínios verificados", "Landing pages automáticas", "Verificação DNS em tempo real", "Relatório detalhado", "Suporte prioritário", "Pixel do Facebook integrado"] },
  { name: "Agency", price: "$200", domains: 12, popular: false, features: ["12 domínios verificados", "Landing pages automáticas", "Verificação DNS em tempo real", "Dashboard completo", "Suporte dedicado", "Pixel do Facebook integrado", "White label disponível"] },
] as const;

function Icon({ name }: { name: string }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, React.ReactNode> = {
    message: <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />,
    chart: <><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M18 17V9M13 17V5M8 17v-3" /></>,
    code: <><path d="m16 18 6-6-6-6M8 6l-6 6 6 6M14.5 4l-5 16" /></>,
    shield: <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />,
    badge: <><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m9 12 2 2 4-4" /></>,
    support: <><path d="M4 13a8 8 0 0 1 16 0" /><path d="M18 19c0 1.1-.9 2-2 2h-3M4 13v4a2 2 0 0 0 2 2h1v-8H6a2 2 0 0 0-2 2ZM20 13v4a2 2 0 0 1-2 2h-1v-8h1a2 2 0 0 1 2 2Z" /></>,
    zap: <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />,
    phone: <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></>,
    globe: <><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    check: <><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></>,
  };
  return <svg aria-hidden="true" {...common}>{paths[name]}</svg>;
}

export default function HomePage() {
  return (
    <main className="marketing-page">
      <AmbientBackground />
      <nav className="top-nav">
        <div className="nav-inner">
          <Brand />
          <div className="nav-center">
            <a href="#beneficios">Benefícios</a>
            <a href="#como-funciona">Como Funciona</a>
            <a href="#planos">Planos</a>
          </div>
          <Link href="/login" className="area-button">Minha Área <span aria-hidden="true">›</span></Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-pill"><span className="live-dot"><i /></span>Plataforma Oficial de Verificação para Meta Business</div>
        <h1>Verifique sua Empresa <span className="gradient-text hero-gradient">no Facebook</span><br />e Desbloqueie<br className="hero-mobile-break" /> Recursos Exclusivos</h1>
        <p>Conecte seu domínio, gere sua landing page verificada e tenha acesso a limites maiores de anúncios, WhatsApp Business API — em menos de 3 minutos.</p>
        <div className="hero-actions">
          <Link href="/login" className="primary-cta shimmer-card">Acessar Minha Área <span aria-hidden="true">→</span></Link>
          <a href="#beneficios" className="secondary-cta">Ver Benefícios</a>
        </div>
        <small>Sem cartão de crédito • Configuração em 3 minutos • Suporte em português</small>
      </section>

      <section className="marketing-section benefits-section" id="beneficios">
        <div className="wide-container">
          <header className="section-title">
            <p>Vantagens Exclusivas</p>
            <h2>Por que verificar sua empresa <span className="gradient-text">no Facebook Business?</span></h2>
            <span>Empresas verificadas têm acesso a recursos que a maioria dos anunciantes nunca saberá que existem.</span>
          </header>
          <div className="benefits-grid">
            {benefits.map((benefit) => (
              <article className={`benefit-card tone-${benefit.tone} shimmer-card`} key={benefit.title}>
                <div className="card-top-line" />
                <div className="benefit-icon"><Icon name={benefit.icon} /></div>
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="metrics-section">
        <div className="wide-container metrics-grid">
          {metrics.map((metric) => (
            <div className="metric" key={metric.label}>
              <div className="metric-icon"><Icon name={metric.icon} /></div>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="marketing-section steps-section" id="como-funciona">
        <div className="steps-container">
          <header className="section-title purple-title">
            <p>Processo Simples</p>
            <h2>Verificação em <span className="gradient-text purple-gradient">3 passos</span></h2>
            <span>Do cadastro à empresa verificada em menos de 3 minutos.</span>
          </header>
          <div className="steps-grid">
            <div className="step-connector" />
            {steps.map((step, index) => (
              <article className="step-item" key={step.title}>
                <div className="step-icon"><Icon name={step.icon} /><b>{index + 1}</b></div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section pricing-section" id="planos">
        <div className="pricing-container">
          <header className="section-title">
            <p>Planos e Preços</p>
            <h2>Escolha seu plano</h2>
            <span>Pague por domínios verificados. Quanto mais domínios, mais empresas você pode gerenciar.</span>
          </header>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article className={`plan-card${plan.popular ? " plan-popular" : ""}`} key={plan.name}>
                <div className="shimmer-card plan-shimmer" />
                {plan.popular ? <div className="popular-badge">⭐ Mais Popular</div> : null}
                <div className="plan-heading">
                  <p>{plan.name}</p>
                  <div><strong>{plan.price}</strong><span>/mês</span></div>
                  <small>{plan.domains} domínios incluídos</small>
                </div>
                <ul>{plan.features.map((feature) => <li key={feature}><Icon name="check" />{feature}</li>)}</ul>
                <Link href="/cadastro" className={`plan-cta${plan.popular ? " plan-cta-primary" : ""}`}>Começar com {plan.name}</Link>
              </article>
            ))}
          </div>
          <p className="pricing-note">Todos os planos incluem verificação automática de DNS, landing pages profissionais e painel completo.</p>
        </div>
      </section>

      <footer className="marketing-footer">
        <div className="wide-container footer-inner">
          <Brand />
          <p>© 2026 VerifyAds. Todos os direitos reservados.</p>
          <nav><Link href="/l/privacidade">Privacidade</Link><Link href="/l/termos">Termos</Link><Link href="/login">Login</Link></nav>
        </div>
      </footer>
    </main>
  );
}
