"use client";

import React, { useState } from "react";
import { z } from "zod";
import styles from "./signIn.module.css";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { handleSignIn, handleSignInViaGoogle } from "../Redux/lib/auth";
import MainText from "../UIComponents/MainText";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(5, "Password must be at least 5 characters long"),
});

type FormData = {
  email: string;
  password: string;
};

function SignIn() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = signInSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    setError("");
    const { email, password } = formData;
    const { error: signInError } = await handleSignIn(email, password); // Use handleSignIn

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      router.push("/");
    }
  };

  const handleLogInViaGoogle = async () => {
    let { data, error } = await handleSignInViaGoogle();
    router.push("/"); // Redirect after login
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
                <label htmlFor="Email" className={styles.emailLabel}>
                  Email
                </label>
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.passwordContainer}>
                <label htmlFor="Password" className={styles.passwordLabel}>
                  Password
                </label>
                <input
                  className={styles.input}
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <div className={styles.buttonContainer}>
                <button
                  type="submit"
                  className={styles.registerButton}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "SIGN IN"}
                </button>
                <p className={styles.orRegisterViaGoogle}>
                  OR SIGN IN VIA GOOGLE
                </p>
                <button
                  type="button"
                  className={styles.GoogleRegisterButton}
                  onClick={handleLogInViaGoogle}
                >
                  G-SIGN IN
                </button>
                <p className={styles.alreadyRegistered}>
                  NEED TO REGISTRATE?{" "}
                  <a className={styles.aInQuestion} href="/register">
                    THEN REGISTER HERE
                  </a>
                </p>
                <p className={styles.alreadyRegistered}>
                  FORGOT PASSWORD?{" "}
                  <a className={styles.aInQuestion} href="/requestPassCange">
                    UPDATE IT HERE
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

export default SignIn;
