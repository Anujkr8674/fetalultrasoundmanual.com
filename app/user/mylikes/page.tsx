import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUserFromCookies } from "../../../lib/auth";
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

function getPageNumber(searchParams) {
  const rawPage = searchParams?.page;
  const value = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const page = Number.parseInt(value || "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function MyLikesPage({ searchParams }) {
  const user = await getAuthenticatedUserFromCookies();
  if (!user) {
    redirect("/user/login?error=session_expired");
  }

  const currentPage = getPageNumber(searchParams);

  const [activeLikesTotalRows, likeHistory] = await Promise.all([
    query(
      `SELECT COUNT(*) AS count
       FROM case_likes cl
       WHERE cl.user_id = ?`,
      [user.id]
    ),
    query(
      `SELECT
         id,
         issue_key,
         case_key,
         content_key,
         action,
         created_at
       FROM case_like_events
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [user.id]
    ),
  ]);

  const totalLikes = Number(activeLikesTotalRows[0]?.count || 0);
  const totalPages = Math.max(1, Math.ceil(totalLikes / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const hasPrevious = safePage > 1;
  const hasNext = safePage < totalPages;

  const activeLikes = await query(
    `SELECT
       cl.id,
       cl.issue_key,
       cl.case_key,
       cl.content_key,
       cl.created_at AS liked_at,
       cl.updated_at
     FROM case_likes cl
     WHERE cl.user_id = ?
     ORDER BY cl.created_at DESC
     LIMIT ? OFFSET ?`,
    [user.id, PAGE_SIZE, (safePage - 1) * PAGE_SIZE]
  );

  const pageHref = (page) => `/user/mylikes?page=${page}`;

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-slate-200 bg-[#d5a062] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1698a7]">
          My Likes
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Liked cases and activity</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This page shows the cases you have liked, the time you liked them, and your like
          activity history.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <article className="rounded-3xl bg-slate-50 p-5">
            <div className="text-sm text-slate-500">User</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">{user.name}</div>
          </article>
          <article className="rounded-3xl bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Active likes</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">{totalLikes}</div>
          </article>
          <article className="rounded-3xl bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Last activity</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              {likeHistory[0] ? formatDate(likeHistory[0].created_at) : "N/A"}
            </div>
          </article>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1698a7]">
              Active Likes
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Cases you currently like</h2>
          </div>
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
                  <th className="border-b border-slate-200 px-4 py-3">Updated At</th>
                  <th className="border-b border-slate-200 px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {activeLikes.map((item) => (
                  <tr key={item.id} className="text-sm text-slate-700">
                    <td className="border-b border-slate-100 px-4 py-4 font-medium">
                      {item.issue_key}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-4">
                      <Link
                        href={`/${item.issue_key}/${item.case_key}`}
                        className="font-medium text-[#0f9faa] hover:underline"
                      >
                        {getCaseTitle(item.issue_key, item.case_key)}
                      </Link>
                    </td>
                    <td className="border-b border-slate-100 px-4 py-4">{item.content_key}</td>
                    <td className="border-b border-slate-100 px-4 py-4">{formatDate(item.liked_at)}</td>
                    <td className="border-b border-slate-100 px-4 py-4">
                      {formatDate(item.updated_at)}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-4">
                      <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                        Liked
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            You have not liked any cases yet.
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Showing {totalLikes ? (safePage - 1) * PAGE_SIZE + 1 : 0}-
            {Math.min(safePage * PAGE_SIZE, totalLikes)} of {totalLikes} likes
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
      </section>

      {/* <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1698a7]">
              Like History
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">All like activity</h2>
          </div>
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
                    <td className="border-b border-slate-100 px-4 py-4">{formatDate(item.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            No like activity found yet.
          </div>
        )}
      </section> */}
    </div>
  );
}
