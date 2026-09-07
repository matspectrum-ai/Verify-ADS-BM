export function AmbientBackground({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`ambient-background${compact ? " ambient-compact" : ""}`} aria-hidden="true">
      <div className="ambient-grid" />
      <div className="ambient-orb ambient-orb-blue" />
      <div className="ambient-orb ambient-orb-purple" />
      <div className="ambient-orb ambient-orb-indigo" />
      {!compact ? <div className="ambient-orb ambient-orb-cyan" /> : null}
      {!compact ? <><div className="ambient-ring ambient-ring-one" /><div className="ambient-ring ambient-ring-two" /></> : null}
    </div>
  );
}
