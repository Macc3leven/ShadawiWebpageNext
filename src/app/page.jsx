import FrameCanvas from "@/components/FrameCanvas/FrameCanvas";
import Hero from "@/sections/Hero/Hero";
import Ownership from "@/sections/Ownership/Ownership";
import Stories from "@/sections/Stories/Stories";
import Games from "@/sections/Games/Games";
import Connect from "@/sections/Connect/Connect";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <FrameCanvas />
      <Hero />
      <div className={styles.paddedDiv} />
      <Ownership />
      <div className={styles.paddedDiv} />
      <Stories />
      <div className={styles.paddedDiv} />
      <Games />
      <div className={styles.paddedDiv} />
      <Connect />
    </>
  );
}
