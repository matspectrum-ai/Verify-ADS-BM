import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://brasilapi.com.br/api/cnpj/v1";
const CNPJ_RE = /^\d{14}$/;

export type BrasilApiCnpj = {
  cnpj: string;
  razao_social?: string;
  nome_fantasia?: string;
  situacao_cadastral?: number | string;
  data_situacao_cadastral?: string;
  data_inicio_atividade?: string;
  capital_social?: number | string;
  porte?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  telefone?: string;
  email?: string;
  cnae_fiscal?: number | string;
  cnae_fiscal_descricao?: string;
  natureza_juridica?: string;
  opcao_pelo_simples?: boolean;
  data_opcao_pelo_simples?: string | null;
  data_exclusao_do_simples?: string | null;
  [key: string]: unknown;
};

function normalizeCnpj(value: string | null | undefined) {
  return (value ?? "").replace(/\D/g, "");
}

function yearsSince(value: string) {
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return 0;
  const opened = new Date(parts[0], parts[1] - 1, parts[2]);
  if (Number.isNaN(opened.getTime())) return 0;
  return Math.floor(Math.abs(Date.now() - opened.getTime()) / 31557600000);
}

function calculateTrustScore(data: BrasilApiCnpj) {
  const capital = Number(data.capital_social ?? 0);
  const capitalScore = capital >= 1e9 ? 20 : capital >= 1e8 ? 18 : capital >= 1e7 ? 16 : capital >= 1e6 ? 14 : capital >= 1e5 ? 10 : capital >= 1e4 ? 6 : 2;
  const age = yearsSince(String(data.data_inicio_atividade ?? ""));
  const ageScore = age >= 50 ? 20 : age >= 20 ? 18 : age >= 10 ? 15 : age >= 5 ? 12 : age >= 2 ? 8 : age >= 1 ? 5 : 2;
  const porte = String(data.porte ?? "");
  const sizeScore = porte === "DEMAIS" ? 15 : porte === "MEDIO" ? 10 : porte === "EPP" ? 7 : porte === "ME" || porte === "MICRO EMPRESA" ? 5 : 3;
  const fields = [data.telefone, data.email, data.cnae_fiscal, data.logradouro, data.bairro];
  const completenessScore = Math.min(3 * fields.filter((value) => value && String(value) !== "undefined").length, 15);
  return Math.min(99, 50 + capitalScore + ageScore + sizeScore + completenessScore);
}

function normalizePayload(data: BrasilApiCnpj) {
  const status = String(data.situacao_cadastral ?? "").toUpperCase();
  const ativa = status.includes("ATIVA") || String(data.situacao_cadastral) === "2";
  const trustScore = calculateTrustScore(data);
  return {
    ...data,
    cnpj: normalizeCnpj(data.cnpj),
    capital_social: Number(data.capital_social ?? 0),
    situacao_cadastral: data.situacao_cadastral,
    tipo_situacao_cadastral: ativa ? "ATIVA" : status,
    data_abertura: data.data_inicio_atividade ?? "",
    cnae_principal: data.cnae_fiscal ?? "",
    ativa,
    trust_score: trustScore,
    trust_score_breakdown: {
      cadastral_situation: 40,
      capital_social: 0,
      activity_time: 0,
      company_size: 0,
      location: 0,
      total: trustScore,
      level: trustScore >= 80 ? "excellent" : trustScore >= 60 ? "good" : trustScore >= 40 ? "medium" : "low",
    },
  };
}

export async function GET(request: NextRequest) {
  const cnpj = normalizeCnpj(request.nextUrl.searchParams.get("cnpj"));
  if (!CNPJ_RE.test(cnpj)) {
    return NextResponse.json({ error: "CNPJ inválido", code: "INVALID_CNPJ" }, { status: 400 });
  }

  try {
    const response = await fetch(`${BASE_URL}/${cnpj}`, {
      headers: { Accept: "application/json", "User-Agent": "VerifyAds/1.0" },
      cache: "no-store",
    });
    if (response.status === 404) {
      return NextResponse.json({ error: "CNPJ não encontrado", code: "NOT_FOUND", cnpj }, { status: 404 });
    }
    if (response.status === 429) {
      return NextResponse.json(
        { error: "BrasilAPI limitou temporariamente a consulta", code: "RATE_LIMIT", cnpj },
        { status: 429, headers: { "Retry-After": response.headers.get("retry-after") ?? "5" } },
      );
    }
    if (!response.ok) {
      return NextResponse.json({ error: "BrasilAPI indisponível", code: "UPSTREAM_ERROR", status: response.status }, { status: 502 });
    }
    const data = (await response.json()) as BrasilApiCnpj;
    return NextResponse.json(normalizePayload(data), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Falha ao consultar BrasilAPI", code: "UPSTREAM_UNAVAILABLE" }, { status: 502 });
  }
}
