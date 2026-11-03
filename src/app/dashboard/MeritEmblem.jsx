// Line emblems for Merits, keyed by the icon name the User API sends
const PATHS = {
  laurel: "M8 19C4.5 16 3.5 11 5 6M5.2 9.5 3 8.6M5 13l-2.2-.4M6.4 16l-1.8.4M16 19c3.5-3 4.5-8 3-13M18.8 9.5 21 8.6M19 13l2.2-.4M17.6 16l1.8.4M12 7l1 2.2 2.4.3-1.8 1.6.5 2.4-2.1-1.2-2.1 1.2.5-2.4-1.8-1.6 2.4-.3z",
  spark: "M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z",
  crest: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM8.5 10.5l3.5 3 3.5-3",
  crown: "M4 18h16M4 18 3 7l5 4 4-6 4 6 5-4-1 11",
  compass: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2.5 4.5-4.5 2.5 2.5-4.5z",
  hex: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 8l4 2.3v4.4L12 17l-4-2.3v-4.4z",
  blade: "M20 4 9 15M20 4h-4.5M20 4v4.5M6 12.5l5.5 5.5M7.5 16.5 4 20",
  shield: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z",
};

export default function MeritEmblem({ icon, earned, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-earned={earned ? "" : undefined}
    >
      <path d={PATHS[icon] || PATHS.laurel} />
    </svg>
  );
}
