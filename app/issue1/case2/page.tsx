'use client';

import React from 'react';
import AuthorCard from '../../minicomponents/AuthorCard';
import VideoCard from '../../minicomponents/VideoCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

function Page() {
  return (
    <div className="min-h-screen  custom text-[#007c82] px-6 py-16">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>


      {/* Hero Section */}
      <div className="md:max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-3xl  md:text-5xl font-light ">
          <button className="hover:bg-[#FCC27F] duration-200 text-[#000000] hover:text-black  text-4xl border-2 border-[#FCC27F] rounded-md ">
            <p className='px-4 font-light py-2'>
              Issue 1 - Case 2
            </p>
          </button>
          <h1 className="pt-4 text-[#FFF212] sm:mx-8 sm:text-[30px] text-[20px] font-light ">RECURRENT PREGNANCY LOSS: COMPREHENSIVE REVIEW OF NUTRITIONAL AND CLINICAL MANAGEMENT WITH EMPHASIS ON FOLATE SUPPLEMENTATION AND ULTRASOUND IMAGING OF CAUSES IN RPL
          </h1>
        </h1>
        <div className="mt-6">
          <Link
            href="/issue1"
            className='px-6 py-2 hover:bg-[#FCC27F] hover:text-black duration-300 scale-75 sm:scale-100 rounded-full border-2 border-[#FCC27F] text-[#000000] transition text-sm font-medium'
          >
            ← Back to Issue 1
          </Link>
        </div>
      </div>

      {/* Authors Section */}
      <section className="max-w-5xl mx-auto text-center mb-20">
        <div className='flex justify-center   items-center'>
          <h2 className=" text-[#FCC27F] text-2xl md:text-3xl font-semibold mb-10 border-b-1 py-2   text-center">Researchers & Contributors</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AuthorCard
              title="Dr. Seetha Ramamurthy Pal"
              qualification="DGO MD FRCOG FICOG RCOG/RCR, Diploma in Advanced Obstetric Ultrasound"
              experience="Senior Consultant Obstetrics and Fetal Medicine"
              department="Department of Obstetrics and Gynecology"
              hospital="Apollo Multispeciality Hospital"
              designation=""
              location="Kolkata, West Bengal, India"
              image="/author-images/seeta.png"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AuthorCard
              title="Dr. Poonam Goyal"
              qualification="MD FICOG FICMCH CIMP"
              experience="Head, Department of IVF and Infertility, Director and Head"
              department="Department of Obstetrics and Gynecology"
              hospital="Max Superspeciality Hospital Vaishali, Panchsheel Hospital"
              designation=""
              location="New Delhi, India"
              image="/author-images/poonam.png"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AuthorCard
              title="Dr. Jaideep Malhotra"
              qualification="MBBS MD FIAJAGO FICOG FICMCH FICS FMAS FICMU FRCPI FRCOG FICMP FICRM FIAPM"
              experience="President InSARG, South Asia Director IAN Donald School, Managing Director ART Rainbow IVF"
              department="Department of Obstetrics and Gynecology"
              hospital="SMRITI Manyata CSE, Global Rainbow Healthcare, MHMH (P) Ltd"
              designation="Past President FOGSI ISAR ASPIRE IMS AOGS SAFOMS ISPAT, Editor-in-Chief SAFOG and SAFOMS Journals, Past Vice Chairman ICOG, FIGO Committee Roles, Founder Club 35 Plus and Rotary Club Agra Grace"
              location="Agra, Uttar Pradesh, India"
              image="/author-images/jaydeep.png"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AuthorCard
              title="Dr. Osama Shawki"
              qualification="MD (Cairo University), Board member International Society Gynaecologic Endoscopy (ISGE)"
              experience="Director, Professor (Gynecology Surgery) and Consultant"
              department="Department of Obstetrics and Gynecology"
              hospital="Ebtesama Center for Advanced Endoscopic Surgery, H.A.R.T. (Hyteroscopy Academy for Research and Training), Cairo University School of Medicine"
              designation=""
              location="Cairo, Egypt"
              image="/author-images/osama.png"
            />
          </motion.div>


        </div>
      </section>

      {/* Video Section */}
      <section className="max-w-7xl mx-auto mb-20">
        <h2 className="text-2xl text-[#FCC27F] md:text-3xl font-semibold mb-10  text-center">Case Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <VideoCard
            videoSrc="/issue1case2assets/Video.mp4"
            title="Video 1"
            about=""
          />
          {/* <VideoCard
            videoSrc="/issue1case2assets/Video2.mp4"
            title="Video 2"
            about="OCT Video Loop 2 of RCA calcific nodule post-DCB angioplasty with adequate MLA and non-flow-limiting dissection"
          /> */}

        </div>
      </section>
    </div>
  );
}

export default Page;
