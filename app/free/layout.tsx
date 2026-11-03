import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import styles from "./free.module.css";

export default function FreeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className={styles.lab}>
        {children}
      </main>
      <Footer />
    </>
  );
}
