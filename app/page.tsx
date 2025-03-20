import styles from "./page.module.css";
import Navbar from "./UIComponents/Navbar";
import MainText from "./UIComponents/MainText";
import GreenButton from "./UIComponents/GreenButton";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.pageContent}>
        <Navbar />
        <div className={styles.mainTextContainer}>
          <MainText />
        </div>
        <GreenButton text="BOOK NOW" />
      </div>
    </div>
  );
}
