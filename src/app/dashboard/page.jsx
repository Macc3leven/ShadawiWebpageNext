import DashboardClient from "./DashboardClient";
import styles from "./page.module.css";

export const metadata = { title: "Dashboard — Shadawi" };

export default function DashboardPage() {
  return (
    <main className={styles.page}>
      <DashboardClient />
    </main>
  );
}
