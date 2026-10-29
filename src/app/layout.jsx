// src/app/layout.jsx
// ---------------------------------------------------------------
// ROOT LAYOUT — wraps every single page in your app.
//
// 🧠 REACT LESSON: What's a layout?
// In Next.js App Router, layout.jsx is special. It defines the
// shell that surrounds whatever page is currently rendered.
// The {children} prop is wherever Next.js injects the active page.
//
// You only need ONE <html> and ONE <body> in your whole app —
// they go here, NOT in individual pages.
//
// 🧠 REACT LESSON: This is the ONLY place globals.css can be imported.
// Next.js enforces this rule. CSS Modules can be imported anywhere.
// ---------------------------------------------------------------

import "@/styles/globals.css";
import { Exo_2 } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";
import WalletProvider from "@/providers/WalletProvider";

// Exo 2 — closest Google font to the mockups. Bold for titles, normal for body.
const exo = Exo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-exo",
  display: "swap",
});

export const metadata = {
  title: "Shadawi — Reserve a Specimen",
  description:
    "Every Shadawi carries a legend. Collect them, build your alliance, and shape the fate of the galaxy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={exo.variable}>
      <body>
        <WalletProvider>
          <Navbar />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
