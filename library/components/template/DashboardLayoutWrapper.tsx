"use client";

import { usePathname } from "next/navigation";
import React from "react";

import Header from "../organisms/Header";

const DashboardLayoutWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  // Check if the current pathname matches any of the path patterns
  // Define an array of path patterns
  // e.g /^\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/somewhere\/[a-zA-Z0-9_-]+$/
  const pathPatterns = [/^\/wallet+$/, /^\/redirect+$/];

  const isPathMatched = pathPatterns.some((pattern) => pattern.test(pathname));

  return (
    <>
      {isPathMatched ? (
        <>{children}</>
      ) : (
        <>
          <Header />
          {children}
        </>
      )}
    </>
  );
};

export default DashboardLayoutWrapper;
