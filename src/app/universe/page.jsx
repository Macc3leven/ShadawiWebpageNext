import PortalTemplate from "@/components/PortalTemplate/PortalTemplate";

export const metadata = { title: "Universe — Shadawi" };

const CARDS = [
  {
    id: "elders",
    title: "The Elders",
    description: "Ancient architects of existence. Their designs shape all realms and govern the laws of power.",
    accentColor: "#7c5fe6",
    href: "/universe/elders",
    icon: (
      <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.4" width="42" height="42">
        <path d="M21 3L39 21L21 39L3 21Z" />
        <path d="M21 11L31 21L21 31L11 21Z" strokeOpacity="0.55" />
        <path d="M21 17L25 21L21 25L17 21Z" fill="currentColor" strokeWidth="0" opacity="0.45" />
      </svg>
    ),
  },
  {
    id: "mage-society",
    title: "Mage Society",
    description: "Dynasties, councils, and the fragile order of mages across Elderaad.",
    accentColor: "#c8921a",
    href: "/universe/mage-society",
    icon: (
      <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.4" width="42" height="42">
        <path d="M21 3L39 21L21 39L3 21Z" />
        <path d="M14 24L21 14L28 24" strokeOpacity="0.7" />
        <line x1="13" y1="28" x2="29" y2="28" strokeOpacity="0.6" />
        <circle cx="21" cy="30" r="1.5" fill="currentColor" strokeWidth="0" />
      </svg>
    ),
  },
  {
    id: "realms",
    title: "The Realms",
    description: "Diverse worlds, each with its own laws, wonders, and perils beyond imagination.",
    accentColor: "#7c5fe6",
    href: "/universe/realms",
    icon: (
      <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.4" width="42" height="42">
        <path d="M21 4L36 12.5V29.5L21 38L6 29.5V12.5Z" />
        <path d="M21 12L29 16.5V25.5L21 30L13 25.5V16.5Z" strokeOpacity="0.5" />
        <circle cx="21" cy="21" r="3" fill="currentColor" strokeWidth="0" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "ancient-powers",
    title: "Ancient Powers",
    description: "Forces older than time, slumbering beyond mortal comprehension.",
    accentColor: "#4fc4cf",
    href: "/universe/ancient-powers",
    icon: (
      <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.4" width="42" height="42">
        <path d="M21 4L38 35H4Z" />
        <path d="M21 13L31 30H11Z" strokeOpacity="0.5" />
        <circle cx="21" cy="23" r="3" fill="currentColor" strokeWidth="0" opacity="0.6" />
      </svg>
    ),
  },
];

export default function UniversePage() {
  return (
    <PortalTemplate
      title="Universe"
      subtitle="Knowledge is power. Explore the realms, history, and cosmic forces that shape the world of Shadawi."
      accentLabel="The Shadawi Codex"
      cards={CARDS}
    />
  );
}
