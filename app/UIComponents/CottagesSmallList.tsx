// CottagesSmallList.tsx
"use client";
import React, { useEffect, useState } from "react";
import styles from "./UIStyles/CottagesSmallList.module.css";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface Cottage {
  id: number;
  name: string;
  main_photo: string;
  max_persons: number;
}

interface CottagesSmallListProps {
  onCottageSelect: (cottageId: number, cottageName: string) => void;
}

const CACHE_KEY = "cottagesData";
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

function CottagesSmallList({ onCottageSelect }: CottagesSmallListProps) {
  const [cottages, setCottages] = useState<Cottage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCottages = async () => {
      setIsLoading(true);

      // Check for cached data
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`);

      if (cachedData && cachedTimestamp) {
        const now = Date.now();
        const expirationTime =
          parseInt(cachedTimestamp, 10) + CACHE_EXPIRATION_TIME;

        if (now < expirationTime) {
          console.log("Data loaded from cache");
          setCottages(JSON.parse(cachedData) as Cottage[]);
          setIsLoading(false);
          return; // Exit early if data is valid in cache
        } else {
          console.log("Cached data expired");
          localStorage.removeItem(CACHE_KEY);
          localStorage.removeItem(`${CACHE_KEY}_timestamp`);
        }
      }

      // Fetch from Supabase if no valid cache
      console.log("Fetching data from Supabase");
      const { data, error } = await supabase.from("cottages").select("*");

      if (error) {
        console.error("Error fetching cottages:", error);
      } else {
        setCottages(data as Cottage[]);

        // Cache the data
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now().toString());
      }
      setIsLoading(false);
    };

    fetchCottages();
  }, []);

  useEffect(() => {
    console.log("cottages data:", cottages);
  }, [cottages]);

  return (
    <div className={styles.mainContainer}>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loader} />
        </div>
      ) : (
        cottages.map((item) => (
          <div key={item.id} className={styles.cottage}>
            <p className={styles.name}>{item.name}</p>
            <div
              className={styles.imgContainer}
              style={{
                backgroundImage: `url(${item.main_photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className={styles.innerGroup}>
                <button
                  className={styles.button}
                  onClick={() => onCottageSelect(item.id, item.name)} // Call the callback here
                >
                  SELECT
                </button>
                <Link href={`/cottages/${item.id}`} className={styles.link}>
                  <button className={styles.button}>TAKE A LOOK</button>
                </Link>
              </div>
            </div>
            <p className={styles.person}>6 person max</p>
          </div>
        ))
      )}
    </div>
  );
}

export default CottagesSmallList;
