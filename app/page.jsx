'use client';
import { useRef } from 'react';
import Hero from "./components/Hero";
import IssueSection from "./components/IssueSection";

export default function Home() {

  const issueRef = useRef(null);

  const scrollToIssue = () => {
    issueRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="relative text-[FCC27F] overflow-hidden">
   
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
