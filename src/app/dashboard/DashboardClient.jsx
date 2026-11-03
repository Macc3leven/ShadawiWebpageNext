"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { userApi } from "@/lib/userApi";
import { avatarSrc } from "@/lib/avatars";
import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";
import CollectionPanel, { ProgressBar } from "./CollectionPanel";
import MetricsPanel from "./MetricsPanel";
import MeritsPanel from "./MeritsPanel";
import { DEMO_ACCOUNT, DEMO_ARCHIVE, DEMO_COLLECTION } from "./demoData";
import styles from "./page.module.css";

const TABS = [
  { id: "collection", label: "Collection" },
  { id: "metrics", label: "Collection Metrics", short: "Metrics" },
  { id: "merits", label: "Merits" },
];

// /dashboard?demo shows a sample Mage and Kin while developing — no sign-in or ASSETS_DB needed
const wantsDemo = () => process.env.NODE_ENV !== "production" && new URLSearchParams(window.location.search).has("demo");

export default function DashboardClient() {
  const router = useRouter();
  const auth = useAuth();
  const signingOut = useRef(false); // a deliberate sign-out goes home, not to the sign-in page
  const [demo, setDemo] = useState(false);
  const [demoAvatar, setDemoAvatar] = useState(DEMO_ACCOUNT.avatar);
  const [picking, setPicking] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [tab, setTab] = useState("collection");
  const [data, setData] = useState({ state: "loading" }); // loading | ready | error

  // Read after mount so the server and browser render the same first frame
  useEffect(() => setDemo(wantsDemo()), []);
  const { status, account, signOut } = demo
    ? { status: "signedIn", account: { ...DEMO_ACCOUNT, avatar: demoAvatar }, signOut: auth.signOut }
    : auth;

  // Signed out → sign-in page. Signed in without a Mage name → finish that step first.
  useEffect(() => {
    if (signingOut.current || wantsDemo()) return;
    if (status === "signedOut") router.replace("/signup");
    if (status === "signedIn" && !account.username) router.replace("/signup");
  }, [status, account, router]);

  const load = useCallback(async () => {
    if (wantsDemo()) return setData({ state: "ready", archive: DEMO_ARCHIVE, collection: DEMO_COLLECTION });
    setData({ state: "loading" });
    try {
      const [archive, collection] = await Promise.all([userApi.archive(), userApi.collection()]);
      setData({ state: "ready", archive, collection });
    } catch (err) {
      setData({ state: "error", message: err.message });
    }
  }, []);

  const isMage = status === "signedIn" && Boolean(account.username);
  useEffect(() => {
    if (isMage) load();
  }, [isMage, load]);

  // Close the portrait picker with Escape
  useEffect(() => {
    if (!picking) return;
    const onKey = (e) => e.key === "Escape" && setPicking(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [picking]);

  const changeAvatar = async (id) => {
    if (demo) {
      setDemoAvatar(id);
      return setPicking(false);
    }
    setSavingAvatar(true);
    try {
      const data = await userApi.setAvatar(id);
      auth.signedIn(data.account);
      setPicking(false);
    } catch {
      // keep the picker open so they can try again
    } finally {
      setSavingAvatar(false);
    }
  };

  if (status !== "signedIn" || !account.username) {
    return <p className={styles.loading}>Loading your Mage…</p>;
  }

  const handleSignOut = async () => {
    signingOut.current = true;
    await signOut();
    router.push("/");
  };

  // Arrow keys move between tabs, like a native tab strip
  const onTabKey = (e) => {
    const i = TABS.findIndex((t) => t.id === tab);
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (next === null) return;
    const t = TABS[(next + TABS.length) % TABS.length];
    setTab(t.id);
    document.getElementById(`tab-${t.id}`)?.focus();
  };

  const ready = data.state === "ready";
  const { archive, collection } = ready ? data : {};
  const stats = archive?.stats;
  const level = archive?.level;
  const nextMerit = archive?.merits.find((m) => m.id === archive.nextMeritId) || null;
  const show = (n) => (ready ? n : "–");

  return (
    <div className={styles.container}>
      {/* ── Identity + Archive level ── */}
      <header className={`${styles.panel} ${styles.hero}`}>
        <button type="button" className={styles.signOut} onClick={handleSignOut}>Sign out</button>

        <div className={styles.avatarArea}>
          <div className={styles.avatarWrap}>
            <Image
              src={avatarSrc(account.avatar)}
              alt="Your Mage portrait"
              width={220}
              height={220}
              className={styles.avatar}
              priority
            />
          </div>
          <button
            type="button"
            className={styles.avatarEdit}
            onClick={() => setPicking((v) => !v)}
            aria-expanded={picking}
            aria-label="Change portrait"
            title="Change portrait"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />
            </svg>
          </button>
          {picking && (
            <div className={styles.avatarPopover}>
              <AvatarPicker value={account.avatar} onChange={changeAvatar} disabled={savingAvatar} size={76} name="dashboard-avatar" />
            </div>
          )}
        </div>

        <div className={styles.identity}>
          <p className={styles.greeting}>Welcome, Mage</p>
          <h1 className={styles.name}>{account.username}</h1>
          <p className={styles.sub}>Your profile is ready. The realms await.</p>
          <p className={styles.email}>{account.email}</p>

          <ul className={styles.tiles}>
            {[
              { label: "Kin Owned", short: "Kin", value: stats?.kinOwned },
              { label: "Species", value: stats?.uniqueSpecies },
              { label: "NFTs", value: stats?.nftsOwned },
              { label: "Classes", value: stats?.classesCollected },
            ].map(({ label, short, value }) => (
              <li key={label} className={styles.tile}>
                <span className={styles.tileValue}>{show(value)}</span>
                <span className={styles.tileLabel}>
                  {short ? <><span className={styles.wideOnly}>{label}</span><span className={styles.narrowOnly}>{short}</span></> : label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.level}>
          <p className={styles.panelTitle}>Archive Level</p>
          <div className={styles.levelRow}>
            <span className={styles.levelNumber}>{ready ? String(level.level).padStart(2, "0") : "––"}</span>
            {ready && (
              <span className={styles.levelXp}>
                <b>{level.xpIntoLevel.toLocaleString()}</b> / {level.xpForNextLevel.toLocaleString()} XP
              </span>
            )}
          </div>
          <ProgressBar value={ready ? level.xpIntoLevel : 0} max={ready ? level.xpForNextLevel : 1} label="Archive level progress" />
        </div>
      </header>

      {/* ── Tabs ── */}
      <div className={styles.tabs} role="tablist" aria-label="Archive" onKeyDown={onTabKey}>
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.short ? <><span className={styles.wideOnly}>{t.label}</span><span className={styles.narrowOnly}>{t.short}</span></> : t.label}
          </button>
        ))}
      </div>

      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className={styles.tabPanel}>
        {data.state === "loading" && <p className={styles.loadingInline}>Opening your Archive…</p>}

        {data.state === "error" && (
          <div className={`${styles.panel} ${styles.empty}`}>
            <p className={styles.emptyTitle}>Couldn&apos;t open your Archive</p>
            <p className={styles.muted}>{data.message}</p>
            <button type="button" className={styles.primaryBtn} onClick={load}>Try again</button>
          </div>
        )}

        {ready && tab === "collection" && (
          <CollectionPanel collection={collection} nextMerit={nextMerit} kinOwned={stats.kinOwned} />
        )}
        {ready && tab === "metrics" && <MetricsPanel stats={stats} byClass={archive.byClass} />}
        {ready && tab === "merits" && <MeritsPanel merits={archive.merits} />}
      </div>
    </div>
  );
}
