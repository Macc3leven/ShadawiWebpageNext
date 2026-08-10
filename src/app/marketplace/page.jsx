import PortalTemplate from "@/components/PortalTemplate/PortalTemplate";

export const metadata = { title: "Marketplace — Shadawi" };

const CARDS = [
  {
    id: "specimens-minter",
    title: "Specimen Minter",
    description: "Browse, bid, and acquire rare Shadawi from across the universe.",
    accentColor: "#7c5fe6",
    href: "/marketplace/specimen-mint",
    icon: (
      <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.4" width="42" height="42">
        <path d="M21 3L39 21L21 39L3 21Z" />
        <path d="M21 11L31 21L21 31L11 21Z" strokeOpacity="0.55" />
        <path d="M21 17L25 21L21 25L17 21Z" fill="currentColor" strokeWidth="0" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "gem-minter",
    title: "Gem Minter",
    description: "Discover and acquire powerful gems to enhance your specimens and mages.",
    accentColor: "#c8921a",
    href: "/marketplace/gem-mint",
    icon: (
      <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.4" width="42" height="42">
        <path d="M21 6L36 14.5V27.5L21 36L6 27.5V14.5Z" />
        <path d="M21 6L36 14.5L21 23L6 14.5Z" strokeOpacity="0.5" />
        <path d="M6 14.5L21 23V36" strokeOpacity="0.4" />
        <path d="M36 14.5L21 23V36" strokeOpacity="0.4" />
      </svg>
    ),
  },
  {
    id: "opensea",
    title: "Opensea",
    description: "The fundamental force that binds and flows through all things. Trade it wisely.",
    accentColor: "#4fc4cf",
    href: "opensea.io/collection/shadawi",
    icon: (
      <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.4" width="42" height="42">
        <path d="M21 4L32 14L28 38H14L10 14Z" />
        <path d="M21 4L10 14H32Z" strokeOpacity="0.5" />
        <line x1="14" y1="24" x2="28" y2="24" strokeOpacity="0.35" />
        <line x1="15" y1="31" x2="27" y2="31" strokeOpacity="0.25" />
      </svg>
    ),
  },
  // {
  //   id: "bundles",
  //   title: "Bundles",
  //   description: "Curated collections for new collectors and seasoned seekers of power alike.",
  //   accentColor: "#de6969",
  //   href: "#",
  //   icon: (
  //     <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.4" width="42" height="42">
  //       <rect x="8" y="7" width="26" height="8" rx="1" />
  //       <rect x="8" y="18" width="26" height="8" rx="1" strokeOpacity="0.65" />
  //       <rect x="8" y="29" width="26" height="7" rx="1" strokeOpacity="0.4" />
  //     </svg>
  //   ),
  // },
];

export default function MarketplacePage() {
  return (
    <PortalTemplate
      title="Marketplace"
      subtitle="Trade specimens, artifacts, and essence across the realms. Every transaction shapes the balance."
      accentLabel="Browse Listings"
      cards={CARDS}
    />
  );
}
