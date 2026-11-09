// Reads the public specimen catalog from the Shadawi content server and shapes it for the
// Specimen Archive. Runs on the server while the page renders, so the URL is never sent to browsers.
import { STAT_META, STAT_NAMES } from "shadawi-models/constants";

const BASE_URL = process.env.CONTENT_SERVER_URL || "http://localhost:8080";

// How long a rendered page may reuse the catalog before asking the content server again
export const CATALOG_REVALIDATE_SECONDS = 60;

const ATTRIBUTE_LABELS = [["purgLvl", "PurgLvl"], ["class", "Class"], ["build", "Build"], ["size", "Size"]];
const ABILITY_STAT_LABELS = {
  damage: "DMG", force: "FORCE", range: "RANGE", speed: "SPEED",
  barrierHP: "BARRIER HP", movement: "MOVE %", effectPower: "POWER", duration: "DURATION",
};

/** Every species in the catalog, ready for the archive cards and modal. Throws if the server can't be reached. */
export async function fetchSpecimens() {
  const res = await fetch(`${BASE_URL}/v1/specimens`, { next: { revalidate: CATALOG_REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`Content server answered ${res.status}`);
  const { specimens } = await res.json();
  return specimens.map(toArchiveItem);
}

function toArchiveItem(species) {
  const forms = species.forms.map(toArchiveForm);
  const first = forms[0];
  return {
    sid: species.sid,
    name: species.name,
    className: species.forms[0]?.attributes?.class ?? null,
    description: species.legend,
    creator: null,
    mugshot: forms.find((f) => f.image)?.image ?? null,
    currentForm: 0, // forms are 1-based in the catalog, 0-based here (index 0 = Alpha)
    totalForms: species.totalForms,
    attributes: first?.attributes ?? [], // species-level copy, used by the filters
    forms,
  };
}

function toArchiveForm(form) {
  return {
    title: form.name,
    image: form.mugshot,
    webDisplay: form.webDisplay, // the Unity address the 3D viewer loads
    attributes: ATTRIBUTE_LABELS
      .filter(([key]) => form.attributes?.[key])
      .map(([key, name]) => ({ name, value: form.attributes[key] })),
    // In STAT_NAMES order. max is null for a stat with no limit (weight), which shows no bar.
    stats: STAT_NAMES.filter((name) => form.stats?.[name] != null).map((name) => ({
      name: STAT_META[name].label,
      description: STAT_META[name].description,
      value: form.stats[name],
      max: STAT_META[name].max,
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
    population: {
      total: form.population?.total ?? 0,
      owned: form.population?.owned ?? 0,
      thisForm: form.population?.thisForm ?? 0,
    },
  };
}
