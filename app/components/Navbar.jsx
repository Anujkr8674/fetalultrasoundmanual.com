"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

function Navbar({ forceShow = false }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/userapi/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!active) return;

        if (response.ok) {
          const data = await response.json();
          setUser(data?.user || null);
        } else {
          setUser(null);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    }

    if (forceShow || !(pathname?.startsWith("/user") || pathname?.startsWith("/admin"))) {
      loadSession();
    }

    return () => {
      active = false;
    };
  }, [pathname, forceShow]);

  if (!forceShow && (pathname?.startsWith("/user") || pathname?.startsWith("/admin"))) {
    return null;
  }

  return (
    <div className="border-b-6 border-#FFF212-900 p-4 text-yellow-500">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Link href="/">
          <img
            src="https://fetalultrasoundmanual.com/assets/logo.svg"
            alt="FOGSI logo"
            className="w-36"
          />
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[#FCC27F] p-4 text-sm font-[700] text-white duration-200 hover:scale-95 sm:text-lg"
          >
            FOGSI Practical Fetal Ultrasound: Detecting Birth Defects (A Case-Based Manual) with
            Videos
          </Link>

          {checkingSession ? (
            <span className="rounded-full border-2 border-[#FCC27F] px-5 py-3 text-sm font-[700] text-white/80">
              Checking session...
            </span>
          ) : user ? (
            <Link
              href="/user/dashboardoverview"
              className="rounded-full border-2 border-[#FCC27F]  px-5 py-3 text-sm font-[700] text-black transition duration-200 hover:scale-95 hover:bg-[#FCC27F] hover:text-[#000000]"
            >
              Dashboard
            </Link>
          ) : (
            <>
             <Link
  href="/user/login"
  className="rounded-full border-2 border-[#FCC27F] px-5 py-3 text-sm font-bold text-black transition duration-200 hover:scale-95 hover:bg-[#FCC27F] hover:text-white"
>
  Login
</Link>
              <Link
  href="/user/signup"
  className="rounded-full border-2 border-[#FCC27F] bg-[#FCC27F] px-5 py-3 text-sm font-bold text-white transition duration-200 hover:scale-95 hover:bg-white hover:text-[#000000]"
>
  Register
</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
