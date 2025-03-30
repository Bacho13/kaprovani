import React from "react";
import styles from "./cottages.module.css";
import Cottage from "../UIComponents/Cottage";
const cottageesData = [
  {
    name: "COTTAGE NORTH",
    imgUrl:
      "https://i.pinimg.com/736x/44/81/41/4481411f7e572d0f9f11ed01a98c9cc1.jpg",
  },
  {
    name: "COTTAGE CENTER",
    imgUrl:
      "https://i.pinimg.com/736x/fb/0a/51/fb0a519e114c42a67b00205aa19e193a.jpg",
  },
  {
    name: "COTTAGE SOUTH",
    imgUrl:
      "https://i.pinimg.com/736x/3a/ee/eb/3aeeeb3f663a472d1fe38c823c443344.jpg",
  },
];

function Cottages() {
  return (
    <div className={styles.mainContainer}>
      {cottageesData.map((cottage) => (
        <Cottage name={cottage.name} imgUrl={cottage.imgUrl} />
      ))}
    </div>
  );
}

export default Cottages;
