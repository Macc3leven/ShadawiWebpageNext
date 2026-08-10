import UniverseArticle from "@/components/UniverseArticle/UniverseArticle";

export const metadata = { title: "The Realms — Universe — Shadawi" };

const image = { src: "/images/story/sun.jpg", alt: "The Sun" };

const PAGES = [
  [
    "The Outerverse is not one continuous field of stars. It is divided into eight ancient realms: Divine, Elemental, Gas, Undead, Humanoid, Plant, Beast, and Fairy. Each realm is a sovereign layer of existence, shaped by its own physical laws, Essence behavior, native specimen populations, and spiritual pressure. Space exists in every realm, but space does not obey the same rules everywhere.",
    "Elderaad belongs to the Humanoid Realm, the realm most familiar to mage civilization. From there, the Council, dynasties, and Grandmage orders first charted the wider structure of existence. What they discovered was not merely distant planets, but neighboring realities — realms that could only be entered through sanctioned transit gates, Elder-era crossings, unstable seams, or the rare natural affinity of certain specimen classes.",
    "The realms are not ranked by worth. They are separated by law. The Divine Realm carries the highest pressure of authority, judgment, and bloodline inheritance. The Undead Realm holds regions where death, memory, and stasis behave like forces of nature. The Plant Realm is not simply a forested dimension, but a living cosmic ecology where growth, ancestry, and rooted memory shape civilization. Each realm changes what Essence can do, what specimens become, and what mages risk by staying too long."
  ],
  [
    "The borders between realms are not walls. They are seams — unstable threshold zones where one law of reality begins to bleed into another. A traveler crossing a seam may experience broken gravity, distorted time, altered Essence flow, or contact with unclassified specimen forms. Many Elder-era ruins are found near these seams, suggesting that the Elders either built the first crossings or understood the realm structure before mage civilization existed.",
    "Most legal travel is controlled by mage institutions, trade houses, cartographic guilds, and Council-sanctioned transit authorities. Unsanctioned crossing is treated as both a survival risk and a political crime. A mage who enters the wrong realm without protection may lose control of their Essence, attract hostile specimens, or return changed in ways no healer can reverse.",
    "This is why Domigra’s threat is catastrophic. He is not merely invading Elderaad with an army. He is attempting to unravel the barriers between realms and bridge them into one broken reality. If the seams collapse, the Undead Realm does not simply send soldiers — its laws spread. Death, stasis, and corrupted memory begin pressing into the Humanoid Realm itself."
  ],
  [
    "Some realms are more stable than others. The Humanoid Realm, Plant Realm, and certain settled corridors of the Elemental Realm have long supported trade, diplomacy, and military movement. Others remain dangerous even to expert mages. The Gas Realm shifts like a living storm. The Fairy Realm bends perception, names, bargains, and memory. The Beast Realm follows territorial laws older than speech. The Undead Realm resists life as an intruder.",
    "Each realm carries a distinct Essence character. This character affects spell reliability, specimen evolution, illness, inheritance, and long-term exposure. A mage trained on Elderaad may find familiar techniques weakened in the Gas Realm, overcharged in the Elemental Realm, or spiritually contaminated near Undead seams. This is why realm knowledge is not academic. It is survival doctrine.",
    "The current crisis begins when dimensional monitors detect synchronized drift across all eight realms. Isolated realm-shift is known. It can be measured, predicted, and sometimes corrected. But all eight realms drifting at once suggests something larger than natural instability. Some Council mages suspect Domigra. Others whisper of the Hirudine. The oldest records point further back — toward the Elders, and toward the possibility that the realm structure was never permanent."
  ],
];

export default function RealmsPage() {
  return <UniverseArticle title="The Realms" pages={PAGES} imageSrc={image.src} imageAlt={image.alt} />;
}
