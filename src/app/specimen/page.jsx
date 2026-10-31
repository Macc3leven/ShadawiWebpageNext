"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import PortalCanvas from "@/components/PortalCanvas/PortalCanvas";
import { formStageName, specimenFormTitle } from "@/lib/specimenForms";
import styles from "./page.module.css";

// ============================================================
// MOCK DATA (replace with API calls when backend is ready)
// ============================================================

const SPECIMEN = [
  {
    sid: 101, name: "Domigra", className: "undead",
    description: "Puny purgator, bring me to the fight. I have walked through countless battlefields, my essence sharpened by every soul I've reaped.",
    creator: "oneiric",
    mugshot: "/images/specimen-temp/domigra.png",
    forms: [{ image: "/images/specimen-temp/domigra.png" }],
    currentForm: 0,
    attributes: [
      { name: "PurgLvl", value: "Supermighty" },
      { name: "Class", value: "Undead" },
      { name: "Discipline", value: "Samurai" },
      { name: "Build", value: "Base" },
      { name: "Size", value: "Humanoid" },
    ],
    stats: [
      { name: "Health", value: 80, max: 100 },
      { name: "Essence", value: 65, max: 100 },
      { name: "Recovery", value: 70, max: 100 },
      { name: "Speed", value: 40, max: 100 },
      { name: "Weight", value: 2555, max: 2000 },
    ],
    abilities: [
      { name: "Soul Reap", type: "strike", description: "Slash through the enemy's essence, draining life force on contact.", cost: { type: "essence", value: 14 }, atk: 2800, def: 30, specialType: "DRAIN", specialValue: ".20" },
      { name: "Bone Shield", type: "defense", description: "Summon a wall of ancient bones to absorb incoming damage.", cost: { type: "essence", value: 14 }, atk: null, def: 450, specialType: "REDUCE", specialValue: "25%" },
      { name: "Grave Pulse", type: "projectile", description: "Launch a wave of necrotic energy that damages all targets in range.", cost: { type: "essence", value: 22 }, atk: 3100, def: 0, specialType: "BURN", specialValue: ".45" },
    ],
    metrics: {
      population: { cap: 1000, totalMinted: 721, totalBurned: 38, growth: "+12/cycle" },
      ownership:  { uniqueOwners: 412, longestHolder: "186 days", researchTokens: 14 },
      lineage:    { totalForms: 1, supplyPerForm: "721", rarestForm: "Alpha", popularForm: "Alpha" },
      battle:     { usageRate: "34%", victories: 1842, damageDealt: "4.2M", winRate: "61%", highestStat: "Health (80)", lowestStat: "Speed (40)", powerIndex: 712 },
      blockchain: { openseaUrl: "https://opensea.io" },
    },
  },
  {
    sid: 102, name: "Mighty Bird", className: "divine",
    description: "In the ancient depths of the Shadawi Universe, there exists a celestial avian known as the Mighty Bird. Born into the revered Chinon family, guardians of cosmic balance.",
    creator: "oneiric",
    mugshot: "/images/specimen-temp/mightybird.png",
    forms: [
      { image: "/images/specimen-temp/mightybird.png" },
      { image: "/images/specimen-temp/mightybird.png" },
      { image: "/images/specimen-temp/mightybird.png" },
      { image: "/images/specimen-temp/mightybird.png" },
    ],
    currentForm: 0,
    attributes: [
      { name: "PurgLvl", value: "Mighty" },
      { name: "Class", value: "Divine" },
      { name: "Discipline", value: "Mystical" },
      { name: "Build", value: "Colors" },
      { name: "Size", value: "Humanoid" },
    ],
    stats: [
      { name: "Health", value: 92, max: 100 },
      { name: "Essence", value: 88, max: 100 },
      { name: "Recovery", value: 60, max: 100 },
      { name: "Speed", value: 55, max: 100 },
    ],
    abilities: [
      { name: "Wing Slap", type: "strike", description: "A devastating wing strike that sends shockwaves through the air.", cost: { type: "essence", value: 10 }, atk: 2300, def: 45, specialType: "STUN", specialValue: ".15" },
      { name: "Nest Cannon", type: "projectile", description: "Fire a concentrated beam of divine energy from the nest core.", cost: { type: "essence", value: 28 }, atk: 4100, def: 0, specialType: "BURN", specialValue: ".60" },
      { name: "Divine Aura", type: "defense", description: "Passively regenerates health for all allied specimens each cycle.", cost: { type: "essence", value: 14 }, atk: null, def: null, specialType: "HEAL", specialValue: "8%" },
      { name: "Cosmic Shift", type: "alter", description: "Rewrite the battlefield gravity, grounding all flying enemies for 2 turns.", cost: { type: "essence", value: 40 }, atk: null, def: null, specialType: "GROUND", specialValue: "2T" },
    ],
    metrics: {
      population: { cap: 5000, totalMinted: 2021, totalBurned: 102, growth: "+45/cycle" },
      ownership:  { uniqueOwners: 1340, longestHolder: "301 days", researchTokens: 67 },
      lineage:    { totalForms: 4, supplyPerForm: "~505", rarestForm: "Delta", popularForm: "Alpha" },
      battle:     { usageRate: "52%", victories: 5210, damageDealt: "18.7M", winRate: "74%", highestStat: "Health (92)", lowestStat: "Speed (55)", powerIndex: 921 },
      blockchain: { openseaUrl: "https://opensea.io" },
    },
  },
  {
    sid: 103, name: "Cloud Ogre", className: "gas",
    description: "I am known as Cloud Ogre, a being bound to the gaseous realm. Within me resides Jejar, a sentient cloud that evolves with my essence.",
    creator: "oneiric",
    mugshot: "/images/specimen-temp/cloudogre.png",
    forms: [
      { image: "/images/specimen-temp/cloudogre.png" },
      { image: "/images/specimen-temp/cloudogre.png" },
      { image: "/images/specimen-temp/cloudogre.png" },
    ],
    currentForm: 0,
    attributes: [
      { name: "PurgLvl", value: "Strong" },
      { name: "Class", value: "Gas" },
      { name: "Discipline", value: "Sorcerer" },
      { name: "Build", value: "Evo" },
      { name: "Size", value: "Boss" },
    ],
    stats: [
      { name: "Health", value: 84, max: 100 },
      { name: "Essence", value: 72, max: 100 },
      { name: "Recovery", value: 42, max: 100 },
      { name: "Speed", value: 38, max: 100 },
    ],
    abilities: [
      { name: "Gas Burner", type: "projectile", description: "An attack that burns the enemy with fire.", cost: { type: "essence", value: 12 }, atk: 3456, def: 56, specialType: "BURN", specialValue: ".30" },
      { name: "Gas Body", type: "defense", description: "Jejar's body is made of gas, reducing damage from physical attacks.", cost: { type: "essence", value: 14 }, atk: null, def: 25, specialType: "REDUCE", specialValue: "15%" },
      { name: "Toxic Fog", type: "strike", description: "Release a toxic gas in area, damaging and poisoning enemies over time.", cost: { type: "essence", value: 18 }, atk: 1020, def: 40, specialType: "POISON", specialValue: "2.5" },
    ],
    metrics: {
      population: { cap: 2000, totalMinted: 721, totalBurned: 15, growth: "+8/cycle" },
      ownership:  { uniqueOwners: 389, longestHolder: "142 days", researchTokens: 9 },
      lineage:    { totalForms: 3, supplyPerForm: "~240", rarestForm: "Gamma", popularForm: "Alpha" },
      battle:     { usageRate: "28%", victories: 980, damageDealt: "3.1M", winRate: "54%", highestStat: "Health (84)", lowestStat: "Speed (38)", powerIndex: 648 },
      blockchain: { openseaUrl: "https://opensea.io" },
    },
  },
  {
    sid: 104, name: "Seapunk", className: "gas",
    description: "Seapunk was once a peaceful spirit of the wind, guiding ships safely through the fog. His life changed when a shipwrecked mage bound him to a cursed plank of driftwood.",
    creator: "oneiric",
    mugshot: "/images/specimen-temp/seapuk.png",
    forms: [{ image: "/images/specimen-temp/seapuk.png" }],
    currentForm: 0,
    attributes: [
      { name: "PurgLvl", value: "Weak" },
      { name: "Class", value: "Gas" },
      { name: "Discipline", value: "Cursed" },
      { name: "Build", value: "Base" },
      { name: "Size", value: "Humanoid" },
    ],
    stats: [
      { name: "Health", value: 55, max: 100 },
      { name: "Essence", value: 48, max: 100 },
      { name: "Recovery", value: 35, max: 100 },
      { name: "Speed", value: 70, max: 100 },
    ],
    abilities: [
      { name: "Driftwood Slam", type: "strike", description: "Smash the cursed plank into the enemy, dealing heavy physical damage.", cost: { type: "essence", value: 80 }, atk: 1600, def: 20, specialType: "STUN", specialValue: ".10" },
      { name: "Fog Veil", type: "defense", description: "Surround yourself in dense fog, reducing enemy accuracy.", cost: { type: "essence", value: 140 }, atk: null, def: 60, specialType: "REDUCE", specialValue: "12%" },
    ],
    metrics: {
      population: { cap: 5000, totalMinted: 3001, totalBurned: 204, growth: "+31/cycle" },
      ownership:  { uniqueOwners: 2104, longestHolder: "88 days", researchTokens: 3 },
      lineage:    { totalForms: 1, supplyPerForm: "3001", rarestForm: "Alpha", popularForm: "Alpha" },
      battle:     { usageRate: "18%", victories: 420, damageDealt: "890K", winRate: "41%", highestStat: "Speed (70)", lowestStat: "Recovery (35)", powerIndex: 388 },
      blockchain: { openseaUrl: "https://opensea.io" },
    },
  },
  {
    sid: 105, name: "Veynar", className: "elemental",
    description: "A being of pure storm, Veynar emerged from the eye of the Eternal Tempest. His every breath summons thunder.",
    creator: "shadawi",
    mugshot: "/images/specimen-temp/domigra.png",
    forms: [
      { image: "/images/specimen-temp/domigra.png" },
      { image: "/images/specimen-temp/domigra.png" },
      { image: "/images/specimen-temp/domigra.png" },
    ],
    currentForm: 1,
    attributes: [
      { name: "PurgLvl", value: "Mighty" },
      { name: "Class", value: "Elemental" },
      { name: "Discipline", value: "Quantum" },
      { name: "Build", value: "Fusion" },
      { name: "Size", value: "Humanoid" },
    ],
    stats: [
      { name: "Health", value: 76, max: 100 },
      { name: "Essence", value: 95, max: 100 },
      { name: "Recovery", value: 50, max: 100 },
      { name: "Speed", value: 60, max: 100 },
    ],
    abilities: [
      { name: "Thunder Crack", type: "projectile", description: "Hurl a bolt of concentrated lightning at a single target.", cost: { type: "essence", value: 16 }, atk: 3800, def: 0, specialType: "SHOCK", specialValue: ".55" },
      { name: "Quantum Drift", type: "alter", description: "Phase through the next incoming attack entirely.", cost: { type: "essence", value: 30 }, atk: null, def: null, specialType: "DODGE", specialValue: "100%" },
    ],
    metrics: {
      population: { cap: 3000, totalMinted: 1455, totalBurned: 61, growth: "+19/cycle" },
      ownership:  { uniqueOwners: 820, longestHolder: "210 days", researchTokens: 22 },
      lineage:    { totalForms: 3, supplyPerForm: "~485", rarestForm: "Gamma", popularForm: "Alpha" },
      battle:     { usageRate: "40%", victories: 2890, damageDealt: "9.4M", winRate: "68%", highestStat: "Essence (95)", lowestStat: "Recovery (50)", powerIndex: 834 },
      blockchain: { openseaUrl: "https://opensea.io" },
    },
  },
  {
    sid: 106, name: "Bramblekin", className: "plant",
    description: "Born from the first sapling to break through scorched earth, Bramblekin is the soul of all that regrows.",
    creator: "shadawi",
    mugshot: "/images/specimen-temp/mightybird.png",
    forms: [
      { image: "/images/specimen-temp/mightybird.png" },
      { image: "/images/specimen-temp/mightybird.png" },
    ],
    currentForm: 0,
    attributes: [
      { name: "PurgLvl", value: "Resistant" },
      { name: "Class", value: "Plant" },
      { name: "Discipline", value: "Summoner" },
      { name: "Build", value: "Base" },
      { name: "Size", value: "Small" },
    ],
    stats: [
      { name: "Health", value: 62, max: 100 },
      { name: "Essence", value: 80, max: 100 },
      { name: "Recovery", value: 88, max: 100 },
      { name: "Speed", value: 45, max: 100 },
    ],
    abilities: [
      { name: "Root Snare", type: "strike", description: "Roots erupt from the ground, entangling and damaging the target.", cost: { type: "essence", value: 9 }, atk: 1200, def: 80, specialType: "BIND", specialValue: "2T" },
      { name: "Regrowth", type: "defense", description: "Passively heals a small amount each cycle from photosynthesis.", cost: { type: "essence", value: 14 }, atk: null, def: null, specialType: "HEAL", specialValue: "5%" },
      { name: "Spore Cloud", type: "projectile", description: "Release a cloud of toxic spores that poisons nearby enemies.", cost: { type: "essence", value: 15 }, atk: 900, def: 10, specialType: "POISON", specialValue: "1.8" },
    ],
    metrics: {
      population: { cap: 4000, totalMinted: 1800, totalBurned: 45, growth: "+22/cycle" },
      ownership:  { uniqueOwners: 990, longestHolder: "175 days", researchTokens: 31 },
      lineage:    { totalForms: 2, supplyPerForm: "~900", rarestForm: "Beta", popularForm: "Alpha" },
      battle:     { usageRate: "22%", victories: 680, damageDealt: "1.8M", winRate: "48%", highestStat: "Recovery (88)", lowestStat: "Speed (45)", powerIndex: 502 },
      blockchain: { openseaUrl: "https://opensea.io" },
    },
  },
];

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
  { key: "Discipline", label: "Discipline", options: ["brawler", "arsenal", "cursed", "sorcerer", "mystical", "psychic", "quantum", "summoner", "samurai"] },
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
  const map = { strike: styles.badgeStrike, projectile: styles.badgeProjectile, defense: styles.badgeDefense, alter: styles.badgeAlter };
  return map[type] || styles.badgeStrike;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function SpecimenPage() {
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
    const source = activeTab === "specimen" ? SPECIMEN : activeTab === "tokens" ? TOKENS : OWNERS;
    let data = searchFilter(source, debouncedSearch, searchFields);
    if (activeTab === "owners") {
      data = applyOwnerSort(data, filter.OrderBy);
    } else {
      data = applyFilters(data, filter);
    }
    return data;
  }, [activeTab, debouncedSearch, filter]);

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
            <p className={styles.noData}>NO RESULTS FOUND</p>
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
                      alt={specimenFormTitle(specimenModal.name, formIndex)}
                    />
                  </>
                )}

                {/* Header overlay */}
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitleBar}>
                    <h2 className={styles.modalTitle}>{specimenFormTitle(specimenModal.name, formIndex)}</h2>
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
                    {specimenModal.attributes?.length > 0 && (
                      <div className={styles.modalSection}>
                        <h3 className={styles.modalSectionTitle}>ATTRIBUTES</h3>
                        <ul className={styles.attrList}>
                          {specimenModal.attributes.map((a) => (
                            <li key={a.name} className={styles.attrItem}>
                              <span className={styles.attrLabel}>{a.name}</span>
                              <span className={styles.attrValue}>{a.value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {specimenModal.stats?.length > 0 && (
                      <div className={styles.modalSection}>
                        <h3 className={styles.modalSectionTitle}>STATS</h3>
                        <div className={styles.statBars}>
                          {specimenModal.stats.map((s) => (
                            <div key={s.name} className={styles.statRow}>
                              <span className={styles.statName}>{s.name}</span>
                              <div className={styles.statTrack}>
                                <div className={styles.statFill} style={{ width: `${(s.value / s.max) * 100}%` }} />
                              </div>
                              <span className={styles.statVal}>{`${s.value} / ${s.max}`}</span>
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
                    {specimenModal.abilities?.length === 0 && (
                      <p className={styles.noData} style={{ margin: "20px 0" }}>No abilities listed.</p>
                    )}
                    {specimenModal.abilities?.map((ab) => (
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
                        <div className={styles.abilityStats}>
                          <div className={styles.abilityStat}>
                            <span className={styles.asLabel}>ATK</span>
                            <span className={styles.asValue}>{ab.atk ?? "—"}</span>
                          </div>
                          <div className={styles.abilityStat}>
                            <span className={styles.asLabel}>DEF</span>
                            <span className={styles.asValue}>{ab.def ?? "—"}</span>
                          </div>
                          <div className={styles.abilityStat}>
                            <span className={styles.asLabel}>{ab.specialType || "SPECIAL"}</span>
                            <span className={`${styles.asValue} ${styles.asValueSpecial}`}>{ab.specialValue ?? "—"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* METRICS */}
                {modalTab === "metrics" && (
                  specimenModal.metrics ? (
                    <div className={styles.metricsContent}>
                      <div className={styles.metricsGroup}>
                        <h4 className={styles.metricsGroupTitle}>POPULATION</h4>
                        <div className={styles.metricsGrid}>
                          <div className={styles.metricItem}><span className={styles.mLabel}>Cap</span><span className={styles.mValue}>{specimenModal.metrics.population.cap?.toLocaleString()}</span></div>
                          <div className={styles.metricItem}><span className={styles.mLabel}>Minted</span><span className={styles.mValue}>{specimenModal.metrics.population.totalMinted?.toLocaleString()}</span></div>
                          <div className={styles.metricItem}><span className={styles.mLabel}>Burned</span><span className={styles.mValue}>{specimenModal.metrics.population.totalBurned?.toLocaleString()}</span></div>
                          <div className={styles.metricItem}><span className={styles.mLabel}>Growth</span><span className={`${styles.mValue} ${styles.mValueAccent}`}>{specimenModal.metrics.population.growth}</span></div>
                        </div>
                      </div>
                      <div className={styles.metricsGroup}>
                        <h4 className={styles.metricsGroupTitle}>OWNERSHIP</h4>
                        <div className={styles.metricsGrid}>
                          <div className={styles.metricItem}><span className={styles.mLabel}>Unique Owners</span><span className={styles.mValue}>{specimenModal.metrics.ownership.uniqueOwners?.toLocaleString()}</span></div>
                          <div className={styles.metricItem}><span className={styles.mLabel}>Longest Holder</span><span className={styles.mValue}>{specimenModal.metrics.ownership.longestHolder}</span></div>
                          <div className={styles.metricItem}><span className={styles.mLabel}>Research Tokens</span><span className={styles.mValue}>{specimenModal.metrics.ownership.researchTokens}</span></div>
                        </div>
                      </div>
                      <div className={styles.metricsGroup}>
                        <h4 className={styles.metricsGroupTitle}>LINEAGE</h4>
                        <div className={styles.metricsGrid}>
                          <div className={styles.metricItem}><span className={styles.mLabel}>Total Forms</span><span className={styles.mValue}>{specimenModal.metrics.lineage.totalForms}</span></div>
                          <div className={styles.metricItem}><span className={styles.mLabel}>Supply/Form</span><span className={styles.mValue}>{specimenModal.metrics.lineage.supplyPerForm}</span></div>
                          <div className={styles.metricItem}><span className={styles.mLabel}>Rarest Form</span><span className={`${styles.mValue} ${styles.mValueAccent}`}>{specimenModal.metrics.lineage.rarestForm}</span></div>
                          <div className={styles.metricItem}><span className={styles.mLabel}>Popular Form</span><span className={styles.mValue}>{specimenModal.metrics.lineage.popularForm}</span></div>
                        </div>
                      </div>
                      <div className={styles.metricsGroup}>
                        <h4 className={styles.metricsGroupTitle}>BATTLE</h4>
                        <div className={styles.metricsGrid}>
                          <div className={styles.metricItem}><span className={styles.mLabel}>Usage Rate</span><span className={styles.mValue}>{specimenModal.metrics.battle.usageRate}</span></div>
                          <div className={styles.metricItem}><span className={styles.mLabel}>Victories</span><span className={styles.mValue}>{specimenModal.metrics.battle.victories?.toLocaleString()}</span></div>
                          <div className={styles.metricItem}><span className={styles.mLabel}>Damage Dealt</span><span className={styles.mValue}>{specimenModal.metrics.battle.damageDealt}</span></div>
                          <div className={styles.metricItem}><span className={styles.mLabel}>Win Rate</span><span className={`${styles.mValue} ${styles.mValueAccent}`}>{specimenModal.metrics.battle.winRate}</span></div>
                          <div className={styles.metricItem}><span className={styles.mLabel}>Power Index</span><span className={styles.mValue}>{specimenModal.metrics.battle.powerIndex}</span></div>
                        </div>
                      </div>
                      {specimenModal.metrics.blockchain?.openseaUrl && (
                        <div className={styles.metricsCta}>
                          <a href={specimenModal.metrics.blockchain.openseaUrl} target="_blank" rel="noopener noreferrer" className={styles.openseaLink}>
                            VIEW ON OPENSEA
                          </a>
                        </div>
                      )}
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
