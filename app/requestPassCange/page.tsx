"use client";

import React, { useState, ChangeEvent, FormEvent } from "react"; // Import ChangeEvent and FormEvent
import styles from "./requestPassChange.module.css";
import MainText from "../UIComponents/MainText";
import { supabase } from "../lib/supabaseClient";

function RequestPasswordReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Specify the type of 'e' as ChangeEvent<HTMLInputElement>
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    // Specify the type of 'e' as FormEvent
    e.preventDefault();
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset email sent. Check your inbox.");
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
                <label htmlFor="email" className={styles.emailLabel}>
                  Email
                </label>
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}
              {message && <p className={styles.success}>{message}</p>}

              <div className={styles.buttonContainer}>
                <button type="submit" className={styles.submitButton}>
                  Send Reset Email
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

export default RequestPasswordReset;
