"use client";

import { useState } from "react";

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        d="M12 21s-7.5-4.6-9.6-9.1C.7 8.8 2.2 5.7 5.4 5c1.9-.4 3.7.3 4.8 1.7C11.3 5.3 13.1 4.6 15 5c3.2.7 4.7 3.8 3 6.9C19.5 16.4 12 21 12 21z"
      />
    </svg>
  );
}

function LikeButton({ initialCount = 0, label = "Like" }) {
  const [state, setState] = useState({
    liked: false,
    count: initialCount,
  });

  function handleToggle() {
    setState((current) => {
      const liked = !current.liked;
      return {
        liked,
        count: liked ? current.count + 1 : Math.max(0, current.count - 1),
      };
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex items-center gap-2 rounded-full border-2 border-[#d5a062] px-5 py-2 text-sm font-medium text-[#000000] transition duration-300 hover:bg-[#d5a062] hover:text-white"
      aria-pressed={state.liked}
      aria-label={state.liked ? `${label}ed` : label}
    >
      <span className={state.liked ? "text-red-500" : "text-[#000000]"}>
        <HeartIcon filled={state.liked} />
      </span>
      <span>{state.count}</span>
    </button>
  );
}

export default LikeButton;
