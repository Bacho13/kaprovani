import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";

import "./globals.css";
import { StoreProvider } from "./Redux/storeProvider";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700"], // Add the weights you need
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "KAPROVANI COTTAGES",
  description: "COTAAGES IN KAPROVANI (SAKARTVELO)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cinzel.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
