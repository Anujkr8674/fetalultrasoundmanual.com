import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedAdminFromCookies } from "../../../lib/auth";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminMyProfilePage() {
  const admin = await getAuthenticatedAdminFromCookies();
  if (!admin) {
    redirect("/admin/login?error=session_expired");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7e63ff]">
          My Profile
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Admin account details</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Review your admin profile information and security details.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-3xl bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Admin ID</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              {admin.admin_code || "ADM00001"}
            </div>
          </article>
          <article className="rounded-3xl bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Full name</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">{admin.name}</div>
          </article>
          <article className="rounded-3xl bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Email</div>
            <div className="mt-2 break-all text-lg font-semibold text-slate-900">{admin.email}</div>
          </article>
          <article className="rounded-3xl bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Phone</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              {admin.phone || "Not provided"}
            </div>
          </article>
          <article className="rounded-3xl bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Registered on</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              {formatDate(admin.created_at)}
            </div>
          </article>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#6f63ff_0%,#8f7dff_100%)] p-6 text-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <h2 className="text-2xl font-semibold">Admin shortcuts</h2>
        <div className="mt-6 space-y-3">
          <Link
            href="/admin/changepassword"
            className="block rounded-2xl bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Change password
          </Link>
          <Link
            href="/admin/users"
            className="block rounded-2xl border border-white/30 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Browse user profiles
          </Link>
          <Link
            href="/admin/dashboardoverview"
            className="block rounded-2xl border border-white/30 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Back to overview
          </Link>
        </div>
      </section>
    </div>
  );
}
