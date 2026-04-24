import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUserFromCookies } from "../../../lib/auth";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getCaseTitle(issueKey, caseKey) {
  const key = `${issueKey}:${caseKey}`;
  const map = {
    "issue1:case1": "Issue 1 - Case 1",
    "issue1:case2": "Issue 1 - Case 2",
  };
  return map[key] || key;
}

export default async function UserDashboardOverviewPage() {
  const user = await getAuthenticatedUserFromCookies();
  if (!user) {
    redirect("/user/login?error=session_expired");
  }

  const [activeLikes, recentEvents, profileStats] = await Promise.all([
    query(
      `SELECT issue_key, case_key, content_key, created_at AS liked_at
       FROM case_likes
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 3`,
      [user.id]
    ),
    query(
      `SELECT id, issue_key, case_key, content_key, action, created_at
       FROM case_like_events
       WHERE user_id = ?
       ORDER BY created_at DESC, id DESC
       LIMIT 5`,
      [user.id]
    ),
    query(
      `SELECT
         COUNT(*) AS total_like_events,
         SUM(CASE WHEN action = 'like' THEN 1 ELSE 0 END) AS likes_count,
         SUM(CASE WHEN action = 'unlike' THEN 1 ELSE 0 END) AS unlikes_count
       FROM case_like_events
       WHERE user_id = ?`,
      [user.id]
    ),
  ]);

  const stats = profileStats[0] || {};

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-[#d5a062] p-6 text-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
          User Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">Welcome back, {user.name}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
          Essential overview of your account, saved likes, and latest activity.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Full name</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{user.name}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Place</p>
          <p className="mt-2 break-all text-xl font-semibold text-slate-900">{user.place}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Joined</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{formatDate(user.created_at)}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Active likes</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{activeLikes.length}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1698a7]">
                Likes
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Your saved cases</h2>
            </div>
            <Link
              href="/user/mylikes"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <article className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Total likes</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{activeLikes.length}</p>
            </article>
            <article className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Like events</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {Number(stats.total_like_events || 0)}
              </p>
            </article>
            <article className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Unlike events</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {Number(stats.unlikes_count || 0)}
              </p>
            </article>
          </div>

          <div className="mt-6 space-y-3">
            {activeLikes.length ? (
              activeLikes.map((item) => (
                <Link
                  key={`${item.issue_key}:${item.case_key}:${item.content_key}`}
                  href={`/${item.issue_key}/${item.case_key}`}
                  className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-[#22c4cf] hover:bg-[#effdff]"
                >
                  <div>
                    <div className="text-base font-semibold text-slate-900">
                      {getCaseTitle(item.issue_key, item.case_key)}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">{item.content_key}</div>
                  </div>
                  <div className="text-sm text-slate-500">{formatDate(item.liked_at)}</div>
                </Link>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                No likes saved yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1698a7]">
                Recent Activity
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Latest like actions</h2>
            </div>
            <Link
              href="/user/mylikeshistory"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Open history
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {recentEvents.length ? (
              recentEvents.map((item) => (
                <Link
                  key={item.id}
                  href={`/${item.issue_key}/${item.case_key}`}
                  className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-[#22c4cf] hover:bg-[#effdff]"
                >
                  <div>
                    <div className="text-base font-semibold text-slate-900">
                      {item.action === "like" ? "Liked" : "Unliked"}{" "}
                      {getCaseTitle(item.issue_key, item.case_key)}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">{item.content_key}</div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        item.action === "like"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.action}
                    </div>
                    <div className="mt-2 text-sm text-slate-500">{formatDate(item.created_at)}</div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                No recent activity yet.
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/user/myprofile"
              className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-[#22c4cf] hover:bg-[#effdff]"
            >
              <div className="text-base font-semibold text-slate-900">My Profile</div>
              <div className="mt-1 text-sm text-slate-600">View account details</div>
            </Link>
            <Link
              href="/user/changepassword"
              className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-[#22c4cf] hover:bg-[#effdff]"
            >
              <div className="text-base font-semibold text-slate-900">Change Password</div>
              <div className="mt-1 text-sm text-slate-600">Secure your session</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
