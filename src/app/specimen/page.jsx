import SpecimenArchive from "./SpecimenArchive";
import { fetchSpecimens } from "@/lib/contentServer";

// Re-read the catalog from the content server at most once a minute.
// Next.js needs a literal here; keep it equal to CATALOG_REVALIDATE_SECONDS in lib/contentServer.js.
export const revalidate = 60;

// Fetches the specimen catalog on the server, then hands it to the interactive archive
export default async function SpecimenPage() {
  let specimens = [];
  let loadError = false;
  try {
    specimens = await fetchSpecimens();
  } catch (err) {
    console.error("[specimen] couldn't load the catalog from the content server:", err.message);
    loadError = true;
  }
  return <SpecimenArchive specimens={specimens} loadError={loadError} />;
}
