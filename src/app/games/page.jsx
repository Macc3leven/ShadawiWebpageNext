import PortalTemplate from "@/components/PortalTemplate/PortalTemplate";

export const metadata = { title: "Games — Shadawi" };

const CARDS = [
  {
    id: "shadawi-striker",
    title: "Shadawi Striker",
    description: "Shadawi Striker is a real-time 3D fighting game where mages build teams of powerful specimens, battle opponents, and earn new creatures through skill-based combat.",
    accentColor: "#7c5fe6",
    href: "/games/shadawi-striker",
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
