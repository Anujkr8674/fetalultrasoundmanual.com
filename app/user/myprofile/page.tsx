import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUserFromCookies } from "../../../lib/auth";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function MyProfilePage() {
  const user = await getAuthenticatedUserFromCookies();
  if (!user) {
    redirect("/user/login?error=session_expired");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1698a7]">
          My Profile
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Account details</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Review your saved account information and move to edit mode when needed.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-3xl bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Full name</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">{user.name}</div>
          </article>
          <article className="rounded-3xl bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Email</div>
            <div className="mt-2 break-all text-lg font-semibold text-slate-900">{user.email}</div>
          </article>
          <article className="rounded-3xl bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Phone</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              {user.phone || "Not provided"}
            </div>
          </article>
          <article className="rounded-3xl bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Gender</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              {user.gender || "Not provided"}
            </div>
          </article>
          <article className="rounded-3xl bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Registered on</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              {formatDate(user.created_at)}
            </div>
          </article>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-[#d5a062] p-6 text-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">Quick Links</p>
        <h2 className="mt-3 text-3xl font-semibold">Next actions</h2>
        <p className="mt-2 text-sm leading-6 text-white/85">
          Update your profile, change password, or return to overview from here.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/user/editprofile"
            className="block rounded-2xl bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Edit profile
          </Link>
          <Link
            href="/user/changepassword"
            className="block rounded-2xl border border-white/30 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Change password
          </Link>
          <Link
            href="/user/dashboardoverview"
            className="block rounded-2xl border border-white/30 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Back to overview
          </Link>
        </div>
      </section>
    </div>
  );
}
