"use client";

import React, { useState, FormEvent } from "react";
import { z } from "zod";
import styles from "./register.module.css";
import MainText from "../UIComponents/MainText";
import { supabase } from "../lib/supabaseClient"; // Import supabase client
import { handleSignInViaGoogle } from "../Redux/lib/auth";
import { useRouter } from "next/navigation"; // Correct import
import Link from "next/link"; // Import Link

// Zod validation schema
const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(5, "Password must be at least 5 characters long"),
    confirmPassword: z
      .string()
      .min(5, "Password must be at least 5 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form data using Zod
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      // If validation fails, set error message
      setError(result.error.errors[0].message);
      return;
    }

    // Clear errors if validation passes
    setError("");

    // Register the user with Supabase
    const { email, password } = formData;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message); // Show error message if registration fails
    } else {
      setSuccessMessage(
        "Registration successful! Please check your email for a confirmation link."
      );
    }
  };

  const handleSignUpViaGoogle = async () => {
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
              <div className={styles.confirmPasswordContainer}>
                <label
                  htmlFor="ConfirmPassword"
                  className={styles.confirmPasswordLabel}
                >
                  Confirm Password
                </label>
                <input
                  className={styles.input}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}
              {successMessage && (
                <p className={styles.success}>{successMessage}</p>
              )}

              <div className={styles.buttonContainer}>
                <button type="submit" className={styles.registerButton}>
                  Register
                </button>
                <p className={styles.orRegisterViaGoogle}>
                  OR REGISTER VIA GOOGLE
                </p>
                <button
                  type="button"
                  className={styles.GoogleRegisterButton}
                  onClick={handleSignUpViaGoogle}
                >
                  G Register
                </button>
                <p className={styles.alreadyRegistered}>
                  Are you already registered?{" "}
                  <Link className={styles.aInQuestion} href="/signIn">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
