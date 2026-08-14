export type Stat = {
  label: string;
  value: string;
  note?: string;
};

/** Rejilla de métricas al estilo del "Agency Snapshot" de Basic. */
export default function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="stat-grid">
      {stats.map((s) => (
        <div className="stat" key={s.label}>
          <span className="stat-label">{s.label}</span>
          <span className="stat-value">{s.value}</span>
          {s.note ? <span className="stat-note">{s.note}</span> : null}
        </div>
      ))}
    </div>
  );
}
