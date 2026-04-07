'use client'

import React from 'react';
import Link from 'next/link';

function CaseStudyCard({ title, description, href, caseNo }) {
  return (
    <Link
      href={href}
      className="relative backdrop-blur-md text-white hover:text-[#007c82] bg-[#007c82] hover:bg-white border-2 border-[#007c82]/90 rounded-md p-6 sm:h-72 h-full w-full overflow-hidden group hover:scale-[1.03] transition-transform duration-300 block"
    >
      {/* Main Content */}
      <div className="relative z-10">
        <div className="text-xl tracking-wider font-light border-b-1 py-2 w-full mb-2">
          Case No. {caseNo}
        </div>

        <h2 className="text-xl font my-6 leading-snug">
          {title}
        </h2>

        <h2 className="mb-6 pr-8">
          {description}
        </h2>

        <span className="inline-block px-6 py-3 font-medium border-2 border-[#007c82] bg-white hover:bg-[#007c82] text-[#007c82] backdrop-blur hover:text-[#fff] transition">
          View Now
        </span>
      </div>
    </Link>
  );
}

export default CaseStudyCard;
