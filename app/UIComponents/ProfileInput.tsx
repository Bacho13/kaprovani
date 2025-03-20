"use client";
import React, { useEffect, useState } from "react";
import styles from "./UIStyles/ProfileInput.module.css";
import { supabase } from "../lib/supabaseClient";
import { checkSession, handleAuthStateChange } from "../Redux/lib/auth";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../Redux/store";
import { User, Phone, IdCard, VenusAndMars } from "lucide-react"; // Import Lucid Icons

type UserData = {
  full_name: string;
  phone: string;
  gender: string;
  document_type: string;
  document_id: string;
};

type ProfileInputProps = {
  userData: UserData;
};

const ProfileInput: React.FC<ProfileInputProps> = ({ userData }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserData>(userData);
  const [email, setEmail] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector((state) => state.auth.user);
  const [initialFormData, setInitialFormData] = useState<UserData>(userData); // New state for initial data

  // Fetch user details from Supabase
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from("user_details")
            .select("full_name, phone, gender, document_type, document_id")
            .eq("user_id", user.id)
            .single();

          if (!error && data) {
            setFormData(data);
            setInitialFormData(data); // Set initial data when fetching
          } else {
            setInitialFormData(userData); // Set default data if no data is fetched
            setFormData(userData);
          }
          console.log(data);
        } catch (error) {
          console.error("Error fetching user details:", error);
          setInitialFormData(userData); // Set default data on error
          setFormData(userData);
        }
      }
    };

    const fetchUserEmail = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setEmail(data.user.email || "undefined");
      }
    };

    fetchUserDetails();
    fetchUserEmail();
  }, [user?.id, userData]); //userData added to dependency array

  const handleChange = (key: keyof UserData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = async () => {
    if (isEditing) {
      try {
        // Use initial values if not changed
        const dataToSave = {
          ...formData,
          gender: formData.gender || initialFormData.gender || "Male", // Default to "Male" if not set
          document_type:
            formData.document_type ||
            initialFormData.document_type ||
            "National ID", // Default to "National ID" if not set
          email: user?.email,
          user_id: user?.id,
        };

        const { error } = await supabase
          .from("user_details")
          .upsert([dataToSave], { onConflict: "user_id" });

        if (error) {
          console.error("Error saving data:", error);
        } else {
          console.log("Data saved successfully");
          setInitialFormData(dataToSave); // Update initial data after successful save
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    checkSession();
    handleAuthStateChange();
  }, [dispatch]);

  const getIcon = (key: string) => {
    switch (key) {
      case "full_name":
        return <User size={15} style={{ marginRight: "15px" }} />;
      case "phone":
        return <Phone size={15} style={{ marginRight: "15px" }} />;
      case "document_id":
        return <IdCard size={15} style={{ marginRight: "15px" }} />;
      case "gender":
        return <VenusAndMars size={15} style={{ marginRight: "15px" }} />;
      case "document_type":
        return <IdCard size={15} style={{ marginRight: "15px" }} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input type="text" value={email} disabled className={styles.input} />
        </div>

        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className={styles.inputGroup}>
            <label className={styles.label}>
              {getIcon(key)} {key.replace("_", " ")}
            </label>
            {key === "gender" || key === "document_type" ? (
              <select
                value={value as string}
                disabled={!isEditing}
                onChange={(e) =>
                  handleChange(key as keyof UserData, e.target.value)
                }
                className={styles.input}
              >
                {key === "gender" ? (
                  <>
                    <option value="Male" style={{ backgroundColor: "#05414f" }}>
                      Male
                    </option>
                    <option
                      value="Female"
                      style={{ backgroundColor: "#05414f" }}
                    >
                      Female
                    </option>
                  </>
                ) : (
                  <>
                    <option
                      value="National ID"
                      style={{ backgroundColor: "#05414f" }}
                    >
                      National ID
                    </option>
                    <option
                      value="Passport"
                      style={{ backgroundColor: "#05414f" }}
                    >
                      Passport
                    </option>
                  </>
                )}
              </select>
            ) : (
              <input
                type="text"
                value={value as string}
                disabled={!isEditing}
                onChange={(e) =>
                  handleChange(key as keyof UserData, e.target.value)
                }
                className={styles.input}
              />
            )}
          </div>
        ))}

        <button onClick={handleSave} className={styles.button}>
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default ProfileInput;
