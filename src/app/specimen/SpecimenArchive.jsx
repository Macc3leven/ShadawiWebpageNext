"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import PortalCanvas from "@/components/PortalCanvas/PortalCanvas";
import { formStageName, specimenFormTitle } from "@/lib/specimenForms";
import styles from "./page.module.css";

// ============================================================
// SAMPLE DATA: tokens and owners are still placeholders.
// Specimens come from the content server (see page.jsx).
// ============================================================

const TOKENS = [
  {
    sid: "T-001", name: "Phoenix Crest", className: "divine",
    description: "A sacred token forged from the ashes of the first Phoenix to grace the Shadawi skies. Grants its bearer one revival per cycle.",
    mugshot: "/images/specimen-temp/mightybird.png",
    forms: [{ image: "/images/specimen-temp/mightybird.png" }],
    currentForm: 0,
    attributes: [
      { name: "Rarity", value: "Legendary" },
      { name: "Class", value: "Divine" },
      { name: "Tradeable", value: "Yes" },
      { name: "Edition", value: "1 of 50" },
    ],
    stats: [
      { name: "Power", value: 95, max: 100 },
      { name: "Stability", value: 70, max: 100 },
      { name: "Charge", value: 88, max: 100 },
    ],
    abilities: [],
    metrics: null,
  },
  {
    sid: "T-002", name: "Stormcaller", className: "elemental",
    description: "A focusing crystal that channels storm energy directly into a bound specimen.",
    mugshot: "/images/specimen-temp/cloudogre.png",
    forms: [{ image: "/images/specimen-temp/cloudogre.png" }],
    currentForm: 0,
    attributes: [
      { name: "Rarity", value: "Epic" },
      { name: "Class", value: "Elemental" },
      { name: "Tradeable", value: "Yes" },
      { name: "Edition", value: "12 of 200" },
    ],
    stats: [
      { name: "Power", value: 78, max: 100 },
      { name: "Stability", value: 65, max: 100 },
      { name: "Charge", value: 72, max: 100 },
    ],
    abilities: [],
    metrics: null,
  },
  {
    sid: "T-003", name: "Bone Sigil", className: "undead",
    description: "An etched fragment of an ancient ribcage, humming with low purgatory energy.",
    mugshot: "/images/specimen-temp/domigra.png",
    forms: [{ image: "/images/specimen-temp/domigra.png" }],
    currentForm: 0,
    attributes: [
      { name: "Rarity", value: "Rare" },
      { name: "Class", value: "Undead" },
      { name: "Tradeable", value: "Yes" },
      { name: "Edition", value: "44 of 500" },
    ],
    stats: [
      { name: "Power", value: 60, max: 100 },
      { name: "Stability", value: 80, max: 100 },
      { name: "Charge", value: 55, max: 100 },
    ],
    abilities: [],
    metrics: null,
  },
  {
    sid: "T-004", name: "Tide Cipher", className: "gas",
    description: "A waterproof scroll-token that lets a specimen breathe in any medium for one full cycle.",
    mugshot: "/images/specimen-temp/seapuk.png",
    forms: [{ image: "/images/specimen-temp/seapuk.png" }],
    currentForm: 0,
    attributes: [
      { name: "Rarity", value: "Uncommon" },
      { name: "Class", value: "Gas" },
      { name: "Tradeable", value: "Yes" },
      { name: "Edition", value: "180 of 2000" },
    ],
    stats: [
      { name: "Power", value: 45, max: 100 },
      { name: "Stability", value: 90, max: 100 },
      { name: "Charge", value: 50, max: 100 },
    ],
    abilities: [],
    metrics: null,
  },
];

const OWNERS = [
  { username: "oneiric", name: "Oneiric", handle: "oneiric.shdw", title: "Founding Architect", profileImage: "https://i.pravatar.cc/150?img=12", worldRank: 1, specimenOwned: 247, tokensOwned: 89, bio: "Founding architect of the Shadawi Universe. Forged the first six clans and still walks among them under different names.", recentCollection: ["/images/specimen-temp/domigra.png", "/images/specimen-temp/mightybird.png", "/images/specimen-temp/cloudogre.png", "/images/specimen-temp/seapuk.png"] },
  { username: "stormwalker", name: "Storm Walker", handle: "storm.w", title: "Elite Purgator", profileImage: "https://i.pravatar.cc/150?img=33", worldRank: 2, specimenOwned: 198, tokensOwned: 64, bio: "Veteran of 312 Purg cycles. Commands a tempest aviary and prefers Divine and Elemental specimens.", recentCollection: ["/images/specimen-temp/mightybird.png", "/images/specimen-temp/cloudogre.png"] },
  { username: "verdant", name: "Verdant", handle: "verdant.eth", title: "Plant Cultivator", profileImage: "https://i.pravatar.cc/150?img=47", worldRank: 3, specimenOwned: 156, tokensOwned: 41, bio: "Caretaker of the Last Greenhouse. Specializes in Plant-class specimens and root-bound tokens.", recentCollection: ["/images/specimen-temp/mightybird.png"] },
  { username: "bonewright", name: "Bonewright", handle: "bonewright", title: "Necro Engineer", profileImage: "https://i.pravatar.cc/150?img=68", worldRank: 4, specimenOwned: 142, tokensOwned: 73, bio: "Reverse-engineers the Undead. Holds the largest known cache of Bone Sigil tokens.", recentCollection: ["/images/specimen-temp/domigra.png", "/images/specimen-temp/cloudogre.png"] },
  { username: "kira_05", name: "Kira", handle: "kira.05", title: "Token Trader", profileImage: "https://i.pravatar.cc/150?img=25", worldRank: 5, specimenOwned: 88, tokensOwned: 412, bio: "Doesn't fight. Doesn't summon. Just trades — and holds the deepest token vault on this side of the Purg.", recentCollection: ["/images/specimen-temp/seapuk.png"] },
  { username: "fenric", name: "Fenric", handle: "fenric.gx", title: "Beast Tamer", profileImage: "https://i.pravatar.cc/150?img=51", worldRank: 6, specimenOwned: 76, tokensOwned: 22, bio: "Walks the outer wilds. Bonded to a pack of three Beast-class specimens since cycle 14.", recentCollection: ["/images/specimen-temp/mightybird.png"] },
  { username: "mira_void", name: "Mira Void", handle: "mira.void", title: "Quantum Adept", profileImage: "https://i.pravatar.cc/150?img=44", worldRank: 7, specimenOwned: 64, tokensOwned: 38, bio: "Reads the gaps between cycles. Quantum discipline only.", recentCollection: ["/images/specimen-temp/cloudogre.png"] },
  { username: "newpurg42", name: "newpurg42", handle: "newpurg42", title: "Apprentice", profileImage: "https://i.pravatar.cc/150?img=8", worldRank: 248, specimenOwned: 3, tokensOwned: 1, bio: "Just started. Saving up for a second specimen.", recentCollection: ["/images/specimen-temp/seapuk.png"] },
];

const SPECIMEN_FILTER_CONFIGS = [
  { key: "Class", label: "Class", options: ["divine", "elemental", "gas", "undead", "humanoid", "plant", "beast", "fairy"] },
  { key: "Build", label: "Build", options: ["Base", "Colors", "Evo", "Fusion"] },
  { key: "PurgLvl", label: "Purg Level", options: ["weak", "resistant", "strong", "mighty", "supermighty", "unpurgable"] },
];

const TOKEN_FILTER_CONFIGS = [
  { key: "Class", label: "Class", options: ["divine", "elemental", "gas", "undead", "plant", "beast"] },
];

const OWNER_FILTER_CONFIGS = [
  { key: "OrderBy", label: "Order By", options: ["rank-asc", "rank-desc", "specimen-count-desc", "specimen-count-asc"] },
];

const ITEMS_PER_PAGE = 20;

// ============================================================
// HELPERS
// ============================================================

function searchFilter(items, term, fields) {
  if (!term) return items;
  const needle = term.toLowerCase();
  return items.filter((item) =>
    fields.some((f) => item[f] != null && String(item[f]).toLowerCase().includes(needle))
  );
}

function applyFilters(items, filter) {
  return Object.entries(filter).reduce((acc, [key, value]) => {
    if (!value) return acc;
    if (key === "OrderBy") return acc; // handled separately
    return acc.filter((item) => {
      const direct = item[key.toLowerCase()] || item[key];
      if (direct != null) return String(direct).toLowerCase() === value.toLowerCase();
      if (Array.isArray(item.attributes)) {
        return item.attributes.some(
          (a) => a.name?.toLowerCase() === key.toLowerCase() && String(a.value).toLowerCase() === value.toLowerCase()
        );
      }
      return false;
    });
  }, items);
}

function applyOwnerSort(items, order) {
  if (!order) return items;
  const sorted = [...items];
  if (order === "specimen-count-desc") sorted.sort((a, b) => b.specimenOwned - a.specimenOwned);
  if (order === "specimen-count-asc")  sorted.sort((a, b) => a.specimenOwned - b.specimenOwned);
  if (order === "rank-desc")           sorted.sort((a, b) => b.worldRank - a.worldRank);
  if (order === "rank-asc")            sorted.sort((a, b) => a.worldRank - b.worldRank);
  return sorted;
}

function badgeClass(type) {
  const map = { strike: styles.badgeStrike, projectile: styles.badgeProjectile, barrier: styles.badgeDefense, defense: styles.badgeDefense, alter: styles.badgeAlter };
  return map[type] || styles.badgeStrike;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

// specimens: the catalog from the content server (lib/contentServer.js); loadError: it couldn't be reached
export default function SpecimenArchive({ specimens, loadError }) {
  const [activeTab, setActiveTab]         = useState("specimen");
  const [search, setSearch]               = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter]               = useState({});
  const [pendingFilter, setPendingFilter] = useState({});
  const [page, setPage]                   = useState(1);

  // Modals
  const [specimenModal, setSpecimenModal] = useState(null);
  const [ownerModal, setOwnerModal]       = useState(null);
  const [filtersOpen, setFiltersOpen]     = useState(false);

  // Inside specimen modal
  const [formIndex, setFormIndex]   = useState(0);
  const [modalTab, setModalTab]     = useState("overview");

  // Sticky filter bar detection
  const [stuck, setStuck] = useState(false);
  const filterRef = useRef(null);

  const debounceRef = useRef(null);

  // Debounced search
  const handleSearchChange = (e) => {
    const v = e.target.value;
    setSearch(v);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(v);
      setPage(1);
    }, 400);
  };

  // Sticky detection
  useEffect(() => {
    const el = filterRef.current;
    if (!el) return;
    // Match the bar's CSS `top` (0 on desktop, below the menu pill on mobile)
    const stickyTop = parseFloat(getComputedStyle(el).top) || 0;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 1, rootMargin: `-${stickyTop + 1}px 0px 0px 0px` }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close modals on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSpecimenModal(null);
        setOwnerModal(null);
        setFiltersOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const open = specimenModal || ownerModal || filtersOpen;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [specimenModal, ownerModal, filtersOpen]);

  // Reset pagination on tab/search/filter change
  useEffect(() => { setPage(1); }, [activeTab, debouncedSearch, filter]);

  // Compute visible items
  const getItems = useCallback(() => {
    const searchFields = activeTab === "owners"
      ? ["username", "name", "handle", "title"]
      : ["name", "sid", "description", "creator"];
    const source = activeTab === "specimen" ? specimens : activeTab === "tokens" ? TOKENS : OWNERS;
    let data = searchFilter(source, debouncedSearch, searchFields);
    if (activeTab === "owners") {
      data = applyOwnerSort(data, filter.OrderBy);
    } else {
      data = applyFilters(data, filter);
    }
    return data;
  }, [activeTab, debouncedSearch, filter, specimens]);

  const allItems   = getItems();
  const totalPages = Math.max(1, Math.ceil(allItems.length / ITEMS_PER_PAGE));
  const pageItems  = allItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const filterConfigs = activeTab === "specimen" ? SPECIMEN_FILTER_CONFIGS
                      : activeTab === "tokens"   ? TOKEN_FILTER_CONFIGS
                      : OWNER_FILTER_CONFIGS;

  const openSpecimenModal = (item) => {
    setSpecimenModal(item);
    setFormIndex(item.currentForm || 0);
    setModalTab("overview");
  };

  // The modal shows the selected form's own details; tokens (no per-form data) fall back to the item itself
  const view = specimenModal ? { ...specimenModal, ...specimenModal.forms?.[formIndex] } : null;
  const modalTitle = view && (view.title ?? specimenFormTitle(specimenModal.name, formIndex));

  // Step through forms, wrapping around at either end
  const formCount = specimenModal?.forms?.length || 0;
  const changeForm = (delta) => {
    if (formCount < 2) return;
    setFormIndex((f) => (f + delta + formCount) % formCount);
  };

  // Swipe left/right on the hero image to change form
  const swipeStartX = useRef(null);
  const onHeroTouchStart = (e) => { swipeStartX.current = e.touches[0].clientX; };
  const onHeroTouchEnd = (e) => {
    if (swipeStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (Math.abs(dx) > 40) changeForm(dx < 0 ? 1 : -1);
  };

  const applyFiltersAndClose = () => {
    setFilter(pendingFilter);
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setPendingFilter({});
    setFilter({});
    setFiltersOpen(false);
  };

  const openFilters = () => {
    setPendingFilter({ ...filter });
    setFiltersOpen(true);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <PortalCanvas />
      <div className={styles.page}>

        {/* Header — compact so the cards show up sooner */}
        <div className={styles.header}>
          <div>
            {/* "Archive" only shows on mobile; desktop keeps the short title */}
            <h1 className={styles.bigTitle}>Specimen<span className={styles.titleExtra}> Archive</span></h1>
            <p className={styles.subtitle}>Browse the Shadawi collection.</p>
          </div>
          <a href="shadawi/documentation" className={styles.docsLink}>
            Docs
          </a>
        </div>

        {/* Sticky Filter Bar */}
        <div ref={filterRef} className={`${styles.filterBar}${stuck ? " " + styles.stuck : ""}`}>
          <div className={styles.filterInner}>
            <div className={styles.tabs} role="tablist">
              {[
                { id: "specimen", label: "Specimens" },
                { id: "tokens", label: "Tokens" },
                { id: "owners", label: "Owners" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={activeTab === id}
                  className={`${styles.tab}${activeTab === id ? " " + styles.tabActive : ""}`}
                  onClick={() => { setActiveTab(id); setSearch(""); setDebouncedSearch(""); setFilter({}); }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className={styles.searchRow}>
              <div className={styles.searchWrap}>
                <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <circle cx="9" cy="9" r="6" />
                  <path d="M13.5 13.5L17 17" />
                </svg>
                <input
                  className={styles.searchInput}
                  type="text"
                  placeholder={activeTab === "owners" ? "Search owners..." : "Search collection..."}
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
              <button className={styles.filterBtn} onClick={openFilters} aria-label="Filters" title="Filters">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M3 5H11M15 5H17M3 10H5M9 10H17M3 15H12M16 15H17" />
                  <circle cx="13" cy="5" r="2" />
                  <circle cx="7" cy="10" r="2" />
                  <circle cx="14" cy="15" r="2" />
                </svg>
                <span className={styles.filterLabel}>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {pageItems.length === 0 ? (
            <p className={styles.noData}>
              {activeTab === "specimen" && loadError ? "THE ARCHIVE IS UNREACHABLE. TRY AGAIN SOON." : "NO RESULTS FOUND"}
            </p>
          ) : activeTab === "owners" ? (
            <div className={styles.ownersList}>
              {pageItems.map((owner) => (
                <div key={owner.username} className={styles.ownerRow} onClick={() => setOwnerModal(owner)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.ownerAvatar} src={owner.profileImage} alt={owner.name} />
                  <div className={styles.ownerInfo}>
                    <p className={styles.ownerUsername}>{owner.name}</p>
                    <p className={styles.ownerTitle}>{owner.title} · {owner.handle}</p>
                  </div>
                  <div className={styles.ownerPill}>
                    <span className={styles.ownerRank}>#{owner.worldRank}</span>
                    <span className={styles.ownerCount}>{owner.specimenOwned} specimen</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.cardGrid}>
              {pageItems.map((item) => (
                <div
                  key={item.sid}
                  className={styles.card}
                  style={item.mugshot ? { backgroundImage: `url(${item.mugshot})` } : {}}
                  onClick={() => openSpecimenModal(item)}
                >
                  <div className={styles.cardInfo}>
                    <h3 className={styles.cardName}>{item.name}</h3>
                    <p className={styles.cardClass}>{item.className}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button className={styles.pageBtn} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                ← PREV
              </button>
              <span className={styles.pageInfo}>{page} / {totalPages}</span>
              <button className={styles.pageBtn} disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                NEXT →
              </button>
            </div>
          )}
        </div>

        {/* ======================================================
            SPECIMEN MODAL
        ====================================================== */}
        {specimenModal && (
          <div className={styles.overlay} onClick={() => setSpecimenModal(null)}>
            <div className={styles.specimenModal} onClick={(e) => e.stopPropagation()}>

              {/* Hero */}
              <div className={styles.modalHero} onTouchStart={onHeroTouchStart} onTouchEnd={onHeroTouchEnd}>
                {specimenModal.forms?.[formIndex]?.image && (
                  <>
                    {/* Blurred copy fills the space around the uncropped image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={styles.modalHeroBackdrop}
                      src={specimenModal.forms[formIndex].image}
                      alt=""
                      aria-hidden="true"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={styles.modalHeroImg}
                      src={specimenModal.forms[formIndex].image}
                      alt={modalTitle}
                    />
                  </>
                )}

                {/* Header overlay */}
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitleBar}>
                    <h2 className={styles.modalTitle}>{modalTitle}</h2>
                    <p className={styles.modalSubtitle}>
                      SID {specimenModal.sid}
                      {specimenModal.className && (
                        <> · <span className={styles.modalClassTag}>{specimenModal.className}</span></>
                      )}
                    </p>
                  </div>
                  <div className={styles.modalActions}>
                    <button className={styles.iconBtn} title="Close" onClick={() => setSpecimenModal(null)}>✕</button>
                  </div>
                </div>

                {/* Bottom bar over the image: View in 3D + compact form switcher */}
                <div className={styles.heroBottom}>
                  <button className={styles.ctaBtn}>
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
                      <path d="M10 2L17 6V14L10 18L3 14V6Z" />
                      <path d="M3 6L10 10L17 6M10 10V18" />
                    </svg>
                    View in 3D
                  </button>

                  {/* Forms are a specimen concept — tokens don't get the switcher */}
                  {formCount > 0 && activeTab !== "tokens" && (
                    <div className={styles.formPill} role="group" aria-label="Specimen form">
                      {formCount > 1 && (
                        <button className={styles.formPillArrow} onClick={() => changeForm(-1)} aria-label="Previous form">‹</button>
                      )}
                      <span className={styles.formPillInfo} aria-live="polite">
                        <span className={styles.formPillName}>{formStageName(formIndex)}</span>
                        <span className={styles.formPillCount}>{formIndex + 1}/{formCount}</span>
                      </span>
                      {formCount > 1 && (
                        <button className={styles.formPillArrow} onClick={() => changeForm(1)} aria-label="Next form">›</button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal tabs */}
              <div className={styles.modalTabs}>
                {["overview", "abilities", "metrics"].map((t) => (
                  <button
                    key={t}
                    className={`${styles.modalTab}${modalTab === t ? " " + styles.modalTabActive : ""}`}
                    onClick={() => setModalTab(t)}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Tab panels */}
              <div className={styles.modalBody}>

                {/* OVERVIEW */}
                {modalTab === "overview" && (
                  <>
                    {specimenModal.description && (
                      <div className={styles.modalSection}>
                        <h3 className={styles.modalSectionTitle}>LEGEND</h3>
                        <p className={styles.legend}>{specimenModal.description}</p>
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
                              <span className={styles.statName}>{s.name}</span>
                              <div className={styles.statTrack}>
                                <div className={styles.statFill} style={{ width: `${Math.min(100, (s.value / s.max) * 100)}%` }} />
                              </div>
                              {/* Catalog stats are measured against the archive's highest value, so only the value is shown */}
                              <span className={styles.statVal}>{s.relative ? s.value.toLocaleString() : `${s.value} / ${s.max}`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ABILITIES */}
                {modalTab === "abilities" && (
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
                {modalTab === "metrics" && (
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
                    <p className={styles.noData} style={{ margin: "20px 0" }}>No metrics available for tokens.</p>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
            OWNER MODAL
        ====================================================== */}
        {ownerModal && (
          <div className={styles.overlay} onClick={() => setOwnerModal(null)}>
            <div className={styles.ownerModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.ownerModalHeader}>
                <button className={styles.ownerModalClose} onClick={() => setOwnerModal(null)}>✕</button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.ownerModalAvatar} src={ownerModal.profileImage} alt={ownerModal.name} />
                <h2 className={styles.ownerModalName}>{ownerModal.name}</h2>
                <p className={styles.ownerModalHandle}>{ownerModal.handle} · {ownerModal.title}</p>
              </div>
              <div className={styles.ownerModalBody}>
                <div className={styles.ownerStats}>
                  <div className={styles.statTile}>
                    <span className={styles.tileLabel}>RANK</span>
                    <span className={styles.tileValue}>#{ownerModal.worldRank}</span>
                  </div>
                  <div className={styles.statTile}>
                    <span className={styles.tileLabel}>SPECIMEN</span>
                    <span className={styles.tileValue}>{ownerModal.specimenOwned}</span>
                  </div>
                  <div className={styles.statTile}>
                    <span className={styles.tileLabel}>TOKENS</span>
                    <span className={styles.tileValue}>{ownerModal.tokensOwned}</span>
                  </div>
                </div>
                {ownerModal.bio && (
                  <div className={styles.ownerSection}>
                    <h3 className={styles.ownerSectionTitle}>BIO</h3>
                    <p className={styles.bioText}>{ownerModal.bio}</p>
                  </div>
                )}
                {ownerModal.recentCollection?.length > 0 && (
                  <div className={styles.ownerSection}>
                    <h3 className={styles.ownerSectionTitle}>COLLECTION</h3>
                    <ul className={styles.collectionGrid}>
                      {ownerModal.recentCollection.map((src, i) => (
                        <li
                          key={i}
                          className={styles.collectionThumb}
                          style={{ backgroundImage: `url(${src})` }}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
            FILTERS MODAL
        ====================================================== */}
        {filtersOpen && (
          <div className={styles.overlay} onClick={() => setFiltersOpen(false)}>
            <div className={styles.filtersModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.filtersHeader}>
                <h2 className={styles.filtersTitle}>FILTERS</h2>
                <button className={styles.filtersClose} onClick={() => setFiltersOpen(false)}>✕</button>
              </div>
              <div className={styles.filtersBody}>
                {filterConfigs.map(({ key, label, options }) => (
                  <div key={key} className={styles.filterGroup}>
                    <label className={styles.filterGroupLabel}>{label}</label>
                    <select
                      className={styles.filterSelect}
                      value={pendingFilter[key] || ""}
                      onChange={(e) => setPendingFilter((prev) => ({ ...prev, [key]: e.target.value }))}
                    >
                      <option value="">All</option>
                      {options.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className={styles.filtersFooter}>
                <button className={styles.btnClear} onClick={clearFilters}>CLEAR</button>
                <button className={styles.btnApply} onClick={applyFiltersAndClose}>APPLY</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
