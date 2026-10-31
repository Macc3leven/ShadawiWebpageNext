import styles from "./page.module.css";
import { ledger } from "@/data/specimenMintLedger";
import MinterHero from "@/components/Minters/MinterHero";
import MintPanel from "@/components/Minters/MintPanel";
import LedgerCarousel from "@/components/Minters/LedgerCarousel";
import ProcessSteps from "@/components/Minters/ProcessSteps";

export const metadata = { title: "Specimen Minter — Shadawi" };

export default function MinterPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.top}>
          <MinterHero />
          <MintPanel />
        </div>

        <LedgerCarousel specimens={ledger} />

        <ProcessSteps />
      </div>
    </main>
  );
}
