"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
function pathsIgnore() {
  const pathname = usePathname();
  return pathname.startsWith("/marketplace/specimen-mint") || pathname.startsWith("/marketplace/gem-mint");
}

export default function ConditionalNavbar() {
  const pathname = usePathname();
  if (pathsIgnore(pathname)) return null;
  return <Navbar />;
}
