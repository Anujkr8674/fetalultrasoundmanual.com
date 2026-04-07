'use client';


import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';





function Hero({ onScrollClick }) {


  const words = [
    "Cardiology Casebook of IVUS/OCT with Videos",
  ];

  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentWord = words[wordIndex];

    if (charIndex <= currentWord.length) {
      const timeout = setTimeout(() => {
        setText(currentWord.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, wordIndex]);


  return (
    <section className="relative z-10 px-6 md:px-16 sm:py-24 sm:max-w-7xl sm:mx-auto py-10 overflow-hidden text-[#FFF212]">

      <div className='flex justify-center items-center flex-col gap-4'>
        <motion.h3
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className='uppercase sm:text-[52px]/15 text-[28px] font-bold text-center'
        >
          Cardiology Casebook of IVUS/OCT with Videos

        </motion.h3>


      </div>
      <div>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className='text-justify flex justify-center items-center flex-col text-[18px] text-[#fefefe] sm:mt-12 mt-6 opacity-90'
        >
          <button onClick={onScrollClick} className="hover:bg-[#FCC27F] duration-200 hover:text-white w-fit text-4xl border-2 border-[#FCC27F] rounded-md ">
            <p className=' text-black px-4 font-light py-2'>
              3 Issue Series
            </p>
          </button> <br />
          FOGSI Practical Fetal Ultrasound: Detecting Birth Defects (A Case-Based Manual) is a unique case-based video manual that brings together real clinical scenarios to demonstrate the pivotal role of ultrasound in modern obstetric care. Designed for practicing obstetricians, trainees, and fetal medicine specialists, this manual presents challenging high-risk pregnancy situations and illustrates how timely and accurate imaging can guide diagnosis, surveillance, and critical clinical decisions.
          <br /><br />
          Through carefully selected cases, expert commentary, and focused learning objectives, the manual covers key areas including first-trimester risk assessment, recurrent pregnancy loss, placental disorders, fetal growth restriction, hypertensive disorders, diabetes and obesity in pregnancy, multiple gestations, congenital anomalies, Doppler-based fetal surveillance, and emergency obstetric ultrasound. Each case report emphasizes practical interpretation of ultrasound findings and their translation into effective patient management.
        <br /> <br />
        This manual aims to help clinicians use ultrasound not merely as a diagnostic tool, but as an essential guide in managing complex and high-risk pregnancies to improve maternal and fetal outcomes.
        <br /><br />
       
          
          </motion.p>  </div>
           <p className='text-justify flex  flex-col text-[18px] text-[#fefefe]'>Educational Value of This Manual:</p>
        <br />
        <ul className='text-justify text-[18px] text-[#fefefe] list-disc'>
          <li>Case-based, clinically relevant learning.</li>
          <li>Emphasis on decision-making and pitfalls.</li>
          <li>Designed for practicing obstetricians, trainees, and sonologists.</li>
           <li>Suitable for video learning, newsletters, workshops, and CME programs.</li>
        </ul>



      {/* Doctor Section */}
      <div className='mt-12 border-2 shadow-2xl border-b-6 border-t-6 border-[#F4EFDF ] rounded-2xl sm:px-12 sm:py-8 py-4 flex sm:flex-row flex-col justify-center items-start'>

        {/* Image with motion from left */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className='text-[22px] text-black block sm:hidden ml-5 w-fit px-3 py-2 border-2 hover:bg-[#FCC27F] text-[#000000] duration-200 hover:text-black border-[#FCC27F ] rounded-full'>
            Editor of the Series
          </p>
          
          <img src="https://fetalultrasoundmanual.com/assets/editor-images/DrArun.png" alt="Dr. Arun Mohanty" className='sm:h-96 sm:w-96' />
        </motion.div>

        {/* Text content with motion from right */}
        <motion.div
          className='sm:w-1/2 sm:mt-[120px] mt-4 -ml-3 px-10'
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className='text-[22px] text-black hidden sm:block -ml-2 mb-2 w-fit px-3 py-2 border-2 hover:bg-[#FCC27F] text-[#000000] duration-200 hover:text-black border-[#FCC27F] rounded-full'>
            Editor of the Series
          </p>
          <h2 className='sm:text-[40px] text-[30px] font-semibold'>Dr. Arun Mohanty</h2>
          <p className='sm:text-[24px] text-[18px] sm:mb-8 mb-2 text-[#fefefe]'>
            Director, Intra Vascular Imaging <br />
            Department of Cardiology,<br />
            Sir Ganga Ram Hospital, <br /> New Delhi
          </p>
        </motion.div>

      </div>

    </section>
  );
}

export default Hero;

//  <p className='text-[18px] -ml-2 mb-2 w-fit px-3 py-2 border-2 border-[#F4EFDF ] rounded-full'>Editor of the Series</p>
//         <h2 className='text-[32px] font-semibold'>Dr. Arun Mohanty</h2>
//         <p className='text-[16px] sm:mb-8 mb-2 text-[#fefefe]'>Director, Intra Vascular Imaging <br />
// Department of Cardiology,<br />
// Sir Ganga Ram Hospital, New Delhi</p>
