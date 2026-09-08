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

function normalizeCnpj(value: string | null) {
  return (value ?? "").replace(/\D/g, "");
}

function normalizePayload(data: BrasilApiCnpj) {
  const status = String(data.situacao_cadastral ?? "").toUpperCase();
  return {
    ...data,
    cnpj: normalizeCnpj(data.cnpj),
    capital_social: Number(data.capital_social ?? 0),
    situacao_cadastral: data.situacao_cadastral,
    ativa: status === "ATIVA" || String(data.situacao_cadastral) === "2",
  };
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("cnpj");
  const cnpj = normalizeCnpj(raw);
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
      return NextResponse.json({ error: "BrasilAPI limitou temporariamente a consulta", code: "RATE_LIMIT", cnpj }, { status: 429, headers: { "Retry-After": response.headers.get("retry-after") ?? "5" } });
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
