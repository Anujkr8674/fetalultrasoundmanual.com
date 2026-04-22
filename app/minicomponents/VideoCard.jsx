"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function VideoCard({ videoSrc, thumbnailSrc = "", title, about }) {
  const hasVideoSrc = videoSrc && videoSrc.trim() !== "";
  const isVideo = hasVideoSrc && /\.(mp4|webm|mov|m4v|avi)$/i.test(videoSrc);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef(null);
  const instanceIdRef = useRef(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  );
  const hasThumbnail = Boolean(thumbnailSrc && thumbnailSrc.trim());
  const fallbackLabel = useMemo(
    () => (title ? String(title).slice(0, 2).toUpperCase() : "VI"),
    [title]
  );

  useEffect(() => {
    function handleVideoOpened(event) {
      if (event.detail?.instanceId === instanceIdRef.current) return;

      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsModalOpen(false);
    }

    window.addEventListener("fogsi-video-opened", handleVideoOpened);
    return () => window.removeEventListener("fogsi-video-opened", handleVideoOpened);
  }, []);

  function openVideoModal() {
    setIsModalOpen(true);
    window.dispatchEvent(
      new CustomEvent("fogsi-video-opened", {
        detail: { instanceId: instanceIdRef.current },
      })
    );
  }

  function closeModal() {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsModalOpen(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      className="h-[360px] w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-white/90 shadow-[0_8px_32px_rgba(0,126,130,0.2)] transition duration-300 hover:shadow-[0_10px_40px_rgba(0,126,130,0.3)] backdrop-blur-md"
    >
      <div className="relative aspect-video bg-black">
        {!hasVideoSrc ? (
          <div className="flex h-full w-full items-center justify-center rounded-t-2xl bg-gray-200">
            <p className="px-4 text-center text-sm text-gray-500">Video coming soon</p>
          </div>
        ) : isVideo ? (
          hasThumbnail ? (
            <button
              type="button"
              onClick={openVideoModal}
              className="absolute inset-0 focus:outline-none"
              aria-label={`Play video ${title}`}
            >
              <Image
                src={thumbnailSrc}
                alt={`${title} thumbnail`}
                fill
                className="rounded-t-2xl object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  Video
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  Click to play
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg transition group-hover:scale-105">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 translate-x-0.5">
                    <path fill="currentColor" d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={openVideoModal}
              className="group absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-slate-700 focus:outline-none"
              aria-label={`Play video ${title}`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg transition group-hover:scale-105">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 translate-x-0.5">
                  <path fill="currentColor" d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-black/45 px-3 py-2 text-left text-xs text-white backdrop-blur-sm">
                Click to play
              </div>
              <div className="absolute left-3 top-3 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {fallbackLabel}
              </div>
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={openVideoModal}
            className="absolute inset-0 focus:outline-none"
            aria-label={`Open preview for ${title}`}
          >
            <Image
              src={videoSrc}
              alt={title}
              fill
              className="rounded-t-2xl object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
          </button>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold text-[#000000]">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{about}</p>
      </div>

      {hasVideoSrc && isModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeModal}
        >
          <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 px-4 py-2 text-3xl font-light text-white"
              onClick={closeModal}
              aria-label="Close preview"
            >
              x
            </button>

            {isVideo ? (
              <video
                ref={videoRef}
                className="h-full w-full rounded-2xl bg-black"
                controls
                playsInline
                preload="metadata"
                onEnded={closeModal}
              >
                <source src={videoSrc} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="relative h-full w-full">
                <Image src={videoSrc} alt={title} fill className="object-contain" priority />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}

export default VideoCard;
