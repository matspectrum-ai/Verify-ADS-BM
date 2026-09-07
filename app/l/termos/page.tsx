import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="legal-page">
      <article className="legal-card">
        <header className="legal-header">
          <svg className="legal-icon terms-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
          <h1>Termos de Uso</h1>
          <p>Última atualização: 9/2/2026</p>
        </header>
        <div className="legal-content">
          <h3>1. Aceitação dos Termos</h3><p>Ao acessar e utilizar este site, você concorda expressamente com os presentes Termos de Uso. Caso não concorde com qualquer termo aqui estipulado, pedimos que não utilize nossos serviços.</p>
          <h3>2. Natureza Informativa e Comercial</h3><p>Este site tem como objetivo apresentar informações institucionais sobre a empresa e seus serviços/produtos. Todas as informações são fornecidas &quot;como estão&quot; e podem ser alteradas sem aviso prévio. A empresa envida esforços para manter os dados atualizados, mas não garante a precisão absoluta em tempo real.</p>
          <h3>3. Propriedade Intelectual</h3><p>Todo o conteúdo deste site, incluindo textos, logotipos, imagens e design, é de propriedade exclusiva da empresa ou de seus licenciadores, sendo protegido pelas leis de direitos autorais e propriedade industrial vigentes. É vedada a reprodução total ou parcial sem autorização prévia.</p>
          <h3>4. Uso Aceitável</h3><p>O usuário compromete-se a:</p><ul><li>Não utilizar o site para fins ilegais ou não autorizados;</li><li>Não tentar violar a segurança do site ou acessar áreas restritas;</li><li>Não utilizar bots ou sistemas automatizados de extração de dados.</li></ul>
          <h3>5. Limitação de Responsabilidade</h3><p>Em nenhuma circunstância a empresa será responsável por danos indiretos, incidentais ou consequentes decorrentes do uso ou da incapacidade de uso deste site.</p>
          <h3>6. Alterações</h3><p>Reservamo-nos o direito de modificar estes termos a qualquer momento. O uso contínuo do site após tais alterações constitui aceitação dos novos termos.</p>
        </div>
        <footer className="legal-footer"><Link href="/">← Voltar para a Página Inicial</Link></footer>
      </article>
    </main>
  );
}
