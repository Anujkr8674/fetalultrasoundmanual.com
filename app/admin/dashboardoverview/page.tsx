import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedAdminFromCookies } from "../../../lib/auth";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminDashboardOverviewPage() {
  const admin = await getAuthenticatedAdminFromCookies();
  if (!admin) {
    redirect("/admin/login?error=session_expired");
  }

  const [totalUsers, recentUsers, totalAdmins] = await Promise.all([
    query("SELECT COUNT(*) AS count FROM users"),
    query("SELECT id, name, email, gender, created_at FROM users ORDER BY id DESC LIMIT 5"),
    query("SELECT COUNT(*) AS count FROM admins"),
  ]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#6f63ff_0%,#8f7dff_100%)] p-6 text-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
          Admin Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">Welcome back, {admin.name}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
          Manage users, review profiles, and keep your admin account secure from one control panel.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Total users</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{totalUsers[0]?.count || 0}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Admin accounts</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{totalAdmins[0]?.count || 0}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Your admin ID</p>
          <p className="mt-2 break-all text-lg font-semibold text-slate-900">
            {admin.admin_code || "ADM00001"}
          </p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7e63ff]">
                Recent users
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Latest registrations</h2>
            </div>
            <Link
              href="/admin/users"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {recentUsers.map((user) => (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-[#7e63ff] hover:bg-[#f8f6ff] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="text-base font-semibold text-slate-900">{user.name}</div>
                  <div className="mt-1 text-sm text-slate-600 break-all">{user.email}</div>
                </div>
                <div className="text-sm text-slate-500">{formatDate(user.created_at)}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7e63ff]">
            Quick actions
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Admin tools</h2>

          <div className="mt-6 space-y-3">
            <Link
              href="/admin/myprofile"
              className="block rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-[#7e63ff] hover:bg-[#f8f6ff]"
            >
              <div className="font-semibold text-slate-900">My Profile</div>
              <div className="mt-1 text-sm text-slate-600">Review your admin account</div>
            </Link>
            <Link
              href="/admin/changepassword"
              className="block rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-[#7e63ff] hover:bg-[#f8f6ff]"
            >
              <div className="font-semibold text-slate-900">Change Password</div>
              <div className="mt-1 text-sm text-slate-600">Update admin password</div>
            </Link>
            <Link
              href="/admin/users"
              className="block rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-[#7e63ff] hover:bg-[#f8f6ff]"
            >
              <div className="font-semibold text-slate-900">User Profiles</div>
              <div className="mt-1 text-sm text-slate-600">See all registered users</div>
            </Link>
            <Link
              href="/admin/likes"
              className="block rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-[#7e63ff] hover:bg-[#f8f6ff]"
            >
              <div className="font-semibold text-slate-900">Like Reports</div>
              <div className="mt-1 text-sm text-slate-600">Track activity and case likes</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
