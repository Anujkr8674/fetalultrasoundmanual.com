"use client";

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

function CaseLikeButton({ count = 0, liked = false, disabled = false, loading = false, onClick }) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-pressed={liked}
      className={`inline-flex items-center gap-2 rounded-full border-2 px-5 py-2 text-sm font-medium transition duration-300 ${
        isDisabled
          ? "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400"
          : liked
            ? "border-red-500 bg-white/90 text-red-500 hover:scale-95"
            : "border-[#d5a062] text-[#000000] hover:bg-[#d5a062] hover:text-white"
      }`}
    >
      <span className={liked ? "text-red-500" : "text-[#000000]"}>
        <HeartIcon filled={liked} />
      </span>
      <span className={liked ? "text-black-500" : ""}>{loading ? "..." : count}</span>
    </button>
  );
}

export default CaseLikeButton;
