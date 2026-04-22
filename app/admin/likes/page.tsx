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

function getPageNumber(searchParams, key) {
  const rawPage = searchParams?.[key];
  const value = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const page = Number.parseInt(value || "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function AdminLikesPage({ searchParams }) {
  const admin = await getAuthenticatedAdminFromCookies();
  if (!admin) {
    redirect("/admin/login?error=session_expired");
  }

  const summaryPage = getPageNumber(searchParams, "summaryPage");
  const usersPage = getPageNumber(searchParams, "usersPage");
  const eventsPage = getPageNumber(searchParams, "eventsPage");

  const [summaryCountRows, topUsersCountRows, recentEventsCountRows] = await Promise.all([
    query(
      `SELECT COUNT(*) AS count FROM (
         SELECT 1
         FROM case_likes
         GROUP BY issue_key, case_key, content_key
       ) AS grouped_case_likes`
    ),
    query(
      `SELECT COUNT(*) AS count FROM (
         SELECT u.id
         FROM case_likes cl
         INNER JOIN users u ON u.id = cl.user_id
         GROUP BY u.id, u.name, u.email
       ) AS grouped_users`
    ),
    query("SELECT COUNT(*) AS count FROM case_like_events"),
  ]);

  const summaryTotal = Number(summaryCountRows[0]?.count || 0);
  const topUsersTotal = Number(topUsersCountRows[0]?.count || 0);
  const recentEventsTotal = Number(recentEventsCountRows[0]?.count || 0);

  const summaryTotalPages = Math.max(1, Math.ceil(summaryTotal / PAGE_SIZE));
  const topUsersTotalPages = Math.max(1, Math.ceil(topUsersTotal / PAGE_SIZE));
  const recentEventsTotalPages = Math.max(1, Math.ceil(recentEventsTotal / PAGE_SIZE));

  const safeSummaryPage = Math.min(summaryPage, summaryTotalPages);
  const safeUsersPage = Math.min(usersPage, topUsersTotalPages);
  const safeEventsPage = Math.min(eventsPage, recentEventsTotalPages);

  const summaryHasPrevious = safeSummaryPage > 1;
  const summaryHasNext = safeSummaryPage < summaryTotalPages;
  const usersHasPrevious = safeUsersPage > 1;
  const usersHasNext = safeUsersPage < topUsersTotalPages;
  const eventsHasPrevious = safeEventsPage > 1;
  const eventsHasNext = safeEventsPage < recentEventsTotalPages;

  const [summaryRows, topUsers, recentEvents] = await Promise.all([
    query(
      `SELECT
         cl.issue_key,
         cl.case_key,
         cl.content_key,
         COUNT(*) AS like_count,
         MAX(cl.created_at) AS last_liked_at
       FROM case_likes cl
       GROUP BY cl.issue_key, cl.case_key, cl.content_key
       ORDER BY like_count DESC, last_liked_at DESC
       LIMIT ? OFFSET ?`,
      [PAGE_SIZE, (safeSummaryPage - 1) * PAGE_SIZE]
    ),
    query(
      `SELECT
         u.id,
         u.name,
         u.email,
         COUNT(*) AS like_count
       FROM case_likes cl
       INNER JOIN users u ON u.id = cl.user_id
       GROUP BY u.id, u.name, u.email
       ORDER BY like_count DESC, u.id DESC
       LIMIT ? OFFSET ?`,
      [PAGE_SIZE, (safeUsersPage - 1) * PAGE_SIZE]
    ),
    query(
      `SELECT
         e.id,
         e.action,
         e.issue_key,
         e.case_key,
         e.content_key,
         e.created_at,
         u.id AS user_id,
         u.name,
         u.email
       FROM case_like_events e
       INNER JOIN users u ON u.id = e.user_id
       ORDER BY e.created_at DESC, e.id DESC
       LIMIT ? OFFSET ?`,
      [PAGE_SIZE, (safeEventsPage - 1) * PAGE_SIZE]
    ),
  ]);

  const totals = await query(
    `SELECT
       (SELECT COUNT(*) FROM case_likes) AS active_likes,
       (SELECT COUNT(*) FROM case_like_events) AS total_events,
       (SELECT COUNT(*) FROM case_like_events WHERE action = 'like') AS like_events,
       (SELECT COUNT(*) FROM case_like_events WHERE action = 'unlike') AS unlike_events,
       (SELECT COUNT(DISTINCT user_id) FROM case_likes) AS active_users`
  );
  const stats = totals[0] || {};

  const pageHref = ({
    summaryPage: summaryPageNumber = safeSummaryPage,
    usersPage: usersPageNumber = safeUsersPage,
    eventsPage: eventsPageNumber = safeEventsPage,
  } = {}) =>
    `/admin/likes?summaryPage=${summaryPageNumber}&usersPage=${usersPageNumber}&eventsPage=${eventsPageNumber}`;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#6f63ff_0%,#8f7dff_100%)] p-6 text-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
          Like Reports
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">Case like tracking</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
          Track which users liked which case, when they liked it, and all like/unlike activity.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Active likes</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.active_likes || 0}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Total events</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.total_events || 0}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Like events</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.like_events || 0}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Unlike events</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.unlike_events || 0}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Active users</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.active_users || 0}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7e63ff]">
                Case summary
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Likes by case</h2>
            </div>
            <Link
              href="/admin/dashboardoverview"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Back to overview
            </Link>
          </div>

          {summaryRows.length ? (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.25em] text-slate-500">
                    <th className="border-b border-slate-200 px-4 py-3">Issue</th>
                    <th className="border-b border-slate-200 px-4 py-3">Case</th>
                    <th className="border-b border-slate-200 px-4 py-3">Content Key</th>
                    <th className="border-b border-slate-200 px-4 py-3">Likes</th>
                    <th className="border-b border-slate-200 px-4 py-3">Last Like</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryRows.map((item) => (
                    <tr key={item.content_key} className="text-sm text-slate-700">
                      <td className="border-b border-slate-100 px-4 py-4">{item.issue_key}</td>
                      <td className="border-b border-slate-100 px-4 py-4 font-medium">
                        {getCaseTitle(item.issue_key, item.case_key)}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-4">{item.content_key}</td>
                      <td className="border-b border-slate-100 px-4 py-4">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {item.like_count}
                        </span>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-4">
                        {formatDate(item.last_liked_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
              No case likes found yet.
            </div>
          )}

          <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Showing {summaryTotal ? (safeSummaryPage - 1) * PAGE_SIZE + 1 : 0}-
              {Math.min(safeSummaryPage * PAGE_SIZE, summaryTotal)} of {summaryTotal} cases
            </p>

            <div className="flex items-center gap-3">
              <Link
                href={summaryHasPrevious ? pageHref({ summaryPage: safeSummaryPage - 1 }) : "#"}
                aria-disabled={!summaryHasPrevious}
                tabIndex={summaryHasPrevious ? 0 : -1}
                className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                  summaryHasPrevious
                    ? "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    : "pointer-events-none cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                }`}
              >
                Previous
              </Link>

              <span className="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                Page {safeSummaryPage} of {summaryTotalPages}
              </span>

              <Link
                href={summaryHasNext ? pageHref({ summaryPage: safeSummaryPage + 1 }) : "#"}
                aria-disabled={!summaryHasNext}
                tabIndex={summaryHasNext ? 0 : -1}
                className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                  summaryHasNext
                    ? "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    : "pointer-events-none cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                }`}
              >
                Next
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7e63ff]">
            Top users
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Most active users</h2>

          <div className="mt-6 space-y-3">
            {topUsers.length ? (
              topUsers.map((user) => (
                <Link
                  key={user.id}
                  href={`/admin/users/${user.id}/likes`}
                  className="block rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-[#7e63ff] hover:bg-[#f8f6ff]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold text-slate-900">{user.name}</div>
                      <div className="mt-1 text-sm text-slate-600 break-all">{user.email}</div>
                    </div>
                    <span className="inline-flex rounded-full bg-[#f1eeff] px-3 py-1 text-xs font-semibold text-[#7e63ff]">
                      {user.like_count} likes
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                No active users yet.
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Showing {topUsersTotal ? (safeUsersPage - 1) * PAGE_SIZE + 1 : 0}-
              {Math.min(safeUsersPage * PAGE_SIZE, topUsersTotal)} of {topUsersTotal} users
            </p>

            <div className="flex items-center gap-3">
              <Link
                href={usersHasPrevious ? pageHref({ usersPage: safeUsersPage - 1 }) : "#"}
                aria-disabled={!usersHasPrevious}
                tabIndex={usersHasPrevious ? 0 : -1}
                className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                  usersHasPrevious
                    ? "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    : "pointer-events-none cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                }`}
              >
                Previous
              </Link>

              <span className="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                Page {safeUsersPage} of {topUsersTotalPages}
              </span>

              <Link
                href={usersHasNext ? pageHref({ usersPage: safeUsersPage + 1 }) : "#"}
                aria-disabled={!usersHasNext}
                tabIndex={usersHasNext ? 0 : -1}
                className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                  usersHasNext
                    ? "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    : "pointer-events-none cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                }`}
              >
                Next
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7e63ff]">
              Activity Log
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Recent like and unlike events
            </h2>
          </div>
        </div>

        {recentEvents.length ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.25em] text-slate-500">
                  <th className="border-b border-slate-200 px-4 py-3">Action</th>
                  <th className="border-b border-slate-200 px-4 py-3">User</th>
                  <th className="border-b border-slate-200 px-4 py-3">Issue</th>
                  <th className="border-b border-slate-200 px-4 py-3">Case</th>
                  <th className="border-b border-slate-200 px-4 py-3">Content Key</th>
                  <th className="border-b border-slate-200 px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((item) => (
                  <tr key={item.id} className="text-sm text-slate-700">
                    <td className="border-b border-slate-100 px-4 py-4 font-medium">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.action === "like"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.action}
                      </span>
                    </td>
                    <td className="border-b border-slate-100 px-4 py-4">
                      <Link
                        href={`/admin/users/${item.user_id}/likes`}
                        className="font-medium text-[#0f9faa] hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="border-b border-slate-100 px-4 py-4">{item.issue_key}</td>
                    <td className="border-b border-slate-100 px-4 py-4">
                      {getCaseTitle(item.issue_key, item.case_key)}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-4">{item.content_key}</td>
                    <td className="border-b border-slate-100 px-4 py-4">
                      {formatDate(item.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            No activity found yet.
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Showing {recentEventsTotal ? (safeEventsPage - 1) * PAGE_SIZE + 1 : 0}-
            {Math.min(safeEventsPage * PAGE_SIZE, recentEventsTotal)} of {recentEventsTotal} events
          </p>

          <div className="flex items-center gap-3">
            <Link
              href={eventsHasPrevious ? pageHref({ eventsPage: safeEventsPage - 1 }) : "#"}
              aria-disabled={!eventsHasPrevious}
              tabIndex={eventsHasPrevious ? 0 : -1}
              className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                eventsHasPrevious
                  ? "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                  : "pointer-events-none cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
              }`}
            >
              Previous
            </Link>

            <span className="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
              Page {safeEventsPage} of {recentEventsTotalPages}
            </span>

            <Link
              href={eventsHasNext ? pageHref({ eventsPage: safeEventsPage + 1 }) : "#"}
              aria-disabled={!eventsHasNext}
              tabIndex={eventsHasNext ? 0 : -1}
              className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                eventsHasNext
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
  );
}
