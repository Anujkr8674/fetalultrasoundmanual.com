'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';


function IssueCard({ coverImg, issueNo, linkUrl }) {
  return (
    //     <motion.div
    //       initial={{ opacity: 0, y: 30 }}
    //       whileInView={{ opacity: 1, y: 0 }}
    //       whileHover={{ scale: 1.02 }}
    //       viewport={{ once: true }}
    //       transition={{ duration: 0.6, ease: 'easeOut' }}
    //       className="group z-10 p-4 rounded-sm relative w-full max-w-[420px] mx-auto bg-[#0b1d24] text-white   overflow-hidden border border-[#00b6c5] border-b-8 border-r-8 border-t-0   shadow-2xl"
    //     >
    //       {/* Abstract Border Accent */}
    //       <div className="absolute -top-3 -left-3 w-20 h-20 rounded-br-[2rem] bg-[#007e82]/50 blur-sm z-0" />
    //       <div className="absolute -bottom-4 -right-4 w-24 h-24   bg-[#6d6e71]/50 blur-lg z-0" />

    //       {/* Image Section */}
    //       <div className="relative z-10">
    //         <img
    //           src={coverImg}
    //           alt={`Issue ${issueNo}`}
    //           className="w-full  object-cover   border-b border-[#007e82]/40"
    //         />
    //       </div>

    //       {/* Content */}
    //       <div className="p-5 flex flex-col justify-center items-center relative ">
    //         <h2 className="text-xl font-bold mb-3 tracking-tight">
    //           Issue <span className="text-[#00b6c5]">{issueNo}</span>
    //         </h2>
    //         <Link
    //           href={linkUrl}
    //           className="flex z-50 gap-4 justify-center items-center mt-2 px-5 py-2 rounded-md border border-[#007e82] bg-[#133842]/30 text-sm font-semibold hover:bg-[#00b6c5] hover:text-[#0b1d24] transition-all duration-300"
    //         >
    //           Explore Case Studies  <div class="loading">
    //   <svg width="80px" height="48px">
    //       <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back"></polyline>
    //     <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front"></polyline>
    //   </svg>
    // </div>
    //         </Link>
    //       </div>

    //       {/* Decorative Glow Ring (Hover) */}
    //       <div className="absolute inset-0 z-0 group-hover:scale-110 transition-transform duration-500 ease-out blur-[4px] opacity-20 rounded-[1.5rem] bg-gradient-to-br from-[#00b6c5] via-[#007e82] to-[#6d6e71]" />
    //     </motion.div>
    <>
      <div className="relative w-full   mx-auto">
        <div className="e-card playing   relative z-10 text-[#fefefe] bg-white border-t-10 border-b-10 border-[#FFF212]   p-6 rounded-lg overflow-hidden">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className='absolute flex flex-col left-20  justify-center items-center bottom-2'>

            <h1 className='text-black text-xl mb-4  '>Issue <span className='text-[#007c82]'>{issueNo}</span> </h1>
           

            
            <Link className='text-[18px] text-black -ml-2 mb-2 w-fit px-3 py-2 border-2 border-[#FCC27F] hover:bg-[#FCC27F] hover:text-black  duration-300 rounded-full' href={linkUrl}>Explore Case Studies</Link>
          </div>
        </div>

        {/* Image */}
        <Link href={linkUrl}>
          <img
            src={coverImg}
            alt=""
            className="absolute -top-16 left-1/2 -translate-x-1/2 hover:scale-110 duration-200 z-20"
          />
        </Link>


      </div>
    </>
  );
}

export default IssueCard;
