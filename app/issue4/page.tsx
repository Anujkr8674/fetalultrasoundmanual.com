'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import CaseStudyCard from '../minicomponents/caseStudyCard';
import QuickAuthGateModal from "../components/QuickAuthGateModal";

function AnimatedCase({ imgSrc, title, description, href, caseNo, reverse, customHeight }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    const containerClasses = `flex flex-col ${customHeight || 'sm:h-72 h-full'} ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-stretch gap-6`;

    return (
        <div ref={ref} className={containerClasses}>
            {/* Image */}
            <motion.div
                className="w-full md:w-1/2 flex flex-col"
                initial={{ x: reverse ? 100 : -100, opacity: 0 }}
                animate={inView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <img
                    src={imgSrc}
                    alt={`Case ${caseNo}`}
                    className="w-full h-full flex-grow object-cover rounded shadow-md bg-gray-200"
                />
            </motion.div>

            {/* Card */}
            <motion.div
                className="w-full md:w-1/2 flex flex-col"
                initial={{ x: reverse ? -100 : 100, opacity: 0 }}
                animate={inView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <CaseStudyCard
                    title={title}
                    description={description}
                    href={href}
                    caseNo={caseNo}
                    customHeight={customHeight}
                />
            </motion.div>
        </div>
    );
}

function Page() {
    const issueTitle = 'Issue 4';
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

    return (
        <div className="min-h-screen custom text-[#007c82] px-6 py-20">
            <QuickAuthGateModal
                open={showGate && authStatus !== "checking"}
                onClose={() => setShowGate(false)}
                onGuestContinue={() => setShowGate(false)}
                onAuthenticated={() => {
                    setAuthStatus("authenticated");
                    setShowGate(false);
                }}
            />
            {/* Background pattern */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>

            {/* Header */}
            <div className="max-w-7xl mx-auto flex md:flex-row justify-between items-center gap-8 mb-16">
                <button className="hover:bg-[#d5a062] duration-200 hover:text-black text-[#000000] sm:text-4xl text-2xl border-2 border-[#d5a062] rounded-md">
                    <p className="px-4 font-light py-2 text-black hover:text-white">{issueTitle}</p>
                </button>

                <Link
                    href="/"
                    className="px-6 py-2 hover:bg-[#d5a062] hover:text-black duration-300 scale-75 sm:scale-100 rounded-full border-2 border-[#d5a062] text-[#000000] transition text-sm font-medium text-black hover:text-white"
                >
                    ← Back to Home
                </Link>
            </div>

            {/* Cases */}
            <div className="space-y-10 max-w-7xl mx-auto">
                <AnimatedCase
                    imgSrc="https://fetalultrasoundmanual.com/assets/issue4-assets/Picture1.png"
                    title=": ULTRASOUND DIAGNOSIS OF TWIN PREGNANCY: IDENTIFICATION OF HIGH-RISK SITUATIONS, INDIVIDUALIZED MANAGEMENT AND THE CRITICAL ROLE OF MATERNAL NUTRITION"
                    description=""
                    href="/issue4/case1"
                    caseNo={1}
                    reverse={false}
                    customHeight="sm:min-h-[24rem] h-auto"
                />
                <AnimatedCase
                    imgSrc="https://fetalultrasoundmanual.com/assets/issue4-assets/Picture2.png"
                    title="FOLIC ACID DEFICIENCY AS A PREVENTABLE CAUSE OF CONGENITAL ANOMALIES: IMPORTANCE OF NUTRITIONAL SUPPLEMENTATION AND PRECONCEPTION CARE "
                    description=""
                    href="/issue4/case2"
                    caseNo={2}
                    reverse={true}
                    customHeight="sm:min-h-[24rem] h-auto"
                />
            </div>
        </div>
    );
}

export default Page;
