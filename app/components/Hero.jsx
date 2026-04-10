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
          FOGSI Practical Fetal Ultrasound: Detecting Birth Defects (A Case-Based Manual) with Videos

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
          <button onClick={onScrollClick} className="hover:bg-[#d5a062] duration-200 hover:text-white w-fit text-4xl border-2 border-[#d5a062] rounded-md">
            <p className=' px-4 font-light py-2 text-black hover:text-white'>
              5 Issue Series
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
      <div className='mt-12 border-2 shadow-2xl border-b-6 border-t-6 border-[#FFF212] rounded-2xl sm:px-8 px-4 sm:py-10 py-6'>
        <motion.h2
          className='text-center sm:text-[42px] text-[30px] font-semibold mb-8'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Editor of the Series */}
          <button onClick={onScrollClick} className="hover:bg-[#d5a062] duration-200 hover:text-white w-fit text-4xl border-2 border-[#d5a062] rounded-md">
            <p className=' px-4 font-light py-2 text-black hover:text-white'>
              Editor of the Series
            </p>
          </button>
        </motion.h2>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <motion.div
            className='bg-[#d5a062] rounded-lg px-6 py-7 text-white shadow-xl flex flex-col items-center'
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img
              src="https://fetalultrasoundmanual.com/assets/editor-images/Bhaskar%20Pal.png"
              alt="Doctor One"
              className='h-56 w-56 object-cover object-top rounded-md border-2 border-white bg-white'
            />

            <div className='mt-7 w-full'>
              <h3 className='sm:text-[28px] text-[24px] font-semibold text-[#FFF212]'>
                Dr. Bhaskar Pal
              </h3>
              <p className='mt-4 sm:text-[20px] text-[18px] leading-relaxed text-[#fefefe]'>
                President, FOGSI (2026) <br />
                Chairperson Endoscopy Committee of SAFOG <br />
                Senior Consultant <br />
                Department of Obstetrics and Gynecology <br />
                Apollo Multispeciality Hospital <br />
                Kolkata, West Bengal, India
              </p>
            </div>
          </motion.div>

          <motion.div
            className='bg-[#d5a062] rounded-lg px-6 py-7 text-white shadow-xl flex flex-col items-center'
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <img
              src="https://fetalultrasoundmanual.com/assets/editor-images/Suvarna Satish Khadilkar.png"
              alt="Doctor Two"
              className='h-56 w-56 object-cover object-top rounded-md border-2 border-white bg-white'
            />

            <div className='mt-7 w-full'>
              <h3 className='sm:text-[28px] text-[24px] font-semibold text-[#FFF212]'>
                Dr. Suvarna Satish Khadilkar
              </h3>
              <p className='mt-4 sm:text-[20px] text-[18px] leading-relaxed text-[#fefefe]'>
                Secretary-General, FOGSI <br />
                Editor Emeritus, JOGI <br />
                Chairperson, FIGO Committee on Women at Menopausal Age (Tenure 2023–2027) <br />
                Deputy Editor-in-Chief (IJGO) <br />
                Consultant Endocrinologist and Gynecologist <br />
                Bombay Hospital & Medical Research Centre <br />
                Mumbai, Maharashtra, India
              </p>
            </div>
          </motion.div>

          <motion.div
            className='bg-[#d5a062] rounded-lg px-6 py-7 text-white shadow-xl flex flex-col items-center'
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <img
              src="https://fetalultrasoundmanual.com/assets/editor-images/Narendra Malhotra.png"
              alt="Doctor Three"
              className='h-56 w-56 object-cover object-top rounded-md border-2 border-white bg-white'
            />

            <div className='mt-7 w-full'>
              <h3 className='sm:text-[28px] text-[24px] font-semibold text-[#FFF212]'>
                Prof. (Dr.) Narendra Malhotra
              </h3>
              <p className='mt-4 sm:text-[20px] text-[18px] leading-relaxed text-[#fefefe]'>
                Managing Director <br />
                Global Rainbow Healthcare, Ujala Cygnus Rainbow Hospital <br />
                Director <br />
                ART Rainbow IVF <br />
                Agra, Uttar Pradesh, India
              </p>
            </div>
          </motion.div>
        </div>
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
