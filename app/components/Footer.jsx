"use client";

import React from "react";
import { usePathname } from "next/navigation";

function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/user") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="flex justify-center bg-[#FCC27F] py-2 text-white">
      (c) 2026-2027 All Right, Reserved.
    </div>
  );
}

export default Footer;
