"use-client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  id: string | null;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  full_name: string | null;
};

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  avatar_url: null,
  full_name: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return action.payload;
    },
    clearUser: () => initialState, // Reset user state
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
