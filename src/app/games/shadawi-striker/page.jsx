import Button from "@/components/Button/Button";
import SupportButton from "@/components/SupportButton/SupportButton";
import styles from "./page.module.css";

export const metadata = {
  title: "Shadawi Striker — Games — Shadawi",
  description: "Real-time specimen combat. Every move counts. Coming Fall 2027 to Android, iOS, and Browser.",
};

// Placeholder art — swap these paths for real Striker screenshots/renders.
const IMAGES = {
  hero: "/images/frames/0001.png",
  battle: "/images/frames/0060.png",
  launch: "/images/frames/0096.png",
  acquisition: "/images/specimen-temp/domigra.png",
  team: "/images/specimen-temp/mightybird.png",
  moshpit: "/images/specimen-temp/cloudogre.png",
  collection: [
    "/images/specimen-temp/domigra.png",
    "/images/specimen-temp/mightybird.png",
    "/images/specimen-temp/cloudogre.png",
    "/images/specimen-temp/seapuk.png",
  ],
};

const FEATURES = [
  {
    title: "Real-Time Movement",
    text: "Freely position yourself throughout the arena.",
    icon: <path d="M16 3V29M3 16H29M16 3L12 7M16 3L20 7M16 29L12 25M16 29L20 25M3 16L7 12M3 16L7 20M29 16L25 12M29 16L25 20" />,
  },
  {
    title: "Manual Evasion",
    text: "Dodge attacks through timing and movement.",
    icon: <path d="M6 24C10 14 16 10 26 8M20 4L26 8L22 14M5 9L9 13M9 9L5 13" />,
  },
  {
    title: "Four Unique Abilities",
    text: "Master each specimen's attacks, defenses, and special techniques.",
    icon: <path d="M4 4H14V14H4ZM18 4H28V14H18ZM4 18H14V28H4ZM18 18H28V28H18Z" />,
  },
  {
    title: "Strategic Team Building",
    text: "Combine specimens whose abilities complement one another.",
    icon: <path d="M11 13A4 4 0 1 0 11 5A4 4 0 1 0 11 13ZM21 13A4 4 0 1 0 21 5A4 4 0 1 0 21 13ZM3 27C3 21 7 17 11 17C15 17 16 19 16 19C16 19 17 17 21 17C25 17 29 21 29 27" />,
  },
];

const MODES = [
  {
    name: "Acquisition Battle",
    headline: "Fight for a Specimen.",
    tagline: "Two Mages. One specimen up for grabs.",
    body: [
      "Challenge another Mage in a one-on-one battle. The winner receives an unclaimed specimen from the global population.",
    ],
    note: "The specimen comes from the available population, not your opponent's personal collection.",
    image: IMAGES.acquisition,
    tag: "1 v 1",
  },
  {
    name: "Team Battle",
    headline: "Your team falls. You fight.",
    body: [
      "Assemble a team of specimens and enter battle against another Mage.",
      "Only one character from each team fights at a time. Switch between your specimens as the fight develops, using their abilities and strengths to counter your opponent.",
      "When every specimen on your team has fallen, your Mage enters the arena for one final stand.",
    ],
    image: IMAGES.team,
    tag: "Team v Team",
  },
  {
    name: "Four-Team Moshpit",
    headline: "Four teams enter. One survives.",
    body: [
      "Four competing teams clash in a free-for-all arena.",
      "Manage your fighters, choose your targets, and survive attacks from multiple opponents. The last team standing takes the victory.",
    ],
    image: IMAGES.moshpit,
    tag: "Free-for-all",
  },
];

function SectionHeader({ number, label, title }) {
  return (
    <header className={styles.sectionHeader}>
      <p className={styles.eyebrow}>{number} — {label}</p>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </header>
  );
}

export default function ShadawiStrikerPage() {
  return (
    <main className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero} style={{ "--hero-image": `url(${IMAGES.hero})` }}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            Shadawi<br /><span>Striker</span>
          </h1>
          <p className={styles.tagline}>Real-time specimen combat. Every move counts.</p>

          <div className={styles.badges}>
            <span className={styles.launchBadge}>Coming Fall 2027</span>
            <span className={styles.platforms}>Android · iOS · Browser</span>
          </div>

          <p className={styles.lead}>
            Build your team, master your specimens, and take the fight into
            real-time 3D arenas. Shadawi Striker brings skill-based combat and
            creature collection together, where timing, strategy, and the right
            team can make all the difference.
          </p>

          <div className={styles.heroActions}>
            <Button href="/signup" variant="primary">Create your Mage account</Button>
            <SupportButton />
          </div>
        </div>
      </section>

      {/* ── 01 Battle system ── */}
      <section className={styles.section}>
        <div className={styles.split}>
          <div>
            <SectionHeader number="01" label="The battle system" title="No turns. No easy victories." />
            <p className={styles.emphasis}>In Shadawi Striker, you control every move.</p>
            <p className={styles.body}>
              Move freely across 3D arenas, evade incoming attacks, and strike using
              four unique abilities per character. Every specimen has its own
              strengths, weaknesses, and fighting style.
            </p>
            <p className={styles.body}>
              Raw power alone won&apos;t win every fight. Learn your opponent, manage
              your cooldowns, and know when to attack or retreat.
            </p>
          </div>
          <figure className={styles.media}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGES.battle} alt="Shadawi Striker arena (placeholder)" />
          </figure>
        </div>

        <h3 className={styles.subheading}>Combat Features</h3>
        <ul className={styles.features}>
          {FEATURES.map((feature) => (
            <li key={feature.title} className={styles.feature}>
              <svg className={styles.featureIcon} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {feature.icon}
              </svg>
              <h4>{feature.title}</h4>
              <p>{feature.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 02 Game modes ── */}
      <section className={styles.section}>
        <SectionHeader number="02" label="Game modes" title="Three ways to settle a fight." />
        <div className={styles.modes}>
          {MODES.map((mode) => (
            <article key={mode.name} className={styles.mode}>
              <div className={styles.modeImage} style={{ backgroundImage: `url(${mode.image})` }}>
                <span className={styles.modeTag}>{mode.tag}</span>
              </div>
              <div className={styles.modeBody}>
                <p className={styles.modeName}>{mode.name}</p>
                <h3 className={styles.modeHeadline}>{mode.headline}</h3>
                {mode.tagline && <p className={styles.modeTagline}>{mode.tagline}</p>}
                {mode.body.map((para) => (
                  <p key={para} className={styles.body}>{para}</p>
                ))}
                {mode.note && <p className={styles.note}>{mode.note}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 03 Specimens & progression ── */}
      <section className={styles.section}>
        <div className={styles.split}>
          <div className={styles.collage}>
            {IMAGES.collection.map((src, i) => (
              <div key={i} className={styles.collageTile} style={{ backgroundImage: `url(${src})` }} />
            ))}
          </div>
          <div>
            <SectionHeader number="03" label="Specimens & progression" title="Build a collection worth fighting with." />
            <p className={styles.body}>
              Every specimen brings something different to battle. Some rely on
              overwhelming strength, while others excel through speed, defense, or
              specialized abilities.
            </p>
            <p className={styles.body}>
              Experiment with team combinations, learn new counters, and develop
              strategies around the specimens you own.
            </p>
            <p className={styles.body}>
              Winning Acquisition Battles gives you opportunities to expand your
              collection with specimens from the global population.
            </p>
            <p className={styles.callout}>
              Your collection is tied to your Shadawi Mage account, giving your
              specimens a persistent place in your profile beyond individual matches.
            </p>
          </div>
        </div>
      </section>

      {/* ── 04 Platforms ── */}
      <section className={styles.section}>
        <SectionHeader number="04" label="Play across platforms" title="One Mage. Three platforms." />
        <p className={`${styles.body} ${styles.intro}`}>
          Shadawi Striker is coming to Android, iOS, and web browsers, with your Mage
          account connecting the experience across all three.
        </p>

        <div className={styles.platformGrid}>
          <article className={styles.platformCard}>
            <p className={styles.modeName}>Android &amp; iOS</p>
            <h3 className={styles.modeHeadline}>Play. Win. Collect.</h3>
            <p className={styles.body}>
              Enjoy Shadawi Striker&apos;s real-time battles and earn free specimens
              through gameplay.
            </p>
            <p className={styles.body}>
              The mobile versions may not include NFT functionality due to platform
              restrictions. However, specimens earned through gameplay will still
              appear in your Shadawi Mage profile.
            </p>
            <p className={styles.callout}>You won&apos;t need NFTs to participate in specimen battles.</p>
          </article>

          <article className={styles.platformCard}>
            <p className={styles.modeName}>Browser</p>
            <h3 className={styles.modeHeadline}>The complete blockchain experience.</h3>
            <p className={styles.body}>
              The browser version brings Shadawi Striker&apos;s combat and collection
              systems together with full blockchain integration.
            </p>
            <p className={styles.body}>
              Access your blockchain-backed specimens and supported Web3 features
              directly through the browser experience.
            </p>
          </article>

          <article className={`${styles.platformCard} ${styles.platformWide}`}>
            <div>
              <p className={styles.modeName}>Shared Mage Account</p>
              <p className={styles.body}>
                Sign in with the same Shadawi account on any supported platform to
                access your shared progression, earned specimens, and Mage profile.
              </p>
              <p className={styles.body}>
                Whether you&apos;re playing on your phone or in your browser, your
                progress stays connected.
              </p>
              <p className={styles.note}>
                Blockchain-specific functionality will be available through the
                supported browser experience.
              </p>
            </div>
            <ul className={styles.platformList} aria-label="Platforms">
              <li>Android</li>
              <li>iOS</li>
              <li>Browser</li>
            </ul>
          </article>
        </div>
      </section>

      {/* ── 05 Road to launch ── */}
      <section className={styles.launch} style={{ "--launch-image": `url(${IMAGES.launch})` }}>
        <div className={styles.launchInner}>
          <p className={styles.eyebrow}>05 — The road to launch</p>
          <h2 className={styles.launchTitle}>Fall <span>2027.</span></h2>
          <p className={styles.body}>
            Shadawi Striker is currently in development, with a planned release in
            Fall 2027 for Android, iOS, and browsers.
          </p>
          <p className={styles.body}>
            As development continues, we&apos;ll share gameplay previews, specimen
            showcases, and updates on the road to release.
          </p>
          <div className={styles.launchActions}>
            <Button href="/signup" variant="primary">Join Shadawi</Button>
            <SupportButton />
          </div>
          <p className={styles.launchSub}>
            Create your Mage account and follow the development of Shadawi Striker.
          </p>
          <p className={styles.finePrint}>
            Planned release: Fall 2027. Platform availability and features are subject to change.
          </p>
        </div>
      </section>
    </main>
  );
}
