'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

function VideoCard({ videoSrc, title, about }) {
  const hasVideoSrc = videoSrc && videoSrc.trim() !== '';
  const isVideo = hasVideoSrc && /\.(mp4|webm|mov|m4v|avi)$/i.test(videoSrc);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={{ scale: 1.03 }}
      className="h-[360px] w-full max-w-sm rounded-2xl backdrop-blur-md bg-white/90 border border-white/10 shadow-[0_8px_32px_rgba(0,126,130,0.2)] hover:shadow-[0_10px_40px_rgba(0,126,130,0.3)] overflow-hidden transition duration-300"
    >
      {/* Media */}
      <div className="aspect-video bg-black relative">
        {!hasVideoSrc ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-t-2xl">
            <p className="text-gray-500 text-sm text-center px-4">Video coming soon</p>
          </div>
        ) : isVideo ? (
          <iframe
            src={videoSrc}
            title={title}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-t-2xl"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="absolute inset-0 focus:outline-none"
          >
            <Image
              src={videoSrc}
              alt={title}
              fill
              className="object-cover rounded-t-2xl"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-cyan-600 text-lg font-semibold">{title}</h2>
        <p className="text-gray-500 text-sm mt-1">{about}</p>
      </div>

      {/* Image Modal */}
      {hasVideoSrc && !isVideo && isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-6 right-6 z-10 rounded-full bg-black/60 px-3 pb-2 text-white text-3xl font-light pointer-events-auto"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close image preview"
            >
              ×
            </button>
            <div className="relative w-full h-full">
              <Image
                src={videoSrc}
                alt={title}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default VideoCard;
