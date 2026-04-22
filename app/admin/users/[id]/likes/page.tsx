import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAuthenticatedAdminFromCookies } from "../../../../../lib/auth";
import { query } from "../../../../../lib/db";

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

export default async function AdminUserLikeHistoryPage({ params, searchParams }) {
  const admin = await getAuthenticatedAdminFromCookies();
  if (!admin) {
    redirect("/admin/login?error=session_expired");
  }

  const users = await query(
    "SELECT id, name, email, phone, gender, created_at FROM users WHERE id = ? LIMIT 1",
    [params.id]
  );

  const user = users[0];
  if (!user) {
    notFound();
  }

  const likesPage = getPageNumber(searchParams, "likesPage");
  const eventsPage = getPageNumber(searchParams, "eventsPage");

  const [activeLikesTotalRows, likeHistoryTotalRows] = await Promise.all([
    query("SELECT COUNT(*) AS count FROM case_likes WHERE user_id = ?", [user.id]),
    query("SELECT COUNT(*) AS count FROM case_like_events WHERE user_id = ?", [user.id]),
  ]);

  const activeLikesTotal = Number(activeLikesTotalRows[0]?.count || 0);
  const likeHistoryTotal = Number(likeHistoryTotalRows[0]?.count || 0);

  const activeLikesTotalPages = Math.max(1, Math.ceil(activeLikesTotal / PAGE_SIZE));
  const likeHistoryTotalPages = Math.max(1, Math.ceil(likeHistoryTotal / PAGE_SIZE));
  const safeLikesPage = Math.min(likesPage, activeLikesTotalPages);
  const safeEventsPage = Math.min(eventsPage, likeHistoryTotalPages);
  const activeLikesHasPrevious = safeLikesPage > 1;
  const activeLikesHasNext = safeLikesPage < activeLikesTotalPages;
  const historyHasPrevious = safeEventsPage > 1;
  const historyHasNext = safeEventsPage < likeHistoryTotalPages;

  const [activeLikes, likeHistory] = await Promise.all([
    query(
      `SELECT issue_key, case_key, content_key, created_at AS liked_at
       FROM case_likes
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [user.id, PAGE_SIZE, (safeLikesPage - 1) * PAGE_SIZE]
    ),
    query(
      `SELECT id, issue_key, case_key, content_key, action, created_at
       FROM case_like_events
       WHERE user_id = ?
       ORDER BY created_at DESC, id DESC
       LIMIT ? OFFSET ?`,
      [user.id, PAGE_SIZE, (safeEventsPage - 1) * PAGE_SIZE]
    ),
  ]);

  const pageHref = (likesPageNumber, eventsPageNumber) =>
    `/admin/users/${user.id}/likes?likesPage=${likesPageNumber}&eventsPage=${eventsPageNumber}`;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#6f63ff_0%,#8f7dff_100%)] p-6 text-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
          User Like Tracking
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">{user.name}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
          Track which cases this user liked, when they liked them, and the full like/unlike
          activity history.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Email</p>
          <p className="mt-2 break-all text-lg font-semibold text-slate-900">{user.email}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Phone</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{user.phone || "N/A"}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Current likes</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{activeLikesTotal}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Total events</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{likeHistoryTotal}</p>
        </article>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7e63ff]">
              Active Likes
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Currently liked cases</h2>
          </div>
          <Link
            href={`/admin/users/${user.id}`}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            Back to user
          </Link>
        </div>

        {activeLikes.length ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.25em] text-slate-500">
                  <th className="border-b border-slate-200 px-4 py-3">Issue</th>
                  <th className="border-b border-slate-200 px-4 py-3">Case</th>
                  <th className="border-b border-slate-200 px-4 py-3">Content Key</th>
                  <th className="border-b border-slate-200 px-4 py-3">Liked At</th>
                </tr>
              </thead>
              <tbody>
                {activeLikes.map((item) => (
                  <tr key={item.content_key} className="text-sm text-slate-700">
                    <td className="border-b border-slate-100 px-4 py-4">{item.issue_key}</td>
                    <td className="border-b border-slate-100 px-4 py-4 font-medium">
                      {getCaseTitle(item.issue_key, item.case_key)}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-4">{item.content_key}</td>
                    <td className="border-b border-slate-100 px-4 py-4">
                      {formatDate(item.liked_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            No active likes found for this user.
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Showing {activeLikesTotal ? (safeLikesPage - 1) * PAGE_SIZE + 1 : 0}-
            {Math.min(safeLikesPage * PAGE_SIZE, activeLikesTotal)} of {activeLikesTotal} likes
          </p>

          <div className="flex items-center gap-3">
            <Link
              href={activeLikesHasPrevious ? pageHref(safeLikesPage - 1, safeEventsPage) : "#"}
              aria-disabled={!activeLikesHasPrevious}
              tabIndex={activeLikesHasPrevious ? 0 : -1}
              className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                activeLikesHasPrevious
                  ? "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                  : "pointer-events-none cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
              }`}
            >
              Previous
            </Link>

            <span className="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
              Page {safeLikesPage} of {activeLikesTotalPages}
            </span>

            <Link
              href={activeLikesHasNext ? pageHref(safeLikesPage + 1, safeEventsPage) : "#"}
              aria-disabled={!activeLikesHasNext}
              tabIndex={activeLikesHasNext ? 0 : -1}
              className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                activeLikesHasNext
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
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7e63ff]">
            Activity History
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Like and unlike events</h2>
        </div>

        {likeHistory.length ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.25em] text-slate-500">
                  <th className="border-b border-slate-200 px-4 py-3">Action</th>
                  <th className="border-b border-slate-200 px-4 py-3">Issue</th>
                  <th className="border-b border-slate-200 px-4 py-3">Case</th>
                  <th className="border-b border-slate-200 px-4 py-3">Content Key</th>
                  <th className="border-b border-slate-200 px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {likeHistory.map((item) => (
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
            No activity found for this user.
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Showing {likeHistoryTotal ? (safeEventsPage - 1) * PAGE_SIZE + 1 : 0}-
            {Math.min(safeEventsPage * PAGE_SIZE, likeHistoryTotal)} of {likeHistoryTotal} events
          </p>

          <div className="flex items-center gap-3">
            <Link
              href={historyHasPrevious ? pageHref(safeLikesPage, safeEventsPage - 1) : "#"}
              aria-disabled={!historyHasPrevious}
              tabIndex={historyHasPrevious ? 0 : -1}
              className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                historyHasPrevious
                  ? "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                  : "pointer-events-none cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
              }`}
            >
              Previous
            </Link>

            <span className="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
              Page {safeEventsPage} of {likeHistoryTotalPages}
            </span>

            <Link
              href={historyHasNext ? pageHref(safeLikesPage, safeEventsPage + 1) : "#"}
              aria-disabled={!historyHasNext}
              tabIndex={historyHasNext ? 0 : -1}
              className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                historyHasNext
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
