import UniverseArticle from "@/components/UniverseArticle/UniverseArticle";

export const metadata = { title: "Mage Society — Universe — Shadawi" };

const image = { src: "/images/story/mage-society.jpg", alt: "Mage Society" };

const PAGES = [
  [
    "Mage society did not emerge in a single place or from a single tradition. Across the eight domains, isolated groups of essence-sensitives developed their own methods, rituals, and hierarchies over thousands of cycles. What eventually unified them — loosely, and often violently — was the formation of the Inter-Realm Compact, a framework of shared law that recognized mage practitioners as a protected class with rights to pursue research, trade, and political organization across realm boundaries.",
    "The Compact is not a government. It has no standing army and no treasury. It is better understood as a shared agreement not to destroy each other without due process. Beneath it, mage society is organized into dynastic houses, each with its own seat of power, patron realm, and area of essence specialization. Some houses have existed for sixty generations. Others rose recently, built on newly discovered essence strains or the political fallout of older houses collapsing.",
    "Admission into a house is partly hereditary and partly achieved. Every mage child with detectable essence sensitivity is catalogued at birth, assigned a provisional house affiliation based on parentage, and assessed over the following decade for aptitude, character, and potential. Those who pass formal initiation are granted full house standing. Those who do not are classified as unaligned — not powerless, but without institutional backing.",
  ],
  [
    "The three dominant houses in the current cycle are House Vaeleth, House Orun, and the Tessarine Order. Vaeleth controls the primary essence trade routes through Realm Five and has historically funded most of the known Codex research. Orun is a military house with deep roots in Realm Two, responsible for training the majority of combat-certified mages. The Tessarine Order is not technically a house — it is a research collective that refuses dynastic structure — but its influence over specimen classification and dimensional theory gives it power equivalent to the oldest bloodlines.",
    "Below the major houses sit dozens of minor houses, regional guilds, unaligned practitioners, and the increasingly significant presence of specimen-bonded mages — those whose practice is built around their relationship to a specific specimen. This last group has no formal standing in the Compact but is growing in number and political relevance, particularly since specimens have begun exhibiting behaviors that older classification models cannot explain.",
    "The most significant tension in current mage society is not between houses — it is between the institutional order as a whole and the evidence that the world is changing faster than the institutions can adapt. Reports from outer realm borders, anomalous specimen behavior, and the appearance of what some researchers are calling post-Compact artifacts have put the councils under pressure they have not faced in living memory.",
  ],
];

export default function MageSocietyPage() {
  return <UniverseArticle title="Mage Society" pages={PAGES} imageSrc={image.src} imageAlt={image.alt} />;
}
