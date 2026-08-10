import Button from "@/components/Button/Button";
import shared from "@/sections/sections.module.css";

export default function Ownership() {
  return (
    <section className={shared.section}>
      <div className={shared.content}>
        <h1 className={shared.title}>LEARN THE WORLD YOUNG MAGE</h1>
        <p className={shared.subtitle}>
          As you may or may not already know, the universe is separated into 8 domains
          of reality. Learn how to navigate, arm yourself young mage — for the time of
          reckoning can tickle our feet as we slumber. Pick up some good knowledge in
          the Universal Library.
        </p>
        <Button href="/universe">UNIVERSE</Button>
      </div>
    </section>
  );
}
