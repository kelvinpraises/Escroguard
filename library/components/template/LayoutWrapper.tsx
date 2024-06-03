"use client";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";

import Header from "@/components/organisms/Header";
import RootProvider from "@/providers";
import { cn } from "@/utils";

const inter = Inter({ subsets: ["latin"], preload: true });

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Check if the current pathname matches any of the path patterns
  // Define an array of path patterns
  // e.g /^\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/somewhere\/[a-zA-Z0-9_-]+$/
  const pathPatterns = [/^\/+$/];

  const isPathMatched = pathPatterns.some((pattern) => pattern.test(pathname));

  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <RootProvider>
          {isPathMatched ? (
            <main className="flex flex-col gap-2 w-screen relative h-screen">
              {children}
            </main>
          ) : (
            <main className="flex flex-col gap-2 w-screen relative h-screen">
              <Header />
              {children}
            </main>
          )}
        </RootProvider>
      </body>
    </html>
  );
};

export default LayoutWrapper;
