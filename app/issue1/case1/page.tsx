'use client';

import React from 'react';
import AuthorCard from '../../minicomponents/AuthorCard';
import VideoCard from '../../minicomponents/VideoCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

function Page() {
  return (
    <div className="min-h-screen custom text-[#007c82] px-6 py-16">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>


      {/* Hero Section */}
      <div className="md:max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-3xl  md:text-5xl font-light ">
          <button className="hover:bg-[#FCC27F] duration-200 text-[#000000] hover:text-black  text-4xl border-2 border-[#FCC27F] rounded-md ">
            <p className='px-4 font-light py-2'>
              Issue 1 - Case 1
            </p>
          </button>
          <h1 className="pt-4 text-[#FFF212] sm:mx-8 sm:text-[30px] text-[20px] font-light ">PREVENTION OF NEURAL TUBE DEFECTS BY ROUTINE PERICONCEPTIONAL FOLIC ACID SUPPLEMENTATION: COMMENTARY ON A CASE REPORT
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
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AuthorCard
              title="Dr. Kuldeep Singh"
              qualification="MBBS FICMCH FICMU FAUI"
              experience="Consultant"
              department="Department of Ultrasound"
              hospital="Dr Kuldeep's Ultrasound and Color Doppler Clinic"
              designation=""
              location="New Delhi, India"
              
              image="https://fetalultrasoundmanual.com/assets/author-images/Kuldeep.png"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AuthorCard
              title="Dr. Karunakar Marikinti"
              qualification="MD MNAMS (AIIMS-Delhi) CCST FRCOG (UK) MSc (Spain)"
              experience="Consultant Reproductive Endocrinologist Gynecologist and Obstetrician"
              department="Department of Obstetrics and Gynecology"
              hospital="WOW London"
              designation=""
              location="Cambridge, United Kingdom"
              image="https://fetalultrasoundmanual.com/assets/author-images/Karunakar.png"
            />
          </motion.div>
           <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AuthorCard
              title="Dr. Neharika Malhotra"
              qualification="MBBS MD (Gold Medalist) DRM (Germany) DMIS FICMCH FMAS FICOG, ICOG Fellowship in Reproductive Medicine DGC"
              experience="Managing Director and Consultant ObGyn and Infertility"
              department="Department of Obstetrics and Gynecology and Infertility"
              hospital="ART Rainbow IVF, Ujala Cygnus Rainbow Hospital and Malhotra Nursing and Maternity Home"
              designation="Assistant Editor Journal of IJHRRD"
              location="Agra, Uttar Pradesh, India"
              image="https://fetalultrasoundmanual.com/assets/author-images/Neha.png"
            />
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="max-w-7xl mx-auto mb-20">
        <div className='flex justify-center   items-center'>
          <h2 className=" text-[#FCC27F] text-2xl md:text-3xl font-semibold mb-10 border-b-1 py-2   text-center">Case Videos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <VideoCard
            videoSrc="/issue1case1assets/is1cs1v.mp4"
            title="Video 1"
            about=""
          />


        </div>
      </section>
    </div>
  );
}

export default Page;
