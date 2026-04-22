"use client";

import { useState } from "react";

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M12 5c5.5 0 9.5 4.7 10.8 6.5.2.3.2.7 0 1C21.5 14.3 17.5 19 12 19S2.5 14.3 1.2 12.5c-.2-.3-.2-.7 0-1C2.5 9.7 6.5 5 12 5Zm0 2C8.2 7 5 10.1 3.6 12c1.4 1.9 4.6 5 8.4 5s7-3.1 8.4-5C19 10.1 15.8 7 12 7Zm0 1.5A3.5 3.5 0 1 1 12 16a3.5 3.5 0 0 1 0-7Zm0 2A1.5 1.5 0 1 0 12 13a1.5 1.5 0 0 0 0-3.5Z"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M2.1 3.5 20.5 21.9l-1.4 1.4-3-3A11 11 0 0 1 12 20C6.5 20 2.5 15.3 1.2 13.5a1.8 1.8 0 0 1 0-2C2.1 9.8 4 7.5 6.7 5.8L.7 1.9 2.1.5l1.9 1.3ZM12 6c5.5 0 9.5 4.7 10.8 6.5.2.3.2.7 0 1-.5.7-1.2 1.6-2.1 2.5l-2-2A3.5 3.5 0 0 0 9.2 7.1L7.7 5.6A9.6 9.6 0 0 1 12 6Zm0 2c.7 0 1.4.1 2 .3l-2.3-2.3H12A3.5 3.5 0 0 0 8.6 10l-1.5-1.5C8.4 8.5 10.1 8 12 8Zm0 4a1.5 1.5 0 0 1-1.1-2.5l2.6 2.6A1.5 1.5 0 0 1 12 12Z"
      />
    </svg>
  );
}

export default function PasswordField({ name = "password", label = "Password", placeholder = "Your password", autoComplete = "current-password" }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <input
          name={name}
          type={visible ? "text" : "password"}
          required
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#39c7d4] focus:bg-white"
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-slate-500 transition hover:text-slate-800"
        >
          <EyeIcon open={visible} />
        </button>
      </div>
    </div>
  );
}
