// The eight realms a specimen can belong to, and the colour each one uses across the site
export const SPECIMEN_CLASSES = ["divine", "elemental", "gas", "undead", "humanoid", "plant", "beast", "fairy"];

export const CLASS_COLORS = {
  beast: "#f2584e",
  plant: "#6fcf73",
  fairy: "#d68cf0",
  elemental: "#9fb4c8",
  undead: "#a58cf0",
  gas: "#5fb8f0",
  humanoid: "#b8b8b8",
  divine: "#e8c36a",
};

export const NO_CLASS_COLOR = "#4a4a4a";

export const classColor = (className) => CLASS_COLORS[String(className || "").toLowerCase()] || NO_CLASS_COLOR;
export const classLabel = (className) => (className ? className.toUpperCase() : "NO CLASS");
