import React from "react";
import Image from "next/image";
import styles from "./UIStyles/MainText.module.css";

function MainText() {
  return (
    <div className={styles.imageWrapper}>
      <Image
        src="/images/mainText.webp" // Image path (public/images/example.jpg)
        alt="Example Image"
        width={392}
        height={134}
        className={styles.image}
        priority
      />
    </div>
  );
}

export default MainText;
