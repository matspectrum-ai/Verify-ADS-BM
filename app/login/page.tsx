"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { AmbientBackground } from "../components/ambient-background";
import { Brand } from "../components/brand";

export default function LoginPage() {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="auth-page">
      <AmbientBackground compact />
      <div className="auth-wrap">
        <div className="auth-brand"><Brand size="md" centered /></div>
        <div className="auth-card">
          <div className="auth-card-line" />
          <header>
            <h1>Bem-vindo de volta</h1>
            <p>Acesse sua conta VerifyAds</p>
          </header>
          <form onSubmit={submit}>
            <label>
              <span>Email</span>
              <div className="field-wrap">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
                <input type="email" required autoComplete="email" placeholder="seu@email.com" />
              </div>
            </label>
            <label>
              <span>Senha</span>
              <div className="field-wrap">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input type="password" required autoComplete="current-password" placeholder="••••••••" />
              </div>
            </label>
            <button type="submit">Entrar na Minha Conta</button>
          </form>
          <p className="signup-copy">Não tem conta? <Link href="/cadastro">Criar conta grátis</Link></p>
        </div>
        <p className="back-home"><Link href="/">← Voltar ao início</Link></p>
      </div>
    </main>
  );
}
