import styles from "./page.module.css";
import Navbar from "./UIComponents/Navbar";
import MainText from "./UIComponents/MainText";
import GreenButton from "./UIComponents/GreenButton";
import Cottages from "./cottages/page";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.pageContent}>
        <div className={styles.mainTextContainer}>
          <MainText />
        </div>
        <Link href="/book">
          <GreenButton text="BOOK NOW" />
        </Link>
      </div>
      <Cottages />
    </div>
  );
}
