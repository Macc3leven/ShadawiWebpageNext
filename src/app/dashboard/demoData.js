// Sample Mage and Archive for previewing the dashboard without signing in or real Kin.
// Only used in development, at /dashboard?demo
const kin = (id, sid, name, className, image, isNft = false) =>
  ({ id, sid, kinNumber: Number(id.slice(1)) * 7, name, className, image, isNft });

const KIN = [
  kin("k1", 103, "Cloud Ogre", "gas", "/images/specimen-temp/cloudogre.png"),
  kin("k2", 287, "Domigra", "undead", "/images/specimen-temp/domigra.png", true),
  kin("k3", 102, "Mighty Bird", "divine", "/images/specimen-temp/mightybird.png", true),
  kin("k4", 144, "Vargor", "beast", null),
  kin("k5", 319, "Blumi Queen", "fairy", null, true),
  kin("k6", 104, "Seapunk", "gas", "/images/specimen-temp/seapuk.png"),
  kin("k7", 106, "Bramblekin", "plant", null),
];

const merit = (id, name, description, icon, xp, target, progress, earnedAt = null) =>
  ({ id, name, description, icon, xp, target, progress, earnedAt });

export const DEMO_ACCOUNT = { id: "demo", username: "Demo_Mage", email: "mage@example.com", avatar: "mage_male" };

export const DEMO_ARCHIVE = {
  level: { level: 7, xpIntoLevel: 650, xpForNextLevel: 1000, totalXp: 3350 },
  stats: { kinOwned: 24, uniqueSpecies: 12, nftsOwned: 3, classesCollected: 7, classesTotal: 8 },
  byClass: [
    { className: "gas", count: 6 },
    { className: "humanoid", count: 4 },
    { className: "divine", count: 4 },
    { className: "undead", count: 3 },
    { className: "beast", count: 3 },
    { className: "plant", count: 2 },
    { className: "fairy", count: 1 },
    { className: null, count: 1 },
  ],
  merits: [
    merit("first_contact", "First Contact", "Own your first Kin.", "spark", 100, 1, 1, "2026-08-14T12:00:00Z"),
    merit("keeper", "Keeper", "Own 10 Kin.", "crest", 200, 10, 10, "2026-09-02T12:00:00Z"),
    merit("menagerie", "Menagerie", "Own 25 Kin.", "crown", 400, 25, 24),
    merit("naturalist", "Naturalist", "Discover 5 unique species.", "laurel", 150, 5, 5, "2026-08-30T12:00:00Z"),
    merit("field_researcher", "Field Researcher", "Discover 15 unique species.", "laurel", 300, 15, 12),
    merit("realm_walker", "Realm Walker", "Own Kin from 4 classes.", "compass", 250, 4, 4, "2026-09-10T12:00:00Z"),
    merit("grand_archivist", "Grand Archivist", "Own Kin from all 8 classes.", "crown", 600, 8, 7),
    merit("chain_bound", "Chain Bound", "Hold your first Shadawi NFT.", "hex", 150, 1, 1, "2026-09-21T12:00:00Z"),
    merit("first_blood", "First Blood", "Win a battle in Shadawi Striker.", "blade", 100, 1, 0),
    merit("veteran", "Veteran", "Play 50 battles in Shadawi Striker.", "shield", 300, 50, 0),
  ],
  nextMeritId: "menagerie",
};

export const DEMO_COLLECTION = {
  kin: KIN,
  recent: [KIN[3], KIN[0], KIN[2], KIN[4]],
};
