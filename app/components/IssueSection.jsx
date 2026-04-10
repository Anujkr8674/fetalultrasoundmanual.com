"use client"

import React from 'react';
import IssueCard from '../minicomponents/IssueCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

const issues = [
  {
    coverImg:
      ' https://fetalultrasoundmanual.com/assets/casebook-images/Fogsi Practical Fetal ultrasound Detecting Birth Defects MOCKUP.jpg',
    issueNo: 1,
    linkUrl: './issue1',
  },
  // {
  //   coverImg:
  //     ' https://fetalultrasoundmanual.com/assets/casebook-images/casebook2.png',
  //   issueNo: 2,
  //   linkUrl: './issue2',
  // },
  // {
  //   coverImg:
  //     ' https://fetalultrasoundmanual.com/assets/casebook-images/casebook3.png',
  //   issueNo: 3,
  //   linkUrl: './issue3',
  // },
   
];

function IssueSection() {
  return (
    <section className="relative pb-24 px-6 md:px-20 text-white overflow-hidden">
    
      <div className="max-w-7xl mx-auto text-center ">
        <h2 className="text-[32px] mb-8 sm:mb-0 py-4 border-b-1 w-fit text-center mx-auto font-light uppercase  tracking-tight text-[#FFF212] drop-shadow-md">
          Explore the Issues
        </h2>
        
      </div>

      <div className="flex md:flex-row  flex-col justify-center items-center   md:gap-10">
        {issues.map((issue, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <IssueCard
              coverImg={issue.coverImg}
              issueNo={issue.issueNo}
              linkUrl={issue.linkUrl}
            />
          </motion.div>
        ))}
      </div>
      {/* <div className="book  p-2 gap-2 flex justify-center items-center flex-col">
       <div className="p-5    text-white  flex justify-center items-center flex-col relative ">
        <img src="DrArun.png" className='w-full h-1/2 object-cover -p-5' alt="" />
        <h2 className="text-xl font-bold mb-3 tracking-tight">
          Issue <span className="text-[#00b6c5]">{'1'}</span>
        </h2>
        <Link
          href={'linkUrl'}
          className="inline-block mt-2 px-5 py-2 rounded-md border border-[#007e82] bg-[#133842]/30 text-sm font-semibold hover:bg-[#00b6c5] hover:text-[#0b1d24] transition-all duration-300"
        >
          Explore Case Studies →
        </Link>
      </div>
    <div className="cover flex  flex-col gap-5">
       
        <div class="loading">
  <svg width="80px" height="48px">
      <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back"></polyline>
    <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front"></polyline>
  </svg>
</div>
 <p>Issue 1</p>
    </div>
   </div> */}
    </section>
  );
}

export default IssueSection;
