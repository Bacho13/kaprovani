import React from "react";
import styles from "./UIStyles/CheckItOutButton.module.css";

function CheckItOutButton() {
  return (
    <div className={styles.button}>
      <p className={styles.text}>Check it out</p>
    </div>
  );
}

export default CheckItOutButton;
