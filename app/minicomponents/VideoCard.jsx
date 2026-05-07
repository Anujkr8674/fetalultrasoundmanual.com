"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function VideoCard({ videoSrc, thumbnailSrc = "", title, about }) {
  const [playVideo, setPlayVideo] = useState(false);

  const videoRef = useRef(null);

  const instanceIdRef = useRef(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  );

  const hasVideoSrc = videoSrc && videoSrc.trim() !== "";

  const isVideo =
    hasVideoSrc &&
    /\.(mp4|webm|mov|m4v|avi)$/i.test(videoSrc);

  // Close other videos automatically
  useEffect(() => {
    function handleVideoPlay(event) {
      if (event.detail?.instanceId === instanceIdRef.current) return;

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }

      setPlayVideo(false);
    }

    window.addEventListener(
      "video-started",
      handleVideoPlay
    );

    return () => {
      window.removeEventListener(
        "video-started",
        handleVideoPlay
      );
    };
  }, []);

  function startVideo() {
    // Notify all other cards
    window.dispatchEvent(
      new CustomEvent("video-started", {
        detail: {
          instanceId: instanceIdRef.current,
        },
      })
    );

    setPlayVideo(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      className="h-[360px] w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-white/90 shadow-[0_8px_32px_rgba(0,126,130,0.2)] backdrop-blur-md"
    >
      <div className="relative aspect-video bg-black">
        {!hasVideoSrc ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <p className="text-sm text-gray-500">
              Video coming soon
            </p>
          </div>
        ) : isVideo ? (
          playVideo ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              controls
              autoPlay
              playsInline
              onPlay={startVideo}
            >
              <source src={videoSrc} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="relative h-full w-full">
              <Image
                src={thumbnailSrc}
                alt={title}
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/30" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={startVideo}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:scale-105"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 translate-x-0.5"
                  >
                    <path
                      fill="currentColor"
                      d="M8 5v14l11-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )
        ) : (
          <Image
            src={videoSrc}
            alt={title}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold text-black">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {about}
        </p>
      </div>
    </motion.div>
  );
}

export default VideoCard;