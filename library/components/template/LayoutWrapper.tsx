"use client";

import { Inter } from "next/font/google";

import RootProvider from "@/providers";
import { cn } from "@/utils";

const inter = Inter({ subsets: ["latin"], preload: true });

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <RootProvider>
          <main className="flex flex-col gap-2 w-screen relative h-screen">
            {children}
          </main>
        </RootProvider>
      </body>
    </html>
  );
};

export default LayoutWrapper;
