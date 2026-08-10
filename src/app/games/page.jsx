import PortalTemplate from "@/components/PortalTemplate/PortalTemplate";

export const metadata = { title: "Games — Shadawi" };

const CARDS = [
  {
    id: "specimen-hunter",
    title: "Specimen Hunter",
    description: "Embark on a journey to discover and capture rare specimens across the universe.",
    accentColor: "#de6969",
    href: "#",
    icon: (
      <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.4" width="42" height="42">
        <line x1="8" y1="8" x2="34" y2="34" strokeLinecap="round" />
        <line x1="34" y1="8" x2="8" y2="34" strokeLinecap="round" />
        <circle cx="21" cy="21" r="8" />
        <circle cx="21" cy="21" r="2" fill="currentColor" strokeWidth="0" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "shadawi-striker",
    title: "Shadawi Striker",
    description: "A pvp battle mode where mages and their specimens face off in fast-paced combat arenas.",
    accentColor: "#7c5fe6",
    href: "#",
    icon: (
      <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.4" width="42" height="42">
        <circle cx="21" cy="21" r="17" />
        <line x1="21" y1="6" x2="21" y2="10" strokeLinecap="round" />
        <line x1="21" y1="32" x2="21" y2="36" strokeLinecap="round" strokeOpacity="0.4" />
        <line x1="6" y1="21" x2="10" y2="21" strokeLinecap="round" strokeOpacity="0.4" />
        <line x1="32" y1="21" x2="36" y2="21" strokeLinecap="round" strokeOpacity="0.4" />
        <path d="M21 8L23.5 19L21 21L18.5 19Z" fill="currentColor" strokeWidth="0" opacity="0.75" />
      </svg>
    ),
  },
  {
    id: "legends-of-shadawi",
    title: "Legends of Shadawi",
    description: "a fully MMO RPG experience where players explore the lore-rich world, complete quests, and forge alliances.",
    accentColor: "#c8921a",
    href: "#",
    icon: (
      <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.4" width="42" height="42">
        <path d="M21 5L36 11V23C36 31 21 38 21 38C21 38 6 31 6 23V11Z" />
        <path d="M21 12L30 16V23C30 28 21 33 21 33C21 33 12 28 12 23V16Z" strokeOpacity="0.5" />
      </svg>
    ),
  },
  {
    id: "tournaments",
    title: "Tournaments",
    description: "Compete in seasonal events for rare specimens, essence, and eternal glory.",
    accentColor: "#4fc4cf",
    href: "#",
    icon: (
      <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.4" width="42" height="42">
        <path d="M21 4L36 12.5V29.5L21 38L6 29.5V12.5Z" />
        <path d="M21 13L28 17V25L21 29L14 25V17Z" strokeOpacity="0.55" />
        <path d="M17 22L21 18L25 22" strokeOpacity="0.8" />
      </svg>
    ),
  },
];

export default function GamesPage() {
  return (
    <PortalTemplate
      title="Games"
      subtitle="Choose your arena. Every battle is a chance to rise, every quest a legend waiting to be written."
      accentLabel="Browse All Modes"
      cards={CARDS}
    />
  );
}
