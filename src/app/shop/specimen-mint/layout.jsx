// Wallet support for the Specimen Minter only.
// To give another page wallet access, add a layout.jsx like this one in its folder.
import WalletProvider from "@/providers/WalletProvider";

export default function SpecimenMintLayout({ children }) {
  return <WalletProvider>{children}</WalletProvider>;
}
