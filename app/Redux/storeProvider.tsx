"use client";

import { Montserrat } from "next/font/google";
import { store } from "./store";
import { Provider } from "react-redux";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
