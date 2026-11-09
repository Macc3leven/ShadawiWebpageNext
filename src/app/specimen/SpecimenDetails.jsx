"use client";

import { useState } from "react";
import styles from "./page.module.css";

function badgeClass(type) {
  const map = { strike: styles.badgeStrike, projectile: styles.badgeProjectile, barrier: styles.badgeDefense, defense: styles.badgeDefense, alter: styles.badgeAlter };
  return map[type] || styles.badgeStrike;
}

// A specimen's Overview, Abilities and Metrics tabs, shared by the card modal and the 3D viewer.
// view: the selected form's details; legend: the species legend; flat: no overlap with an image above
export default function SpecimenDetails({ view, legend, flat = false }) {
  const [tab, setTab] = useState("overview");

  return (
    <>
      <div className={`${styles.modalTabs}${flat ? " " + styles.modalTabsFlat : ""}`}>
        {["overview", "abilities", "metrics"].map((t) => (
          <button
            key={t}
            className={`${styles.modalTab}${tab === t ? " " + styles.modalTabActive : ""}`}
            onClick={() => setTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className={styles.modalBody}>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <>
            {legend && (
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>LEGEND</h3>
                <p className={styles.legend}>{legend}</p>
              </div>
            )}
            {view.attributes?.length > 0 && (
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>ATTRIBUTES</h3>
                <ul className={styles.attrList}>
                  {view.attributes.map((a) => (
                    <li key={a.name} className={styles.attrItem}>
                      <span className={styles.attrLabel}>{a.name}</span>
                      <span className={styles.attrValue}>{a.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {view.stats?.length > 0 && (
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>STATS</h3>
                <div className={styles.statBars}>
                  {view.stats.map((s) => (
                    <div key={s.name} className={styles.statRow}>
                      <span className={styles.statName} title={s.description}>{s.name}</span>
                      {/* A stat with no maximum (weight) is just a number, so its bar column stays empty */}
                      {s.max ? (
                        <div className={styles.statTrack}>
                          <div className={styles.statFill} style={{ width: `${Math.min(100, (s.value / s.max) * 100)}%` }} />
                        </div>
                      ) : <span />}
                      <span className={styles.statVal}>
                        {s.max ? `${s.value.toLocaleString()} / ${s.max.toLocaleString()}` : s.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ABILITIES */}
        {tab === "abilities" && (
          <div className={styles.abilitiesList}>
            {!view.abilities?.length && (
              <p className={styles.noData} style={{ margin: "20px 0" }}>No abilities listed.</p>
            )}
            {view.abilities?.map((ab) => (
              <div key={ab.name} className={styles.abilityCard}>
                <div className={styles.abilityTop}>
                  <div className={styles.abilityInfo}>
                    <span className={`${styles.abilityBadge} ${badgeClass(ab.type)}`}>{ab.type}</span>
                    <p className={styles.abilityName}>{ab.name}</p>
                    <p className={styles.abilityDesc}>{ab.description}</p>
                  </div>
                  <span className={styles.abilityCost}>
                    {ab.cost?.value} {ab.cost?.type?.toUpperCase()}
                  </span>
                </div>
                {/* Each ability category has its own stats (strike: DMG/FORCE/RANGE, barrier: BARRIER HP, …) */}
                <div className={styles.abilityStats}>
                  {ab.stats?.map((st) => (
                    <div key={st.label} className={styles.abilityStat}>
                      <span className={styles.asLabel}>{st.label}</span>
                      <span className={styles.asValue}>{st.value ?? "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* METRICS */}
        {tab === "metrics" && (
          view.metrics?.groups ? (
            <div className={styles.metricsContent}>
              {view.metrics.groups.map((group) => (
                <div key={group.title} className={styles.metricsGroup}>
                  <h4 className={styles.metricsGroupTitle}>{group.title}</h4>
                  <div className={styles.metricsGrid}>
                    {group.items.map((item) => (
                      <div key={item.label} className={styles.metricItem}>
                        <span className={styles.mLabel}>{item.label}</span>
                        <span className={styles.mValue}>{item.value?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noData} style={{ margin: "20px 0" }}>No metrics available.</p>
          )
        )}
      </div>
    </>
  );
}
