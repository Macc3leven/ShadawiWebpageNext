import UniverseArticle from "@/components/UniverseArticle/UniverseArticle";

export const metadata = { title: "The Elders — Universe — Shadawi" };


const image = { src: "/images/story/elders.png", alt: "The Elders" };

const PAGES = [
  [ 
    "Before the first realm was named and before the mage orders rose to organize the known world, the Elders existed. They are not gods in any common sense — they did not create from nothing. Instead, they shaped. They took the raw fabric of dimensional space and imposed structure upon it, defining laws, assigning forces, and sealing off zones of power that lesser beings were never meant to approach.",
    "The Elders are believed to number eight — one for each domain of reality. Each presided over a domain not as a ruler but as an architect, embedding their will into the very physics of the place. To understand a realm is, in part, to understand the Elder who built it. Their aesthetics appear in the geometry of certain rock formations, in the way certain spells fail near ancient ruins, in the particular colors of a realm's sky at the edge of each cycle.",
    "No mage in recorded history has made confirmed contact with an Elder. What is known comes from artifacts — texts etched in materials that predate the mage calendar, structures that should not be able to stand, and a class of specimen called Remnants who carry biological signatures traceable to Elder-era design.",
  ],
  [
    "The Elders did not vanish — they receded. This distinction matters to those who study them. Vanishing implies erasure. Receding implies withdrawal by choice, or by some force significant enough to compel beings of their order. The mage scholar Orvaan Thessa spent forty years attempting to trace the moment of recession and concluded that it was not a single event but a long, deliberate retreat that began before the mage civilization could record it.",
    "What remained after the recession were the Codex-class artifacts — dense objects of unclear material that resist every known analysis. They do not decay. They do not respond to essence. In rare cases, they emit readings that change in the presence of specific specimen classes, suggesting either programming or awareness. Whether the Elders left these objects as tools, records, or warnings has never been resolved.",
    "The current mage councils debate Elder-related research primarily because of one uncomfortable implication: if the Elders built the structure of the universe, and the structure is showing signs of fracture — as recent dimensional readings suggest — then whatever caused the Elders to recede may be returning. The question is not academic.",
  ],
];

export default function EldersPage() {
  return <UniverseArticle title="The Elders" pages={PAGES} imageSrc={image.src} imageAlt={image.alt} />;
}
