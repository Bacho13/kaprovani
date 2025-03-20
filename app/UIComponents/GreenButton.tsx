import React from "react";
import styles from "./UIStyles/GreenButton.module.css";

interface GreenButtonProps {
  text: string;
}

const GreenButton: React.FC<GreenButtonProps> = (props) => {
  return <button className={styles.greenButton}>{props.text}</button>;
};

export default GreenButton;
