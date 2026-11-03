import { useState } from "react";
import Link from "next/link";
import { classColor } from "@/lib/specimenClasses";
import KinImage from "./KinImage";
import MeritEmblem from "./MeritEmblem";
import styles from "./page.module.css";

const PREVIEW_COUNT = 5;

export function ProgressBar({ value, max, label }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className={styles.bar} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <span className={styles.barFill} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function NextMerit({ merit }) {
  return (
    <section className={`${styles.panel} ${styles.nextMerit}`}>
      <h3 className={styles.panelTitle}>Next Merit</h3>
      {merit ? (
        <div className={styles.nextMeritBody}>
          <MeritEmblem icon={merit.icon} className={styles.nextMeritIcon} />
          <div className={styles.nextMeritText}>
            <div className={styles.nextMeritHead}>
              <p className={styles.meritName}>{merit.name}</p>
              <span className={styles.meritCount}>{merit.progress} / {merit.target}</span>
            </div>
            <p className={styles.meritDesc}>{merit.description}</p>
            <ProgressBar value={merit.progress} max={merit.target} label={`${merit.name} progress`} />
          </div>
        </div>
      ) : (
        <p className={styles.muted}>Every Merit earned. More are coming.</p>
      )}
    </section>
  );
}

export default function CollectionPanel({ collection, nextMerit, kinOwned }) {
  const [expanded, setExpanded] = useState(false);
  const { kin, recent } = collection;
  const shown = expanded ? kin : kin.slice(0, PREVIEW_COUNT);
  const hasMore = !expanded && kin.length > PREVIEW_COUNT;

  return (
    <>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>My Collection</h2>
        {kin.length > PREVIEW_COUNT && (
          <button type="button" className={styles.textLink} onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Show less" : "View all"} <span aria-hidden="true">{expanded ? "↑" : "→"}</span>
          </button>
        )}
      </div>

      {kin.length === 0 ? (
        <div className={`${styles.panel} ${styles.empty}`}>
          <p className={styles.emptyTitle}>Your collection is empty</p>
          <p className={styles.muted}>Every Kin you own across Shadawi shows up here.</p>
          <Link href="/shop" className={styles.primaryBtn}>Find your first specimen</Link>
        </div>
      ) : (
        <ul className={styles.kinGrid}>
          {shown.map((k) => (
            <li key={k.id} className={styles.kinCard} style={{ "--class-color": classColor(k.className) }}>
              <KinImage kin={k} />
              <div className={styles.kinMeta}>
                <p className={styles.kinName}>{k.name}</p>
                <p className={styles.kinSid}>SID {k.sid}{k.kinNumber && <> · #{k.kinNumber}</>}{k.isNft && <span className={styles.nftTag}>NFT</span>}</p>
              </div>
            </li>
          ))}
          {hasMore && (
            <li>
              <button type="button" className={styles.moreTile} onClick={() => setExpanded(true)}>
                <span className={styles.morePlus} aria-hidden="true">+</span>
                <span>{Math.max(kinOwned, kin.length) - PREVIEW_COUNT} more</span>
              </button>
            </li>
          )}
        </ul>
      )}

      <div className={styles.lowerRow}>
        <section className={`${styles.panel} ${styles.recent}`}>
          <h3 className={styles.panelTitle}>Recent Acquisitions</h3>
          {recent.length ? (
            <ul className={styles.recentList}>
              {recent.map((k) => (
                <li key={k.eventId || k.id} title={`${k.name} · SID ${k.sid}${k.kinNumber ? ` · #${k.kinNumber}` : ""}`}>
                  <KinImage kin={k} className={styles.recentImg} />
                  <span className={styles.srOnly}>{k.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.muted}>Nothing yet. New Kin appear here as you collect them.</p>
          )}
        </section>
        <NextMerit merit={nextMerit} />
      </div>
    </>
  );
}
