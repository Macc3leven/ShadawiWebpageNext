import { SPECIMEN_CLASSES, classColor, classLabel } from "@/lib/specimenClasses";
import styles from "./page.module.css";

// Axis step that gives four tidy ticks, e.g. 0 · 3 · 6 · 9 · 12
function niceStep(max) {
  const raw = Math.max(1, max) / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 3, 5, 10].map((m) => m * pow).find((s) => s >= raw);
  return Math.max(1, Math.ceil(step));
}

const ICONS = {
  kin: "M12 3 3 7.5l9 4.5 9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5",
  species: "M12 3l9 9-9 9-9-9zM12 8l4 4-4 4-4-4z",
  nft: "M12 3l8 4.5v9L12 21l-8-4.5v-9z",
  classes: "M12 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM6.5 13a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM17.5 13a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z",
};

const StatIcon = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

export default function MetricsPanel({ stats, byClass }) {
  // Every realm gets a row, so the gaps in a collection are visible too
  const counts = new Map(byClass.map((c) => [c.className, c.count]));
  const rows = SPECIMEN_CLASSES.map((c) => ({ className: c, count: counts.get(c) || 0 }))
    .sort((a, b) => b.count - a.count);
  if (counts.get(null)) rows.push({ className: null, count: counts.get(null) });

  const max = Math.max(0, ...rows.map((r) => r.count));
  const step = niceStep(max);
  const axisMax = step * 4;
  const ticks = [0, 1, 2, 3, 4].map((i) => i * step);
  const top = rows[0]?.count ? rows[0] : null;

  return (
    <div className={styles.metricsLayout}>
      <section className={styles.metricsMain}>
        <div className={styles.metricsHead}>
          <svg viewBox="0 0 24 24" className={styles.metricsIcon} aria-hidden="true">
            <rect x="3" y="13" width="3.5" height="8" rx="0.6" /><rect x="8.5" y="9" width="3.5" height="12" rx="0.6" />
            <rect x="14" y="5" width="3.5" height="16" rx="0.6" /><rect x="19.5" y="11" width="2.5" height="10" rx="0.6" />
          </svg>
          <div>
            <h2 className={styles.sectionTitle}>Collection Metrics</h2>
            <p className={styles.muted}>Your collection by class.</p>
          </div>
        </div>

        <div className={`${styles.panel} ${styles.chartPanel}`}>
          <div className={styles.chart} style={{ "--ticks": ticks.length - 1 }}>
            {rows.map((r) => (
              <div key={r.className || "none"} className={styles.chartRow}>
                <span className={styles.chartLabel}>{classLabel(r.className)}</span>
                <div className={styles.chartTrack}>
                  <span
                    className={styles.chartBar}
                    style={{ width: `${(r.count / axisMax) * 100}%`, background: classColor(r.className) }}
                  />
                  <span className={styles.chartValue} style={{ left: `${(r.count / axisMax) * 100}%` }}>{r.count}</span>
                </div>
              </div>
            ))}
            <div className={styles.chartAxis} aria-hidden="true">
              <span />
              <div className={styles.chartTicks}>
                {ticks.map((t) => <span key={t} style={{ left: `${(t / axisMax) * 100}%` }}>{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className={`${styles.panel} ${styles.overview}`}>
        <h3 className={styles.panelTitle}>Collection Overview</h3>
        <dl className={styles.overviewList}>
          {[
            { icon: ICONS.kin, label: "Total Kin Owned", value: stats.kinOwned },
            { icon: ICONS.species, label: "Unique Species", value: stats.uniqueSpecies },
            { icon: ICONS.nft, label: "NFT Holdings", value: stats.nftsOwned },
            { icon: ICONS.classes, label: "Classes Collected", value: <>{stats.classesCollected}<small> / {stats.classesTotal}</small></> },
          ].map(({ icon, label, value }) => (
            <div key={label} className={styles.overviewRow}>
              <StatIcon d={icon} />
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <h3 className={styles.panelTitle}>Top Class</h3>
        {top ? (
          <div className={styles.topClass} style={{ "--class-color": classColor(top.className) }}>
            <span className={styles.topClassMark} aria-hidden="true">{classLabel(top.className).slice(0, 1)}</span>
            <div>
              <p className={styles.topClassName}>{classLabel(top.className)}</p>
              <p className={styles.muted}>{top.count} Kin</p>
            </div>
          </div>
        ) : (
          <p className={styles.muted}>Collect a Kin to find your top class.</p>
        )}
      </aside>
    </div>
  );
}
