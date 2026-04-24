'use client';
import { useEffect, useRef, useState } from 'react';
import Hero from "./components/Hero";
import IssueSection from "./components/IssueSection";
import QuickAuthGateModal from "./components/QuickAuthGateModal";

export default function Home() {

  const issueRef = useRef(null);
  const [authStatus, setAuthStatus] = useState("checking");
  const [showGate, setShowGate] = useState(false);

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
          setAuthStatus("authenticated");
          setShowGate(false);
        } else {
          setAuthStatus("guest");
          setShowGate(true);
        }
      } catch {
        if (active) {
          setAuthStatus("guest");
          setShowGate(true);
        }
      }
    }

    loadSession();
    return () => {
      active = false;
    };
  }, []);

  const scrollToIssue = () => {
    issueRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="relative text-[FCC27F] overflow-hidden">
      <QuickAuthGateModal
        open={showGate && authStatus !== "checking"}
        onClose={() => setShowGate(false)}
        onGuestContinue={() => setShowGate(false)}
        onAuthenticated={() => {
          setAuthStatus("authenticated");
          setShowGate(false);
        }}
      />
   
      <div className="relative custom   min-h-screen    ">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
        <Hero onScrollClick={scrollToIssue} />
           <div ref={issueRef}>
        <IssueSection />
      </div>
      </div>
    </div>
  );
}
