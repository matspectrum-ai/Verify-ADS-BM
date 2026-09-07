"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { AmbientBackground } from "../components/ambient-background";
import { Brand } from "../components/brand";
import styles from "./signup.module.css";

function FieldIcon({ type }: { type: "user" | "email" | "lock" }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "user") {
    return <svg aria-hidden="true" {...common}><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>;
  }
  if (type === "email") {
    return <svg aria-hidden="true" {...common}><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>;
  }
  return <svg aria-hidden="true" {...common}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}

export default function SignupPage() {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className={`auth-page ${styles.signupPage}`}>
      <AmbientBackground compact />
      <div className="auth-wrap">
        <div className="auth-brand"><Brand size="md" centered /></div>
        <div className={`auth-card ${styles.signupCard}`}>
          <div className={`auth-card-line ${styles.signupLine}`} />
          <header>
            <h1>Criar conta gratuita</h1>
            <p>Sem cartão de crédito • Configuração em 3 minutos</p>
          </header>
          <form onSubmit={submit}>
            <label>
              <span>Nome completo</span>
              <div className="field-wrap">
                <FieldIcon type="user" />
                <input type="text" required autoComplete="name" placeholder="Seu nome" />
              </div>
            </label>
            <label>
              <span>Email</span>
              <div className="field-wrap">
                <FieldIcon type="email" />
                <input type="email" required autoComplete="email" placeholder="seu@email.com" />
              </div>
            </label>
            <div className={styles.passwordGrid}>
              <label>
                <span>Senha</span>
                <div className="field-wrap">
                  <FieldIcon type="lock" />
                  <input type="password" required autoComplete="new-password" placeholder="••••••••" />
                </div>
              </label>
              <label>
                <span>Confirmar</span>
                <div className="field-wrap">
                  <FieldIcon type="lock" />
                  <input type="password" required autoComplete="new-password" placeholder="••••••••" />
                </div>
              </label>
            </div>
            <button className={styles.submitButton} type="submit">Criar Minha Conta Grátis</button>
          </form>
          <p className="signup-copy">Já tem conta? <Link href="/login">Fazer login</Link></p>
        </div>
        <p className="back-home"><Link href="/">← Voltar ao início</Link></p>
      </div>
    </main>
  );
}
