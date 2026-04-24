"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AuthorCard from "../../minicomponents/AuthorCard";
import VideoCard from "../../minicomponents/VideoCard";
import CaseLikeButton from "../../minicomponents/CaseLikeButton";
import QuickAuthGateModal from "../../components/QuickAuthGateModal";

const CASE_KEY = "case2";
const ISSUE_KEY = "issue1";
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
              Issue 1 - Case 2
            </span>
          </button>
          <div className="pt-4 text-[20px] font-light text-[#FFF212] sm:mx-8 sm:text-[30px]">
            RECURRENT PREGNANCY LOSS: COMPREHENSIVE REVIEW OF NUTRITIONAL AND CLINICAL MANAGEMENT
            WITH EMPHASIS ON FOLATE SUPPLEMENTATION AND ULTRASOUND IMAGING OF CAUSES IN RPL
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
              title="Dr. Seetha Ramamurthy Pal"
              qualification="DGO MD FRCOG FICOG RCOG/RCR, Diploma in Advanced Obstetric Ultrasound"
              experience="Senior Consultant Obstetrics and Fetal Medicine"
              department="Department of Obstetrics and Gynecology"
              hospital="Apollo Multispeciality Hospital"
              designation=""
              location="Kolkata, West Bengal, India"
              image="https://fetalultrasoundmanual.com/assets/author-images/seeta.png"
              className="h-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AuthorCard
              title="Dr. Jaideep Malhotra"
              qualification="MBBS MD FIAJAGO FICOG FICMCH FICS FMAS FICMU FRCPI FRCOG FICMP FICRM FIAPM"
              experience="President InSARG, South Asia Director IAN Donald School, Managing Director ART Rainbow IVF"
              department="Department of Obstetrics and Gynecology"
              hospital="SMRITI Manyata CSE, Global Rainbow Healthcare, MHMH (P) Ltd"
              designation="Past President FOGSI ISAR ASPIRE IMS AOGS SAFOMS ISPAT, Editor-in-Chief SAFOG and SAFOMS Journals, Past Vice Chairman ICOG, FIGO Committee Roles, Founder Club 35 Plus and Rotary Club Agra Grace"
              location="Agra, Uttar Pradesh, India"
              image="https://fetalultrasoundmanual.com/assets/author-images/jaydeep.png"
              className="h-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AuthorCard
              title="Dr. Poonam Goyal"
              qualification="MD FICOG FICMCH CIMP"
              experience="Head, Department of IVF and Infertility, Director and Head"
              department="Department of Obstetrics and Gynecology"
              hospital="Max Superspeciality Hospital Vaishali, Panchsheel Hospital"
              designation=""
              location="New Delhi, India"
              image="https://fetalultrasoundmanual.com/assets/author-images/poonam.png"
              className="h-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AuthorCard
              title="Dr. Osama Shawki"
              qualification="MD (Cairo University), Board member International Society Gynaecologic Endoscopy (ISGE)"
              experience="Director, Professor (Gynecology Surgery) and Consultant"
              department="Department of Obstetrics and Gynecology"
              hospital="Ebtesama Center for Advanced Endoscopic Surgery, H.A.R.T. (Hyteroscopy Academy for Research and Training), Cairo University School of Medicine"
              designation=""
              location="Cairo, Egypt"
              image="https://fetalultrasoundmanual.com/assets/author-images/osama.png"
              className="h-full"
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
            videoSrc="https://fetalultrasoundmanual.com/assets/videos/Videos_Case 2_Issue 1/Video 1A - Management of uterine cavity problems.mp4"
            title="Video 1A"
            about="Management of uterine cavity problems"
          />
          <VideoCard
            videoSrc="https://fetalultrasoundmanual.com/assets/videos/Videos_Case 2_Issue 1/Video 1B - Management of uterine cavity problems.mp4"
            title="Video 1B"
            about="Management of uterine cavity problems"
          />
          <VideoCard
            videoSrc="https://fetalultrasoundmanual.com/assets/videos/Videos_Case 2_Issue 1/Video 1C - Management of uterine cavity problems.mp4"
            title="Video 1C"
            about="Management of uterine cavity problems"
          />
          <VideoCard
            videoSrc="https://fetalultrasoundmanual.com/assets/videos/Videos_Case 2_Issue 1/Video 1D - Management of uterine cavity problems.mp4"
            title="Video 1D"
            about="Management of uterine cavity problems"
          />
          <VideoCard
            videoSrc="https://fetalultrasoundmanual.com/assets/videos/Videos_Case 2_Issue 1/Video 1E - Management of uterine cavity problems.mp4"
            title="Video 1E"
            about="Management of uterine cavity problems"
          />
        </div>
      </section>
    </div>
  );
}

export default Page;
