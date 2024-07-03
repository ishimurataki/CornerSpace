import ConfigureAmplifyClientSide from "@/components/configure-amplify";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cubit",
  description: "Online voxel-art platform",
};

export default function RootLayout({
  view,
  children,
}: Readonly<{
  view: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigureAmplifyClientSide />
        {view}
        {children}
      </body>
    </html>
  );
}
