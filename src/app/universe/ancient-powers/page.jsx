import UniverseArticle from "@/components/UniverseArticle/UniverseArticle";

export const metadata = { title: "Ancient Powers — Universe — Shadawi" };

const PAGES = [
  [
    "The term ancient powers is used imprecisely in common speech, applied to anything old and threatening. In formal research it refers to a specific category: forces or entities that predate the Elder-era and have no established relationship to the dimensional structure the Elders built. They did not exist inside that structure. They existed before it, around it, or in opposition to it — and the distinction matters.",
    "The primary evidence for ancient powers comes from pre-Compact excavations in Realm Seven, where structures were found that appear to be responses to something — reinforced barriers, essence dampeners of unknown purpose, and a series of inscriptions in a script that predates every known mage language. The inscriptions have been partially translated by the Tessarine Order and describe, in clinical terms, a containment effort. What was being contained is not specified by name.",
    "Specimen research has added a second layer of evidence. A subset of specimens designated class X-Remnant carry biological markers that are not traceable to any known evolutionary line within the eight realms. They appear to be native to conditions that the current universe does not and has never had — temperatures, pressures, and essence densities that would require a fundamentally different dimensional structure to sustain. The implication is that these specimens originated from somewhere, or somewhen, outside the known world.",
  ],
  [
    "The most widely accepted model among researchers who take ancient powers seriously describes them not as beings with intention but as forces with direction — immensely powerful processes that move through dimensional space the way weather moves through a realm, shaping everything they contact without awareness of doing so. Under this model, the Elder recession was not caused by defeat but by a necessary withdrawal to avoid being absorbed or overwritten by something that operates at a scale beyond conflict.",
    "A minority of researchers, led by the Tessarine researcher Melkis Vaan, argues that at least some ancient powers do exhibit intention — that the containment structures in Realm Seven were not built in response to a natural force but in negotiation with an aware one. Vaan's work is controversial and has not been formally accepted by any major house, but her documentation of the Realm Seven inscriptions is considered the most rigorous in the field.",
    "What is not contested is that something is changing. The synchronized realm drift, the anomalous specimen behaviors, the X-Remnant population increases across all eight domains — these are not separate events. Every competent analyst looking at the current data arrives at the same conclusion: whatever the ancient powers are, some portion of them is becoming active again. The councils are preparing. So should you.",
  ],
];

export default function AncientPowersPage() {
  return <UniverseArticle title="Ancient Powers" pages={PAGES} />;
}
