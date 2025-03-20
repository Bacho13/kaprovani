"use client";

import React, { useState, useEffect, FormEvent } from "react"; // Import FormEvent
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import styles from "./changePassword.module.css";
import MainText from "../UIComponents/MainText";

function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/signIn");
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    // Specify the type of 'e' as FormEvent
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully! Redirecting to sign-in...");
      await supabase.auth.signOut();
      setTimeout(() => {
        router.push("/signIn");
      }, 2000);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.mainTextContainer}>
            <MainText />
          </div>
          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.emailContainer}>
                <label htmlFor="password" className={styles.emailLabel}>
                  New Password
                </label>
                <input
                  className={styles.input}
                  type="password"
                  name="password"
                  placeholder="Enter New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className={styles.emailContainer}>
                <label htmlFor="confirmPassword" className={styles.emailLabel}>
                  Confirm Password
                </label>
                <input
                  className={styles.input}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}
              {message && <p className={styles.success}>{message}</p>}

              <div className={styles.buttonContainer}>
                <button type="submit" className={styles.submitButton}>
                  Reset Password
                </button>
                <p className={styles.alreadyRegistered}>
                  Remembered your password?{" "}
                  <a className={styles.aInQuestion} href="/signIn">
                    Sign in here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
