import { Metadata } from "next";

import LayoutWrapper from "@/components/template/LayoutWrapper";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://escroguard.vercel.app/"),
  title: "Escrøguard",
  icons: "/favicon.ico",
  description:
    "Escrøguard is an open-source escrow service to take full control of your trades.",
  openGraph: {
    images: "", //TODO:
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
