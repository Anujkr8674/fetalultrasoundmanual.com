import React from 'react';
import Image from 'next/image';

function AuthorCard({
  title,
  experience = '',
  qualification = '',
  designation = '',
  department = '',
  hospital = '',
  location = '',
  image = null,
  className = '',
}) {

  // split qualification (for 2 lines)
  const qualificationParts = qualification.split(',');

  // split hospital (for 2 lines)
  const hospitalParts = hospital.split(',');

  return (
    <div className={`flex flex-col items-center text-center gap-5 p-4 rounded-md backdrop-blur-md bg-[#d5a062] border-4 shadow-[0_8px_32px_rgba(0,126,130,0.2)] hover:shadow-[0_10px_40px_rgba(0,126,130,0.3)] transition duration-300 sm:w-[400px] w-full ${className}`}>
      
       {image && (
        <div className="relative w-40 h-40 rounded-lg overflow-hidden border-2 border-white shadow-lg shrink-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className='text-left w-full text-[15px] leading-relaxed'>
        <h2 className="text-white font-bold text-xl">{title}</h2>

        {/* 1 & 2 Qualification split */}
        {qualificationParts.map((item, i) => (
          <p key={i} className="text-gray-100 mt-1">{item.trim()}</p>
        ))}

        {/* 3 Department */}
        <p className="text-gray-100 mt-1">{department}</p>

        {/* 4 Designation */}
        <p className="text-gray-100 mt-1">{designation}</p>

        {/* 5 Experience */}
        <p className="text-gray-100 mt-1">{experience}</p>

        {/* 6 & 7 Hospital split */}
        {hospitalParts.map((item, i) => (
          <p key={i} className="text-gray-100 mt-1">{item.trim()}</p>
        ))}

        {/* 8 Location */}
        <p className="text-gray-100 mt-1">{location}</p>
      </div>
    </div>
  );
}

export default AuthorCard;
