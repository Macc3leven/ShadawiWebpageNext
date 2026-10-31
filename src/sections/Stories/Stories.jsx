import Button from "@/components/Button/Button";
import shared from "@/sections/sections.module.css";

export default function Stories() {
  return (
    <section id="specimens" className={shared.section}>
      <div className={`${shared.content} ${shared.alignRight}`}>
        <div className={shared.column}>
          <h2 className={shared.title}>Every specimen carries a story</h2>
          <p className={shared.subtitle}>
            Some are forged for war, others carry the lineage of kingdoms that
            collapsed long before mages were born. They are cataloged by
            class, form, and volatile history—not to be collected, but to be contained.
          </p>
          <div className={shared.actions}>
            <Button href="/specimen" variant="primary">
              View specimens
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
