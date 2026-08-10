import Button from "@/components/Button/Button";
import shared from "@/sections/sections.module.css";
import styles from "./Stories.module.css";

export default function Stories() {
  return (
    <section className={shared.section}>
      <div className={`${shared.content} ${shared.alignRight}`}>
        <h1 className={shared.title}>EVERY SPECIMEN CARRIES A STORY</h1>
        <p className={shared.subtitle}>
          Specimens are the central beings of Shadawi. Some are beasts of war.
          Some belong to ancient kingdoms. Some are tied to realms, bloodlines,
          lost battles, and powers older than mage civilization.
          <br /><br />
          Each specimen is recorded by SID, class, form, rarity, abilities, and
          lineage. They are not just monsters to collect. They are living records
          of the world.
        </p>
        <Button href="/specimen">VIEW SPECIMENS</Button>
      </div>
    </section>
  );
}
