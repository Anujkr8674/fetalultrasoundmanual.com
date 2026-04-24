"use client";

import { useState } from "react";

export default function QuickAuthGateModal({
  open,
  onClose,
  onGuestContinue,
  onAuthenticated,
}) {
  const [form, setForm] = useState({
    name: "",
    place: "",
    loading: false,
    error: "",
  });

  function updateField(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
      error: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.loading) return;

    const name = form.name.trim();
    const place = form.place.trim();
    if (!name || !place) {
      setForm((current) => ({ ...current, error: "Full name and place are required." }));
      return;
    }

    setForm((current) => ({ ...current, loading: true, error: "" }));

    try {
      const response = await fetch("/api/userapi/quick-auth", {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({ name, place }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setForm((current) => ({
          ...current,
          loading: false,
          error: data?.message || "Unable to continue right now.",
        }));
        return;
      }

      window.dispatchEvent(new Event("fogsi-auth-changed"));
      setForm((current) => ({ ...current, loading: false, error: "" }));
      if (onAuthenticated) {
        onAuthenticated();
      }
    } catch {
      setForm((current) => ({
        ...current,
        loading: false,
        error: "Unable to continue right now.",
      }));
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-white p-6 text-slate-900 shadow-[0_25px_80px_rgba(0,0,0,0.3)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-xl font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
        >
          ×
        </button>

        <div className="mt-4 space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3">
          <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
            <input
              name="name"
              type="text"
              required
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Full name"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#39c7d4] focus:bg-white"
            />
            <label className="mb-2 block text-sm font-medium text-slate-700">Place</label>
            <input
              name="place"
              type="text"
              required
              value={form.place}
              onChange={(event) => updateField("place", event.target.value)}
              placeholder="Place"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#39c7d4] focus:bg-white"
            />
            {form.error ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {form.error}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={form.loading}
              className="w-full rounded-2xl bg-[#d5a062] px-4 py-3 text-sm font-semibold text-white transition hover:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {form.loading ? "Please wait..." : "Submit"}
            </button>
          </form>

          <button
            type="button"
            onClick={onGuestContinue}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
