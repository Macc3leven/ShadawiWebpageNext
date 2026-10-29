import Button from "@/components/Button/Button";
import shared from "@/sections/sections.module.css";

export default function Stories() {
  return (
    <section id="specimens" className={shared.section}>
      <div className={`${shared.content} ${shared.alignRight}`}>
        <div className={shared.column}>
          <h2 className={shared.title}>Every specimen carries a story</h2>
          <p className={shared.subtitle}>
            Specimens are the central beings of Shadawi. Some are beasts of war.
            Some belong to ancient kingdoms. Some are tied to realms, bloodlines,
            lost battles, and powers older than mage civilization.
          </p>
          <p className={shared.subtitle}>
            Each specimen is recorded by SID, class, form, rarity, abilities, and
            lineage. They are not just monsters to collect. They are living records
            of the world.
          </p>
          <div className={shared.actions}>
            <Button href="/specimen" variant="primary">View specimens</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
