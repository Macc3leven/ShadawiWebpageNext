"use client";

import { useEffect, useRef, useState } from "react";
import { unityViewer } from "@/lib/unityViewer";
import { formStageName, specimenFormTitle } from "@/lib/specimenForms";
import styles from "./SpecimenDisplay.module.css";

// The display maps in the Unity project's Environments Addressables group. The content server
// doesn't list these yet, so a new map has to be added here too.
const MAPS = [
  { address: "", label: "Base stage" },
  { address: "Environment/Display/SkullCorridor", label: "Skull Corridor" },
  { address: "Environment/Display/CloudRealm", label: "Cloud Realm" },
  { address: "Environment/Display/SciFiRoom", label: "Sci-Fi Room" },
];

// Friendlier names for attributes whose data name isn't meant for visitors
const ATTRIBUTE_LABELS = { PurgLvl: "Level" };

const BADGE_CLASSES = {
  strike: styles.badgeStrike,
  projectile: styles.badgeProjectile,
  barrier: styles.badgeDefense,
  defense: styles.badgeDefense,
  alter: styles.badgeAlter,
};

// Metrics nothing supplies yet, listed so the panel shows what's planned
const SOON_POPULATION = ["Population cap", "Minted", "Burned"];
const SOON_LINEAGE = ["Rarest form", "Most popular form"];
const SOON_OWNERSHIP = ["Unique owners", "Longest holder"];
const SOON_BATTLE = ["Win rate", "Victories", "Power index"];

// "domigra_abilitySlot2_sword-dance" -> "sword-dance"
const actionSlug = (id) => String(id).split("_").filter(Boolean).pop() ?? String(id);
const nameSlug = (name) => String(name).trim().toLowerCase().replace(/\s+/g, "-");
const isAbilityAction = (action) => /abilitySlot/i.test(String(action.id));

// "domigra_abilitySlot2_sword-dance" -> "Sword Dance", "humanoid_death01" -> "Death 01"
function actionLabel(id) {
  return actionSlug(id)
    .split("-")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/(\D)(\d+)$/, "$1 $2");
}

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

// ============================================================
// OVERVIEW
// ============================================================

// Long legends stop after three lines, with "...read more" at the end of the third
function Legend({ text }) {
  const measureRef = useRef(null);
  const [isLong, setIsLong] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const measure = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      setIsLong(el.offsetHeight > lineHeight * 3 + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  const clamped = isLong && !expanded;

  return (
    <div className={styles.legendBox}>
      {/* An invisible full copy, so the length can be measured at the current width */}
      <p ref={measureRef} className={`${styles.legend} ${styles.legendMeasure}`} aria-hidden="true">{text}</p>
      <p className={`${styles.legend}${clamped ? " " + styles.legendClamped : ""}`}>
        {clamped && (
          <button type="button" className={`${styles.legendToggle} ${styles.legendMore}`} aria-expanded={false} onClick={() => setExpanded(true)}>
            ...read more
          </button>
        )}
        {text}
        {isLong && expanded && (
          <>
            {" "}
            <button type="button" className={styles.legendToggle} aria-expanded={true} onClick={() => setExpanded(false)}>
              show less
            </button>
          </>
        )}
      </p>
    </div>
  );
}

export function OverviewPanel({ view, legend }) {
  return (
    <>
      {legend && (
        <Section title="Legend">
          <Legend text={legend} />
        </Section>
      )}
      {view.attributes?.length > 0 && (
        <Section title="Attributes">
          <ul className={styles.attrList}>
            {view.attributes.map((a) => (
              <li key={a.name} className={styles.attrItem}>
                <span className={styles.attrLabel}>{ATTRIBUTE_LABELS[a.name] ?? a.name}</span>
                <span className={styles.attrValue}>{a.value}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
      {view.stats?.length > 0 && (
        <Section title="Stats">
          <div className={styles.statList}>
            {view.stats.map((s) => (
              <div key={s.name} className={styles.stat}>
                <div className={styles.statTop}>
                  <span className={styles.statName}>{s.name}</span>
                  <span className={styles.statValue}>
                    {s.max ? `${s.value.toLocaleString()} / ${s.max.toLocaleString()}` : s.value.toLocaleString()}
                  </span>
                </div>
                {/* A stat with no maximum (weight) is just a number, so it has no bar */}
                {s.max && (
                  <div className={styles.statTrack}>
                    <div className={styles.statFill} style={{ width: `${Math.min(100, (s.value / s.max) * 100)}%` }} />
                  </div>
                )}
                {s.description && <p className={styles.statDesc}>{s.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

// ============================================================
// CONTROL
// ============================================================

function ActionRow({ action, playing }) {
  return (
    <button
      type="button"
      className={`${styles.actionRow}${playing ? " " + styles.actionRowPlaying : ""}`}
      aria-pressed={playing}
      disabled={!action.allowed}
      onClick={() => unityViewer.playAction(action.id)}
    >
      <span className={styles.actionText}>
        <span className={styles.actionName}>{actionLabel(action.id)}</span>
        <span className={styles.actionType}>{action.type}</span>
      </span>
      <span className={`${styles.actionStatus}${playing ? " " + styles.actionStatusPlaying : ""}`}>
        {!action.allowed ? "Blocked in display mode" : playing ? "Playing" : "Play"}
      </span>
    </button>
  );
}

export function ControlPanel({ viewer, hasModel }) {
  if (!hasModel) return <p className={styles.panelNote}>3D is coming soon for this form.</p>;

  const basics = viewer.actions.filter((action) => !isAbilityAction(action));
  const abilities = viewer.actions.filter(isAbilityAction);

  return (
    <>
      <div className={styles.section}>
        <label className={styles.mapLabel}>
          <span className={styles.sectionTitle}>Map</span>
          <span className={styles.mapSelectWrap}>
            <select
              className={styles.mapSelect}
              value={viewer.map.address}
              disabled={viewer.map.status === "loading"}
              onChange={(e) => unityViewer.setMap(e.target.value)}
            >
              {MAPS.map((map) => (
                <option key={map.address} value={map.address}>{map.label}</option>
              ))}
            </select>
            <svg className={styles.mapChevron} aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </label>
      </div>
      {basics.length > 0 && (
        <Section title="Actions">
          <div className={styles.actionList}>
            {basics.map((action) => <ActionRow key={action.id} action={action} playing={viewer.playingId === action.id} />)}
          </div>
        </Section>
      )}
      {abilities.length > 0 && (
        <Section title="Abilities">
          <div className={styles.actionList}>
            {abilities.map((action) => <ActionRow key={action.id} action={action} playing={viewer.playingId === action.id} />)}
          </div>
        </Section>
      )}
    </>
  );
}

// ============================================================
// METRICS
// ============================================================

function Metric({ label, value }) {
  return (
    <div>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricValue}>{value?.toLocaleString()}</div>
    </div>
  );
}

function SoonMetrics({ labels }) {
  return labels.map((label) => (
    <div key={label}>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricSoon}>Coming soon</div>
    </div>
  ));
}

export function MetricsPanel({ specimen, view }) {
  const population = view.population ?? {};

  return (
    <>
      <Section title="Population">
        <div className={styles.metricGrid}>
          <Metric label="Total" value={population.total ?? 0} />
          <Metric label="Owned" value={population.owned ?? 0} />
          <Metric label="This form" value={population.thisForm ?? 0} />
          <SoonMetrics labels={SOON_POPULATION} />
        </div>
        {!population.total && <p className={styles.metricNote}>No {specimen.name} have been minted yet.</p>}
      </Section>
      <Section title="Lineage">
        <div className={styles.metricGrid}>
          <Metric label="Total forms" value={specimen.totalForms ?? specimen.forms?.length ?? 0} />
          <SoonMetrics labels={SOON_LINEAGE} />
        </div>
        <div className={styles.formRows}>
          {specimen.forms?.map((form, index) => (
            <div key={index} className={styles.formRow}>
              <span className={styles.formRowName}>
                {formStageName(index)} <span className={styles.formRowTitle}>{form.title ?? specimenFormTitle(specimen.name, index)}</span>
              </span>
              <span className={styles.formRowCount}>{(form.population?.thisForm ?? 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Ownership">
        <div className={styles.metricGrid}><SoonMetrics labels={SOON_OWNERSHIP} /></div>
      </Section>
      <Section title="Battle">
        <div className={styles.metricGrid}><SoonMetrics labels={SOON_BATTLE} /></div>
      </Section>
    </>
  );
}

// ============================================================
// ABILITIES
// ============================================================

// The content server's abilities, each matched to its Unity action by name so it can play.
// Actions the server doesn't describe yet still get a card with what Unity knows about them.
function abilityCards(view, viewer) {
  const actions = viewer.actions.filter(isAbilityAction);
  const described = (view.abilities ?? []).map((ability) => ({
    ...ability,
    action: actions.find((action) => actionSlug(action.id) === nameSlug(ability.name)),
  }));
  const undescribed = actions
    .filter((action) => !described.some((card) => card.action?.id === action.id))
    .map((action) => ({ name: actionLabel(action.id), type: action.type, action }));
  return [...described, ...undescribed];
}

export function AbilitiesPanel({ view, viewer }) {
  const cards = abilityCards(view, viewer);

  if (cards.length === 0) return <p className={styles.panelNote}>No abilities listed.</p>;

  return cards.map((card) => {
    const playable = card.action?.allowed;
    const playing = Boolean(card.action) && viewer.playingId === card.action.id;
    const Card = playable ? "button" : "div";
    const buttonProps = playable
      ? { type: "button", "aria-pressed": playing, onClick: () => unityViewer.playAction(card.action.id) }
      : {};

    return (
      <Card
        key={card.name}
        className={`${styles.abilityCard}${playable ? " " + styles.abilityCardPlayable : ""}${playing ? " " + styles.abilityCardPlaying : ""}`}
        {...buttonProps}
      >
        <span className={styles.abilityTop}>
          <span className={`${styles.abilityBadge} ${BADGE_CLASSES[card.type] ?? styles.badgeStrike}`}>{card.type}</span>
          {card.cost && (
            <span className={styles.abilityCost}>{card.cost.value} {card.cost.type?.toUpperCase()}</span>
          )}
        </span>
        <span className={styles.abilityName}>{card.name}</span>
        {card.description && <span className={styles.abilityDesc}>{card.description}</span>}
        {/* Each ability category has its own stats (strike: DMG/FORCE/RANGE, barrier: BARRIER HP, …) */}
        {card.stats?.length > 0 && (
          <span className={styles.abilityStats}>
            {card.stats.map((stat) => (
              <span key={stat.label} className={styles.abilityStat}>
                <span className={styles.abilityStatLabel}>{stat.label}</span>
                <span className={styles.abilityStatValue}>{stat.value ?? "—"}</span>
              </span>
            ))}
          </span>
        )}
      </Card>
    );
  });
}
