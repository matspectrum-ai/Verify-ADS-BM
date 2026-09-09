"use client";

export type CachedCompany = {
  cnpj: string;
  razao_social?: string;
  nome_fantasia?: string;
  uf?: string;
  municipio?: string;
  capital_social?: number;
  porte?: string;
  trust_score?: number;
  found_at?: string;
  times_verified?: number;
};

type BlacklistEntry = { cnpj: string; reason: string; added_at: string };
type UsedEntry = { cnpj: string; used_at: string };

const KEYS = { whitelist: "cnpj_whitelist", blacklist: "cnpj_blacklist", used: "cnpj_used", lastSync: "cnpj_last_sync" } as const;

function read<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}
function write<T>(key: string, value: T) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage may be unavailable */ } }

export const cnpjCache = {
  whitelist(): CachedCompany[] { return read<CachedCompany[]>(KEYS.whitelist, []); },
  blacklist(): BlacklistEntry[] { return read<BlacklistEntry[]>(KEYS.blacklist, []); },
  used(): UsedEntry[] { return read<UsedEntry[]>(KEYS.used, []); },
  isBlacklisted(cnpj: string) { return this.blacklist().some(entry => entry.cnpj === cnpj); },
  isUsed(cnpj: string) { return this.used().some(entry => entry.cnpj === cnpj); },
  available(): CachedCompany[] {
    const used = new Set(this.used().map(entry => entry.cnpj));
    const blocked = new Set(this.blacklist().map(entry => entry.cnpj));
    return this.whitelist().filter(company => !used.has(company.cnpj) && !blocked.has(company.cnpj));
  },
  addWhitelist(company: CachedCompany) {
    const items = this.whitelist();
    const index = items.findIndex(item => item.cnpj === company.cnpj);
    if (index >= 0) items[index] = { ...items[index], ...company, times_verified: (items[index].times_verified ?? 1) + 1 };
    else items.push({ ...company, times_verified: 1, found_at: company.found_at ?? new Date().toISOString() });
    write(KEYS.whitelist, items);
  },
  addBlacklist(cnpj: string, reason: string) {
    if (this.isBlacklisted(cnpj)) return;
    const items = this.blacklist();
    items.push({ cnpj, reason, added_at: new Date().toISOString() });
    write(KEYS.blacklist, items);
  },
  markUsed(cnpj: string) {
    if (this.isUsed(cnpj)) return;
    const items = this.used();
    items.push({ cnpj, used_at: new Date().toISOString() });
    write(KEYS.used, items);
  },
  setLastSync(value = new Date().toISOString()) { localStorage.setItem(KEYS.lastSync, value); },
  lastSync() { return localStorage.getItem(KEYS.lastSync); },
};
