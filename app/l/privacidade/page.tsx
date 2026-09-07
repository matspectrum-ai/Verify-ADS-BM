import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <article className="legal-card">
        <header className="legal-header">
          <svg className="legal-icon privacy-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <h1>Política de Privacidade</h1>
          <p>Última atualização: 9/2/2026</p>
        </header>
        <div className="legal-content">
          <h3>1. Coleta de Informações</h3>
          <p>Respeitamos a sua privacidade. Este site pode coletar informações de duas formas:</p>
          <ul><li>**Informações fornecidas por você:** Nome, e-mail, telefone ou outras informações ao preencher formulários de contato.</li><li>**Informações automáticas:** Cookies, endereço IP, tipo de navegador e dados de navegação para fins estatísticos e de segurança.</li></ul>
          <h3>2. Uso das Informações</h3>
          <p>As informações coletadas são utilizadas para:</p>
          <ul><li>Responder às suas solicitações e dúvidas;</li><li>Melhorar a experiência do usuário em nosso site;</li><li>Enviar comunicações sobre produtos, promoções ou atualizações, caso autorizado;</li><li>Cumprir obrigações legais.</li></ul>
          <h3>3. Cookies e Tecnologias de Rastreamento</h3>
          <p>Utilizamos cookies para personalizar conteúdo e anúncios, fornecer recursos de mídia social e analisar nosso tráfego. Você pode configurar seu navegador para recusar cookies, mas isso pode limitar algumas funcionalidades do site.<br />Nossos parceiros de publicidade e análise (como Google e Facebook) também podem coletar dados sobre sua visita.</p>
          <h3>4. Compartilhamento de Dados</h3>
          <p>Não vendemos, trocamos ou transferimos suas informações pessoais para terceiros não autorizados. Podemos compartilhar dados com fornecedores de serviços confiáveis que nos auxiliam na operação do site, desde que concordem em manter essas informações confidenciais.</p>
          <h3>5. Segurança</h3>
          <p>Implementamos diversas medidas de segurança para proteger suas informações pessoais. No entanto, nenhum método de transmissão pela internet é 100% seguro.</p>
          <h3>6. Seus Direitos (LGPD)</h3>
          <p>Você tem o direito de solicitar o acesso, correção ou exclusão de seus dados pessoais. Para exercer esses direitos, entre em contato conosco através dos canais disponíveis no site.</p>
        </div>
        <footer className="legal-footer"><Link href="/">← Voltar para a Página Inicial</Link></footer>
      </article>
    </main>
  );
}
