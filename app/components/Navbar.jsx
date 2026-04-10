import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <div className=' p-4   border-b-6 border-#FFF212-900  
     text-yellow-500'>
      <div className='flex flex-col  gap-4 sm:flex-row justify-between items-center'>
        <Link href={'/'}> <img src="https://fetalultrasoundmanual.com/assets/logo.svg"
          alt=""
          className='w-36' />
        </Link>


        <Link
          href={'/'}
          className='hover:scale-95 duration-200 sm:text-lg text-sm bg-[#FCC27F] rounded-full p-4 text-white font-[700]'
        >
          FOGSI Practical Fetal Ultrasound: Detecting Birth Defects (A Case-Based Manual) with Videos
        </Link>

      </div>
    </div>
  )
}

export default Navbar