import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedAdminFromCookies } from "../../../lib/auth";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

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

function getPageNumber(searchParams, key = "page") {
  const rawPage = searchParams?.[key];
  const value = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const page = Number.parseInt(value || "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function AdminUserLikesPage({ searchParams }) {
  const admin = await getAuthenticatedAdminFromCookies();
  if (!admin) {
    redirect("/admin/login?error=session_expired");
  }

  const currentPage = getPageNumber(searchParams, "page");
  const topCasesPage = getPageNumber(searchParams, "topCasesPage");
  const recentPage = getPageNumber(searchParams, "recentPage");

  const [usersTotalRows, topCasesTotalRows, recentEventsTotalRows] = await Promise.all([
    query("SELECT COUNT(*) AS count FROM users"),
    query(
      `SELECT COUNT(*) AS count FROM (
         SELECT 1
         FROM case_likes
         GROUP BY issue_key, case_key, content_key
       ) AS grouped_case_likes`
    ),
    query("SELECT COUNT(*) AS count FROM case_like_events"),
  ]);

  const totalUsers = Number(usersTotalRows[0]?.count || 0);
  const topCasesTotal = Number(topCasesTotalRows[0]?.count || 0);
  const recentEventsTotal = Number(recentEventsTotalRows[0]?.count || 0);

  const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const hasPrevious = safePage > 1;
  const hasNext = safePage < totalPages;

  const topCasesTotalPages = Math.max(1, Math.ceil(topCasesTotal / PAGE_SIZE));
  const safeTopCasesPage = Math.min(topCasesPage, topCasesTotalPages);
  const topCasesHasPrevious = safeTopCasesPage > 1;
  const topCasesHasNext = safeTopCasesPage < topCasesTotalPages;

  const recentTotalPages = Math.max(1, Math.ceil(recentEventsTotal / PAGE_SIZE));
  const safeRecentPage = Math.min(recentPage, recentTotalPages);
  const recentHasPrevious = safeRecentPage > 1;
  const recentHasNext = safeRecentPage < recentTotalPages;

  const users = await query(
    `SELECT
       u.id,
       u.name,
       u.place,
       u.created_at,
       (SELECT COUNT(*) FROM case_likes cl WHERE cl.user_id = u.id) AS active_likes,
       (SELECT COUNT(*) FROM case_like_events e WHERE e.user_id = u.id) AS total_events,
       (SELECT MAX(e.created_at) FROM case_like_events e WHERE e.user_id = u.id) AS last_activity
     FROM users u
     ORDER BY active_likes DESC, last_activity DESC, u.id DESC
     LIMIT ? OFFSET ?`,
    [PAGE_SIZE, (safePage - 1) * PAGE_SIZE]
  );

  const topLikedCases = await query(
    `SELECT
       issue_key,
       case_key,
       content_key,
       COUNT(*) AS like_count,
       MAX(created_at) AS last_liked_at
     FROM case_likes
     GROUP BY issue_key, case_key, content_key
     ORDER BY like_count DESC, last_liked_at DESC
     LIMIT ? OFFSET ?`,
    [PAGE_SIZE, (safeTopCasesPage - 1) * PAGE_SIZE]
  );

  const recentEvents = await query(
    `SELECT
       e.id,
       e.action,
       e.issue_key,
       e.case_key,
       e.content_key,
       e.created_at,
       u.id AS user_id,
       u.name
     FROM case_like_events e
     INNER JOIN users u ON u.id = e.user_id
     ORDER BY e.created_at DESC, e.id DESC
     LIMIT ? OFFSET ?`,
    [PAGE_SIZE, (safeRecentPage - 1) * PAGE_SIZE]
  );

  const pageHref = (page) => `/admin/userlikes?page=${page}`;
  const topCasesHref = (page) =>
    `/admin/userlikes?page=${safePage}&topCasesPage=${page}&recentPage=${safeRecentPage}`;
  const recentHref = (page) =>
    `/admin/userlikes?page=${safePage}&topCasesPage=${safeTopCasesPage}&recentPage=${page}`;

  const stats = await query(
    `SELECT
       (SELECT COUNT(*) FROM case_likes) AS active_likes,
       (SELECT COUNT(*) FROM case_like_events) AS total_events,
       (SELECT COUNT(DISTINCT user_id) FROM case_likes) AS active_users`
  );

  const summary = stats[0] || {};

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#6f63ff_0%,#8f7dff_100%)] p-6 text-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
          User Likes
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">User like activity</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
          View which users liked cases, how many active likes they have, and recent like/unlike
          events.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Active likes</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.active_likes || 0}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Users with likes</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.active_users || 0}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Total like events</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.total_events || 0}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7e63ff]">
                Users
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">All user like status</h2>
            </div>
            <Link
              href="/admin/likes"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Global reports
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.25em] text-slate-500">
                  <th className="border-b border-slate-200 px-4 py-3">User</th>
                  <th className="border-b border-slate-200 px-4 py-3">Place</th>
                  <th className="border-b border-slate-200 px-4 py-3">Active Likes</th>
                  <th className="border-b border-slate-200 px-4 py-3">Last Activity</th>
                  <th className="border-b border-slate-200 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="text-sm text-slate-700">
                    <td className="border-b border-slate-100 px-4 py-4 font-medium">{user.name}</td>
                    <td className="border-b border-slate-100 px-4 py-4 break-all">{user.place}</td>
                    <td className="border-b border-slate-100 px-4 py-4">
                      <span className="inline-flex rounded-full bg-[#f1eeff] px-3 py-1 text-xs font-semibold text-[#7e63ff]">
                        {user.active_likes || 0}
                      </span>
                    </td>
                    <td className="border-b border-slate-100 px-4 py-4">
                      {formatDate(user.last_activity)}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-4">
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="font-semibold text-[#7e63ff] hover:underline"
                        >
                          Profile
                        </Link>
                        <Link
                          href={`/admin/users/${user.id}/likes`}
                          className="font-semibold text-[#0f9faa] hover:underline"
                        >
                          History
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Showing {totalUsers ? (safePage - 1) * PAGE_SIZE + 1 : 0}-
              {Math.min(safePage * PAGE_SIZE, totalUsers)} of {totalUsers} users
            </p>

            <div className="flex items-center gap-3">
              <Link
                href={hasPrevious ? pageHref(safePage - 1) : "#"}
                aria-disabled={!hasPrevious}
                tabIndex={hasPrevious ? 0 : -1}
                className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                  hasPrevious
                    ? "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    : "pointer-events-none cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                }`}
              >
                Previous
              </Link>

              <span className="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                Page {safePage} of {totalPages}
              </span>

              <Link
                href={hasNext ? pageHref(safePage + 1) : "#"}
                aria-disabled={!hasNext}
                tabIndex={hasNext ? 0 : -1}
                className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                  hasNext
                    ? "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    : "pointer-events-none cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                }`}
              >
                Next
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7e63ff]">
              Top cases
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Most liked cases</h2>

            <div className="mt-6 space-y-3">
              {topLikedCases.length ? (
                topLikedCases.map((item) => (
                  <div
                    key={item.content_key}
                    className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4"
                  >
                    <div className="text-base font-semibold text-slate-900">
                      {getCaseTitle(item.issue_key, item.case_key)}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">{item.content_key}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {item.like_count} likes
                      </span>
                      <span className="text-sm text-slate-500">
                        {formatDate(item.last_liked_at)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                  No like data yet.
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Showing {topCasesTotal ? (safeTopCasesPage - 1) * PAGE_SIZE + 1 : 0}-
                {Math.min(safeTopCasesPage * PAGE_SIZE, topCasesTotal)} of {topCasesTotal} cases
              </p>

              <div className="flex items-center gap-3">
                <Link
                  href={topCasesHasPrevious ? topCasesHref(safeTopCasesPage - 1) : "#"}
                  aria-disabled={!topCasesHasPrevious}
                  tabIndex={topCasesHasPrevious ? 0 : -1}
                  className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                    topCasesHasPrevious
                      ? "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                      : "pointer-events-none cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  }`}
                >
                  Previous
                </Link>

                <span className="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                  Page {safeTopCasesPage} of {topCasesTotalPages}
                </span>

                <Link
                  href={topCasesHasNext ? topCasesHref(safeTopCasesPage + 1) : "#"}
                  aria-disabled={!topCasesHasNext}
                  tabIndex={topCasesHasNext ? 0 : -1}
                  className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                    topCasesHasNext
                      ? "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                      : "pointer-events-none cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  }`}
                >
                  Next
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7e63ff]">
              Recent activity
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Latest events</h2>

            <div className="mt-6 space-y-3">
              {recentEvents.length ? (
                recentEvents.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold text-slate-900">
                          <Link
                            href={`/admin/users/${item.user_id}/likes`}
                            className="text-[#0f9faa] hover:underline"
                          >
                            {item.name}
                          </Link>{" "}
                          {item.action}
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          {getCaseTitle(item.issue_key, item.case_key)} | {item.content_key}
                        </div>
                      </div>
                      <div className="text-sm text-slate-500">{formatDate(item.created_at)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                  No recent activity yet.
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Showing {recentEventsTotal ? (safeRecentPage - 1) * PAGE_SIZE + 1 : 0}-
                {Math.min(safeRecentPage * PAGE_SIZE, recentEventsTotal)} of {recentEventsTotal} events
              </p>

              <div className="flex items-center gap-3">
                <Link
                  href={recentHasPrevious ? recentHref(safeRecentPage - 1) : "#"}
                  aria-disabled={!recentHasPrevious}
                  tabIndex={recentHasPrevious ? 0 : -1}
                  className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                    recentHasPrevious
                      ? "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                      : "pointer-events-none cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  }`}
                >
                  Previous
                </Link>

                <span className="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                  Page {safeRecentPage} of {recentTotalPages}
                </span>

                <Link
                  href={recentHasNext ? recentHref(safeRecentPage + 1) : "#"}
                  aria-disabled={!recentHasNext}
                  tabIndex={recentHasNext ? 0 : -1}
                  className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                    recentHasNext
                      ? "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                      : "pointer-events-none cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  }`}
                >
                  Next
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
