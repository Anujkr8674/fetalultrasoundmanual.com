"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import AuthorCard from "../../minicomponents/AuthorCard";
import VideoCard from "../../minicomponents/VideoCard";
import CaseLikeButton from "../../minicomponents/CaseLikeButton";

const CASE_KEY = "case1";
const ISSUE_KEY = "issue1";
const CASE_PATH = "/issue1/case1";

function Page() {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState("checking");
  const [showGate, setShowGate] = useState(false);
  const [guestMode, setGuestMode] = useState(false);
  const [likeState, setLikeState] = useState({
    count: 0,
    liked: false,
    loading: true,
  });

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/userapi/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!active) return;

        if (response.ok) {
          setAuthStatus("authenticated");
          setShowGate(false);
        } else {
          setAuthStatus("guest");
          setShowGate(true);
        }
      } catch {
        if (active) {
          setAuthStatus("guest");
          setShowGate(true);
        }
      }
    }

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadLikeState() {
      try {
        const params = new URLSearchParams({
          issueKey: ISSUE_KEY,
          caseKey: CASE_KEY,
        });

        const response = await fetch(`/api/userapi/case-likes?${params.toString()}`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!active) return;

        if (response.ok) {
          const data = await response.json();
          setLikeState({
            count: Number(data?.count || 0),
            liked: Boolean(data?.liked),
            loading: false,
          });
        } else {
          setLikeState((current) => ({ ...current, loading: false }));
        }
      } catch {
        if (active) {
          setLikeState((current) => ({ ...current, loading: false }));
        }
      }
    }

    loadLikeState();

    return () => {
      active = false;
    };
  }, []);

  async function handleToggleLike() {
    if (authStatus !== "authenticated") {
      setShowGate(true);
      return;
    }

    setLikeState((current) => ({ ...current, loading: true }));

    try {
      const response = await fetch("/api/userapi/case-likes", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          issueKey: ISSUE_KEY,
          caseKey: CASE_KEY,
        }),
      });

      if (!response.ok) {
        setLikeState((current) => ({ ...current, loading: false }));
        if (response.status === 401) {
          setAuthStatus("guest");
          setShowGate(true);
        }
        return;
      }

      const data = await response.json();
      setLikeState({
        count: Number(data?.count || 0),
        liked: Boolean(data?.liked),
        loading: false,
      });
    } catch {
      setLikeState((current) => ({ ...current, loading: false }));
    }
  }

  function handleLoginRedirect() {
    router.push(`/user/login?redirectTo=${encodeURIComponent(CASE_PATH)}&message=login_required_for_like`);
  }

  function handleGuestContinue() {
    setGuestMode(true);
    setShowGate(false);
  }

  function handleCloseGate() {
    setShowGate(false);
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat px-6 py-16 text-[#d5a062]"
      style={{
        backgroundImage: "url('https://fetalultrasoundmanual.com/assets/bg-images/bg.png')",
      }}
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-white/45 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]" />

      {showGate && authStatus !== "checking" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-white p-6 text-slate-900 shadow-[0_25px_80px_rgba(0,0,0,0.3)]">
            <button
              type="button"
              onClick={handleCloseGate}
              aria-label="Close dialog"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-xl font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            >
              ×
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7e63ff]">
              Access Mode
            </p>
            <h2 className="mt-3 text-3xl font-semibold">Login or continue as guest</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              You can open the case as a guest, but only logged-in users can like and track this
              case.
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleLoginRedirect}
                className="w-full rounded-2xl bg-[#d5a062] px-4 py-3 text-sm font-semibold text-white transition hover:scale-[0.99]"
              >
                Login to like
              </button>
              <button
                type="button"
                onClick={handleGuestContinue}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto mb-12 md:max-w-7xl text-center">
        <h1 className="text-3xl font-light md:text-5xl">
          <button className="rounded-md border-2 border-[#d5a062] text-[#000000] duration-200 hover:bg-[#d5a062] hover:text-black text-4xl">
            <span className="block px-4 py-2 font-light text-black hover:text-white">
              Issue 1 - Case 1
            </span>
          </button>
          <div className="pt-4 text-[20px] font-light text-[#FFF212] sm:mx-8 sm:text-[30px]">
            PREVENTION OF NEURAL TUBE DEFECTS BY ROUTINE PERICONCEPTIONAL FOLIC ACID
            SUPPLEMENTATION: COMMENTARY ON A CASE REPORT
          </div>
        </h1>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/issue1"
            className="rounded-full border-2 border-[#d5a062] px-6 py-2 text-sm font-medium text-black transition duration-300 hover:bg-[#d5a062] hover:text-white"
          >
            &larr; Back to Issue 1
          </Link>

          <CaseLikeButton
            count={likeState.count}
            liked={likeState.liked}
            loading={likeState.loading}
            disabled={authStatus !== "authenticated"}
            onClick={handleToggleLike}
          />
        </div>

        {guestMode ? (
          <p className="mt-4 text-sm text-red-600 bg-white p-3 rounded-md border border-red-200">
  Guest mode active. Login required to like this case.
</p>
        ) : null}
      </div>

      <section className="mx-auto mb-20 max-w-5xl text-center">
        <div className="flex items-center justify-center">
          <h2 className="mb-10 border-b-1 py-2 text-center text-2xl font-semibold text-[#FCC27F] md:text-3xl">
            Researchers & Contributors
          </h2>
        </div>
        <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2">
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
        </div>
      </section>

      <section className="mx-auto mb-20 max-w-7xl">
        <div className="flex items-center justify-center">
          <h2 className="mb-10 border-b-1 py-2 text-center text-2xl font-semibold text-[#d5a062] md:text-3xl">
            Case Videos
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <VideoCard
            videoSrc="https://fetalultrasoundmanual.com/assets/videos/Videos_Case 1_Issue 1/Video 1_Early fetal development.mp4"
            title="Video 1"
            about="Early fetal development"
          />

          <VideoCard
            videoSrc="https://fetalultrasoundmanual.com/assets/videos/Videos_Case 1_Issue 1/Video 2A Early pregnancy scan.mp4"
            title="Video 2A"
            about="Early pregnancy scan"
          />

          <VideoCard
            videoSrc="https://fetalultrasoundmanual.com/assets/videos/Videos_Case 1_Issue 1/Video 2B Early pregnancy scan.mp4"
            title="Video 2B"
            about="Early pregnancy scan"
          />

          <VideoCard
            videoSrc="https://fetalultrasoundmanual.com/assets/videos/Videos_Case 1_Issue 1/Video 2C Early pregnancy scan.mp4"
            title="Video 2C"
            about="Early pregnancy scan"
          />

          <VideoCard
            videoSrc="https://fetalultrasoundmanual.com/assets/videos/Videos_Case 1_Issue 1/Video 3A Development of neural tube.mp4"
            title="Video 3A"
            about="Development of neural tube"
          />

          <VideoCard
            videoSrc="https://fetalultrasoundmanual.com/assets/videos/Videos_Case 1_Issue 1/Video 3B Development of neural tube.mp4"
            title="Video 3B"
            about="Development of neural tube"
          />
        </div>
      </section>
    </div>
  );
}

export default Page;
