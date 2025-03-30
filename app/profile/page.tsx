"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./profile.module.css";
import ProfileInput from "../UIComponents/ProfileInput";
import Image from "next/image";
import { useAppSelector } from "../Redux/store";
import { checkSession, handleAuthStateChange } from "../Redux/lib/auth";
import { useDispatch } from "react-redux";
import { supabase } from "../lib/supabaseClient";

function Page() {
  const [photos, setPhotos] = useState([]);
  const user = useAppSelector((state) => state.auth.user);
  const defaultUserData = {
    full_name: "",
    phone: "",
    gender: "",
    document_type: "",
    document_id: "",
  };
  const [avatarUrl, setAvatarUrl] = useState<string>("/images/noImage.png");
  const [avatarVersion, setAvatarVersion] = useState<number>(0); // New state for cache busting
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // New loading state

  useEffect(() => {
    checkSession();
    handleAuthStateChange();
  }, [dispatch]);

  useEffect(() => {
    const fetchAvatar = async () => {
      setIsLoading(true); // Start loading
      if (user?.id) {
        const imageUrl = supabase.storage
          .from("avatars")
          .getPublicUrl(`${user.id}.png`).data?.publicUrl;

        if (imageUrl) {
          try {
            const response = await fetch(`${imageUrl}?v=${avatarVersion}`); // Add cache-busting query parameter
            if (response.ok) {
              setAvatarUrl(imageUrl);
            } else {
              setAvatarUrl("/images/noImage.png");
            }
          } catch (error) {
            console.error("Error checking image URL:", error);
            setAvatarUrl("/images/noImage.png");
          }
        } else {
          setAvatarUrl("/images/noImage.png");
        }
      } else {
        setAvatarUrl("/images/noImage.png");
      }
      setIsLoading(false); // Stop loading
    };

    fetchAvatar();
  }, [user?.id, avatarVersion]); // Add avatarVersion to the dependency array

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true); // Start loading
      const { error } = await supabase.storage
        .from("avatars")
        .upload(`${user?.id}.png`, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("Error uploading image:", error);
      } else {
        // Update the avatarVersion to trigger a re-fetch
        setAvatarVersion((prevVersion) => prevVersion + 1);
        //setAvatarUrl(data.publicUrl); // Remove this line
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      ) : (
        <div className={styles.mainContainer}>
          <div className={styles.leftContainer}>
            <div
              className={styles.imageContainer}
              onClick={handleImageClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Image
                src={`${avatarUrl}?v=${avatarVersion}`} // Add cache-busting query parameter here too
                width={200}
                height={150}
                alt="user pic"
                style={{ objectFit: "cover" }}
                priority
              />
              {isHovered && (
                <div className={styles.imageOverlay}>
                  <span className={styles.overlayText}>UPDATE PHOTO</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageUpload}
              accept="image/*"
            />
            <ProfileInput userData={defaultUserData} />
          </div>
          <div className={styles.rightContainer}></div>
        </div>
      )}
    </div>
  );
}

export default Page;
