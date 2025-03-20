// lib/auth.ts
"use client";
import { supabase } from "../../lib/supabaseClient";
import { setUser, clearUser } from "../authSlice";
import { store } from "../store";
import { User } from "@supabase/supabase-js";

export const handleSignIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (data?.user) {
    store.dispatch(setUser(data.user));
  }
  return { data, error };
};

export const handleSignInViaGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  return { data, error };
};

export const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    store.dispatch(clearUser());
  }
  return { error };
};

export const handleAuthStateChange = () => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      store.dispatch(setUser(session.user));
    } else {
      store.dispatch(clearUser());
    }
  });
};

export const checkSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.user) {
    store.dispatch(setUser(session.user));
  } else {
    store.dispatch(clearUser());
  }
};
