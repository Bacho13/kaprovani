import React from "react";
import styles from "./UIStyles/Cottage.module.css";
import CheckItOutButton from "./CheckItOutButton";

function Cottage({ name, imgUrl }) {
  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${imgUrl})` }}
    >
      <div className={styles.greenShade}>
        <p className={styles.name}>{name}</p>
        <CheckItOutButton />
      </div>
    </div>
  );
}

export default Cottage;
