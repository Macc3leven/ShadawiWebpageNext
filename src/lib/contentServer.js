// Reads the public specimen catalog from the Shadawi content server and shapes it for the
// Specimen Archive. Runs on the server while the page renders, so the URL is never sent to browsers.
const BASE_URL = process.env.CONTENT_SERVER_URL || "http://localhost:8080";

// How long a rendered page may reuse the catalog before asking the content server again
export const CATALOG_REVALIDATE_SECONDS = 60;

const ATTRIBUTE_LABELS = [["purgLvl", "PurgLvl"], ["class", "Class"], ["build", "Build"], ["size", "Size"]];
const STAT_LABELS = { health: "Health", essence: "Essence", speed: "Speed", attack: "Attack", defense: "Defense", stamina: "Stamina" };
const ABILITY_STAT_LABELS = {
  damage: "DMG", force: "FORCE", range: "RANGE", speed: "SPEED",
  barrierHP: "BARRIER HP", movement: "MOVE %", effectPower: "POWER", duration: "DURATION",
};

/** Every species in the catalog, ready for the archive cards and modal. Throws if the server can't be reached. */
export async function fetchSpecimens() {
  const res = await fetch(`${BASE_URL}/v1/specimens`, { next: { revalidate: CATALOG_REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`Content server answered ${res.status}`);
  const { specimens } = await res.json();

  // Stat bars show each value against the highest one in the whole catalog
  const statMax = {};
  for (const form of specimens.flatMap((s) => s.forms)) {
    for (const [name, value] of Object.entries(form.stats ?? {})) statMax[name] = Math.max(statMax[name] ?? 0, value);
  }
  return specimens.map((species) => toArchiveItem(species, statMax));
}

function toArchiveItem(species, statMax) {
  const forms = species.forms.map((form) => toArchiveForm(form, species, statMax));
  const first = forms[0];
  return {
    sid: species.sid,
    name: species.name,
    className: species.forms[0]?.attributes?.class ?? null,
    description: species.legend,
    creator: null,
    mugshot: forms.find((f) => f.image)?.image ?? null,
    currentForm: 0, // forms are 1-based in the catalog, 0-based here (index 0 = Alpha)
    attributes: first?.attributes ?? [], // species-level copy, used by the filters
    forms,
  };
}

function toArchiveForm(form, species, statMax) {
  return {
    title: form.name,
    image: form.mugshot,
    addressableKey: form.addressableKey,
    attributes: ATTRIBUTE_LABELS
      .filter(([key]) => form.attributes?.[key])
      .map(([key, name]) => ({ name, value: form.attributes[key] })),
    stats: Object.entries(form.stats ?? {}).map(([name, value]) => ({
      name: STAT_LABELS[name] ?? name, value, max: statMax[name] || 1, relative: true,
    })),
    abilities: form.abilities.map((ability) => ({
      name: ability.name,
      type: ability.category,
      description: ability.description,
      cost: { type: ability.cost.resource, value: ability.cost.value },
      stats: [
        ...Object.entries(ability.stats ?? {}).map(([name, value]) => ({ label: ABILITY_STAT_LABELS[name] ?? name.toUpperCase(), value })),
        { label: "COOLDOWN", value: `${ability.cooldown}s` },
      ],
    })),
    metrics: {
      groups: [
        { title: "POPULATION", items: [
          { label: "Total", value: form.population?.total ?? 0 },
          { label: "Owned", value: form.population?.owned ?? 0 },
          { label: "This form", value: form.population?.thisForm ?? 0 },
        ] },
        { title: "LINEAGE", items: [{ label: "Total forms", value: species.totalForms }] },
      ],
    },
  };
}
