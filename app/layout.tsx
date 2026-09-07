import type { Metadata } from "next";
import "./globals.css";
import "./parity.css";

export const metadata: Metadata = {
  title: "VerifyAds — Verifique sua Empresa no Facebook e Desbloqueie Recursos Exclusivos",
  description:
    "Conecte seu domínio, gere sua landing page verificada e tenha acesso a limites maiores de anúncios e WhatsApp Business API.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" style={{ background: "#070711" }}>
      <body>{children}</body>
    </html>
  );
}
