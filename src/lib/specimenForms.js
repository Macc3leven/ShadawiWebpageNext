// Specimen evolution stages.
// The Shadawi research team names forms with the Greek alphabet:
// form 1 (base) = Alpha, form 2 = Beta, form 3 = Gamma, and so on.
// A specimen in form 2 is called "<Specimen> Beta"; base forms keep the plain name.
export const FORM_STAGES = [
  "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta",
  "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi",
  "Rho", "Sigma", "Tau", "Upsilon", "Phi", "Chi", "Psi", "Omega",
];

// 0-based form index -> stage name ("Alpha", "Beta", ...)
export function formStageName(index) {
  return FORM_STAGES[index] ?? `Form ${index + 1}`;
}

// Display name for a specimen in a given form: "Mighty Bird", "Mighty Bird Beta", ...
export function specimenFormTitle(name, index) {
  return index > 0 ? `${name} ${formStageName(index)}` : name;
}
