"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import PortalCanvas from "@/components/PortalCanvas/PortalCanvas";
import SpecimenViewer from "@/components/SpecimenViewer/SpecimenViewer";
import { unityViewer } from "@/lib/unityViewer";
import SpecimenDetails from "./SpecimenDetails";
import { formStageName, specimenFormTitle } from "@/lib/specimenForms";
import styles from "./page.module.css";

// ============================================================
// Specimens come from the content server (see page.jsx). Nobody owns a kin until they're minted,
// so the Kin and Owners tabs show their empty messages for now.
// ============================================================

// Kin are the individual minted specimen. None are minted yet, so this tab shows its empty message.
const KIN = [];

const OWNERS = [];

const SPECIMEN_FILTER_CONFIGS = [
  { key: "Class", label: "Class", options: ["divine", "elemental", "gas", "undead", "humanoid", "plant", "beast", "fairy"] },
  { key: "Build", label: "Build", options: ["Base", "Colors", "Evo", "Fusion"] },
  { key: "PurgLvl", label: "Purg Level", options: ["weak", "resistant", "strong", "mighty", "supermighty", "unpurgable"] },
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
  const [viewerOpen, setViewerOpen]       = useState(false);
  const [filtersOpen, setFiltersOpen]     = useState(false);

  // Inside specimen modal
  const [formIndex, setFormIndex]   = useState(0);

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
        // The viewer sits on top of the card, so Escape only goes back one step
        if (viewerOpen) {
          setViewerOpen(false);
          return;
        }
        setSpecimenModal(null);
        setOwnerModal(null);
        setFiltersOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewerOpen]);

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
    const source = activeTab === "specimen" ? specimens : activeTab === "kin" ? KIN : OWNERS;
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

  const filterConfigs = activeTab === "specimen" ? SPECIMEN_FILTER_CONFIGS : OWNER_FILTER_CONFIGS;

  const openSpecimenModal = (item) => {
    setSpecimenModal(item);
    setFormIndex(item.currentForm || 0);
  };

  // The modal shows the selected form's own details
  const view = specimenModal ? { ...specimenModal, ...specimenModal.forms?.[formIndex] } : null;
  const modalTitle = view && (view.title ?? specimenFormTitle(specimenModal.name, formIndex));
  const viewerAddress = view?.webDisplay ?? null;

  // Clicking a card shows interest, so start Unity behind it once the browser is free. By the
  // time the visitor presses "View in 3D" the viewer and this specimen are often already loaded.
  useEffect(() => {
    if (!viewerAddress) return;
    const startSoon = window.requestIdleCallback ?? ((run) => setTimeout(run, 200));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    const handle = startSoon(() => unityViewer.preload(viewerAddress));
    return () => cancel(handle);
  }, [viewerAddress]);

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

  // Forms are chosen from the same control on the card and in the viewer
  const formPill = formCount > 0 && (
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
  );

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
      <SpecimenViewer
        open={viewerOpen && Boolean(viewerAddress)}
        title={modalTitle}
        subtitle={specimenModal && [`SID ${specimenModal.sid}`, specimenModal.className].filter(Boolean).join(" · ")}
        address={viewerAddress}
        formControl={formPill}
        details={view && <SpecimenDetails key={specimenModal.sid} view={view} legend={specimenModal.description} flat />}
        onClose={() => setViewerOpen(false)}
      />
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
                { id: "specimen", label: "Specimen" },
                { id: "kin", label: "Kin" },
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
            {/* Nothing to search or filter until kin and owners exist */}
            {activeTab === "specimen" && (
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
            )}
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {pageItems.length === 0 ? (
            <p className={styles.noData}>
              {activeTab === "kin"
                ? "No kin discovered at this time"
                : activeTab === "owners"
                ? "No owners at this time"
                : activeTab === "specimen" && loadError
                  ? "THE ARCHIVE IS UNREACHABLE. TRY AGAIN SOON."
                  : "NO RESULTS FOUND"}
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
                  <button
                    className={styles.ctaBtn}
                    disabled={!viewerAddress}
                    onClick={() => setViewerOpen(true)}
                  >
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
                      <path d="M10 2L17 6V14L10 18L3 14V6Z" />
                      <path d="M3 6L10 10L17 6M10 10V18" />
                    </svg>
                    {viewerAddress ? "View in 3D" : "3D coming soon"}
                  </button>

                  {formPill}
                </div>
              </div>

              <SpecimenDetails key={specimenModal.sid} view={view} legend={specimenModal.description} />
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
                    <span className={styles.tileLabel}>KIN</span>
                    <span className={styles.tileValue}>{ownerModal.kinOwned}</span>
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
