"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./UIStyles/Navbar.module.css";
import { UserRound, X } from "lucide-react";
import {
  checkSession,
  handleAuthStateChange,
  handleSignOut,
} from "../Redux/lib/auth";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../Redux/store";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "COTTAGES", href: "/cottages" },
  { name: "CONTACT US", href: "/contacts" },
  { name: "GALLERY", href: "/gallery" },
];
const userLinks = [
  { name: "SIGN IN", href: "/signIn" },
  { name: "REGISTER", href: "/register" },
];

const Navbar = () => {
  const userEmail = useAppSelector((state) => state.auth.user?.email);
  const user = useAppSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // State for scroll
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    checkSession();
    handleAuthStateChange();
  }, [dispatch]);

  const signOutHandler = async () => {
    await handleSignOut();
    router.push("/"); // Redirect after logout
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
        console.log("Scrolled: true");
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={` ${isScrolled ? styles.scrolled : styles.navbar}`}>
      <div className={styles.container}>
        {/* Hamburger Menu for Mobile */}
        <button
          className={styles.menuButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          ☰
        </button>

        {/* Links */}
        <ul className={`${styles.navLinks} ${isOpen ? styles.show : ""}`}>
          <div
            className={styles.closeButton}
            onClick={() => setIsOpen(!isOpen)}
          >
            <X size={50} />
          </div>
          <div className={styles.navGroup}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className={styles.navItem}>
                  {link.name}
                </Link>
              </li>
            ))}
          </div>
          <div className={styles.userGroup}>
            {userEmail ? (
              <li style={{ display: "flex" }}>
                <a
                  href="/profile"
                  style={{
                    cursor: "pointer",
                    color: "inherit",
                    textDecoration: "none",
                    marginRight: "25px",
                  }}
                >
                  <UserRound
                    size={15}
                    style={{ cursor: "pointer", marginRight: "15px" }}
                  />
                  MY PROFILE
                </a>
                <p onClick={signOutHandler} style={{ cursor: "pointer" }}>
                  SIGN OUT
                </p>
              </li>
            ) : (
              userLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className={styles.navItem}>
                    {link.name}
                  </Link>
                </li>
              ))
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
