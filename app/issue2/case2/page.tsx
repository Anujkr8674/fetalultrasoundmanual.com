"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AuthorCard from "../../minicomponents/AuthorCard";
import VideoCard from "../../minicomponents/VideoCard";
import CaseLikeButton from "../../minicomponents/CaseLikeButton";
import QuickAuthGateModal from "../../components/QuickAuthGateModal";

const CASE_KEY = "case2";
const ISSUE_KEY = "issue2";

function Page() {
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

      <QuickAuthGateModal
        open={showGate && authStatus !== "checking"}
        onClose={handleCloseGate}
        onGuestContinue={handleGuestContinue}
        onAuthenticated={() => {
          setAuthStatus("authenticated");
          setGuestMode(false);
          setShowGate(false);
        }}
      />

      <div className="mx-auto mb-12 md:max-w-7xl text-center">
        <h1 className="text-3xl font-light md:text-5xl">
          <button className="rounded-md border-2 border-[#d5a062] text-[#000000] duration-200 hover:bg-[#d5a062] hover:text-black text-4xl">
            <span className="block px-4 py-2 font-light text-black hover:text-white">
              Issue 2 - Case 2
            </span>
          </button>
          <div className="pt-4 text-[20px] font-light text-[#FFF212] sm:mx-8 sm:text-[30px]">
            FETAL GROWTH RESTRICTION: EARLY VS. LATE ONSET: A CASE-BASED DISCUSSION
          </div>
        </h1>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/issue2"
            className="rounded-full border-2 border-[#d5a062] px-6 py-2 text-sm font-medium text-black transition duration-300 hover:bg-[#d5a062] hover:text-white"
          >
            &larr; Back to Issue 2
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
          <p className="mt-4 text-sm p-3 "></p>
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
              title="Dr. Bela Bhatt"
              qualification="MBBS MD (Obs and Gyne) FICOG FMF (UK) Certified Sonologist"
              experience="Consultant (Obstetrics and Gynecology and Fetal Medicine)"
              department=""
              hospital="Dr Bela's Women's Hospital and Fetal Medicine Center"
              designation=""
              location="Mumbai, Maharashtra, India"
              image="https://fetalultrasoundmanual.com/assets/issue2-assets/images/bela.png"
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
              experience="Consultant Reproductive Endocrinologist, Gynecologist and Obstetrician"
              department="Department of Obstetrics and Gynecology"
              hospital="WOW London"
              designation=""
              location="Cambridge, United Kingdom"
              image="https://fetalultrasoundmanual.com/assets/issue2-assets/images/karunkar.png"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -100 }}
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
              image="https://fetalultrasoundmanual.com/assets/issue2-assets/images/kuldeep.png"
            />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto mb-20 max-w-7xl">
        <div className="flex items-center justify-center">
          <h2 className="mb-10 border-b-1 py-2 text-center text-2xl font-semibold text-[#FCC27F] md:text-3xl">
            Case Videos
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <VideoCard
            videoSrc="https://fetalultrasoundmanual.com/assets/issue2-assets/case2/videos/Video1.mp4"
            thumbnailSrc="https://fetalultrasoundmanual.com/assets/videos/thumb/case2/Video1A.png"
            title="Video 1"
            about="Insonate the umbilical artery in a free loop of the umbilical cord."
          />

          <VideoCard
            videoSrc="https://fetalultrasoundmanual.com/assets/issue2-assets/case2/videos/Video2.mp4"
            thumbnailSrc="https://fetalultrasoundmanual.com/assets/videos/thumb/case2/Video1B.png"
            title="Video 2"
            about="This is the umbilical artery flow velocity waveform. With advancing gestation, the diastolic flow increases. With increasing hypoxia, gradually the diastolic flow will decrease, indicating that the impedance is going to increase, leading to finally absent end-diastolic flow and then reversal of flow in diastole."
          />

          <VideoCard
            videoSrc="https://fetalultrasoundmanual.com/assets/issue2-assets/case2/videos/Video3.mp4"
            thumbnailSrc="https://fetalultrasoundmanual.com/assets/videos/thumb/case2/Video1C.png"
            title="Video 3"
            about="This is the middle cerebral artery, which is a part of the circle of Willis. You can insonate either the proximal vessel or the distal vessel."
          />

          <VideoCard
            videoSrc="https://fetalultrasoundmanual.com/assets/issue2-assets/case2/videos/Video4.mp4"
            thumbnailSrc="https://fetalultrasoundmanual.com/assets/videos/thumb/case2/Video1D.png"
            title="Video 4"
            about="This is the middle cerebral artery flow velocity waveform. The middle cerebral artery is a high-resistance circuit. With increasing hypoxia, there is a brain-sparing effect, meaning the diastolic flow to the middle cerebral artery increases. So, if the middle cerebral artery is less than the 5th percentile, it is abnormal. With the increasing brain-sparing reflex giving way, brain edema will develop, and, again, diastolic flow will decrease."
          />
        </div>
      </section>
    </div>
  );
}

export default Page;
