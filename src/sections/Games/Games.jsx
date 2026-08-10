import Button from "@/components/Button/Button";
import shared from "@/sections/sections.module.css";

export default function Games() {
  return (
    <section className={shared.section}>
      <div className={shared.content}>
        <h1 className={shared.title}>PLAY, BATTLE, AND BUILD YOUR PLACE</h1>
        <p className={shared.subtitle}>
          Shadawi expands through playable titles, battle systems, realm-based
          adventures, and connected player progression. Games are where the world
          becomes active: mages fight, specimens matter, rewards are earned, and
          choices begin to shape identity. The system is built for exploration,
          combat, collection, and long-term growth.
        </p>
        <Button href="/games">EXPLORE GAMES</Button>
      </div>
    </section>
  );
}
