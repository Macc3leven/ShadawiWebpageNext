import Button from "@/components/Button/Button";
import shared from "@/sections/sections.module.css";

export default function Universe() {
  return (
    <section className={shared.section}>
      <div className={`${shared.content} ${shared.alignRight}`}>
        <div className={shared.column}>
          <p className={shared.eyebrow}>The universe</p>
          <h2 className={shared.title}>Some storms are alive</h2>
          <p className={shared.subtitle}>
            Across eight realms, life takes forms unfamiliar to even the most
            experienced mages. Deep within the Gas Realm lives Cloud Ogre, a
            powerful specimen carrying Jejar, a sentient cloud that grows and
            changes with its essence. And when the clouds begin to move against
            the wind, you may want to reconsider your journey.
          </p>
          <div className={shared.actions}>
            <Button href="/specimen" variant="primary">View specimens</Button>
            <Button href="/universe" variant="link">Explore the universe</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
