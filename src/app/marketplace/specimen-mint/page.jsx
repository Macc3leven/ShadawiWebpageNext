// app/minter/page.jsx
import styles from "./page.module.css";
import { ledger } from "@/data/specimenMintLedger";
import MinterHeader from "@/components/Minters/MinterHeader";
import MinterHero from "@/components/Minters/MinterHero";
import LedgerCarousel from "@/components/Minters/LedgerCarousel";
import QuantitySelector from "@/components/Minters/QuantitySelector";
import MintButton from "@/components/Minters/MintButton";
import TrustBar from "@/components/Minters/TrustBar";

export default function MinterPage() {
  const nextSpecimen = ledger[0];

  return (
    <main className={styles.page}>
      <MinterHeader />

      <section className={styles.shell}>
        <MinterHero />

        <LedgerCarousel specimens={ledger} />

        <div className={styles.controls}>
          <QuantitySelector />
          <MintButton price="0.08 ETH" />
          <p className={styles.note}>
            You will receive the specimen shown above.
          </p>
        </div>

        <TrustBar />
      </section>
    </main>
  );
}