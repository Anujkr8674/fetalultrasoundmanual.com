'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import CaseStudyCard from '../minicomponents/caseStudyCard';

function AnimatedCase({ imgSrc, title, description, href, caseNo, reverse }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const containerClasses = `flex flex-col sm:h-72 h-full ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-6`;

  return (
    <div ref={ref} className={containerClasses}>
      {/* Image */}
      <motion.img
        src={imgSrc}
        alt={`Case ${caseNo}`}
        className="w-full h-full object-cover md:w-1/2 rounded shadow-md"
        initial={{ x: reverse ? 100 : -100, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {/* Card */}
      <motion.div
        className=" flex sm:w-1/2 justify-center"
        initial={{ x: reverse ? -100 : 100, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className=" w-full">
          <CaseStudyCard
            title={title}
            description={description}
            href={href}
            caseNo={caseNo}
          />
        </div>
      </motion.div>
    </div>
  );
}

function Page() {
  const issueTitle = 'Issue 1';

  return (
    <div className="min-h-screen custom text-[#007c82] px-6 py-20">
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
        
          imgSrc="https://fetalultrasoundmanual.com/assets/issue-images/issue1cs1.png"
          title="PREVENTION OF NEURAL TUBE DEFECTS BY ROUTINE PERICONCEPTIONAL FOLIC ACID SUPPLEMENTATION: COMMENTARY ON A CASE REPORT"
          description=""
          href="/issue1/case1"
          caseNo={1}
          reverse={false}
        />
        <AnimatedCase
          imgSrc="https://fetalultrasoundmanual.com/assets/issue-images/issue1cs2.png"
          title="RECURRENT PREGNANCY LOSS: COMPREHENSIVE REVIEW OF NUTRITIONAL AND CLINICAL MANAGEMENT WITH EMPHASIS ON FOLATE SUPPLEMENTATION AND ULTRASOUND IMAGING OF CAUSES IN RPL"
          description=""
          href="/issue1/case2"
          caseNo={2}
          reverse={true}
        />
        
      </div>
    </div>
  );
}

export default Page;
