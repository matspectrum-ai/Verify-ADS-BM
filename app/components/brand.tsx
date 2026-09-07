import Link from "next/link";

type BrandProps = {
  href?: string;
  size?: "sm" | "md";
  centered?: boolean;
};

export function Brand({ href = "/", size = "sm", centered = false }: BrandProps) {
  const inner = (
    <span className={`brand brand-${size}${centered ? " brand-centered" : ""}`}>
      <span className="brand-icon" aria-hidden="true">
        <svg className="brand-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        </svg>
        <span className="brand-search-wrap">
          <svg className="brand-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
        </span>
      </span>
      <span className="brand-word">Verify<span>Ads</span></span>
    </span>
  );

  return href ? <Link href={href} className="brand-link" aria-label="VerifyAds">{inner}</Link> : inner;
}
