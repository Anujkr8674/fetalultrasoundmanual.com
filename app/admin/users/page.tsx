import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedAdminFromCookies } from "../../../lib/auth";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

function getPageNumber(searchParams) {
  const rawPage = searchParams?.page;
  const value = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const page = Number.parseInt(value || "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function AdminUsersPage({ searchParams }) {
  const admin = await getAuthenticatedAdminFromCookies();
  if (!admin) {
    redirect("/admin/login?error=session_expired");
  }

  const currentPage = getPageNumber(searchParams);

  const totalRows = await query("SELECT COUNT(*) AS count FROM users");
  const totalUsers = Number(totalRows[0]?.count || 0);
  const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const hasPrevious = safePage > 1;
  const hasNext = safePage < totalPages;
  const users = await query(
    `SELECT id, name, email, phone, gender, created_at
     FROM users
     ORDER BY id DESC
     LIMIT ? OFFSET ?`,
    [PAGE_SIZE, (safePage - 1) * PAGE_SIZE]
  );

  const pageHref = (page) => `/admin/users?page=${page}`;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7e63ff]">
            User Profiles
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">All registered users</h1>
          <p className="mt-2 text-sm text-slate-600">
            Click any user to open the full profile view.
          </p>
        </div>
        <Link
          href="/admin/dashboardoverview"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
        >
          Back to overview
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">Email</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">Phone</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">Gender</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">{user.name}</td>
                  <td className="px-4 py-4 text-sm text-slate-600 break-all">{user.email}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{user.phone || "-"}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{user.gender || "-"}</td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="font-semibold text-[#7e63ff] hover:underline"
                      >
                        View profile
                      </Link>
                      <Link
                        href={`/admin/users/${user.id}/likes`}
                        className="font-semibold text-[#0f9faa] hover:underline"
                      >
                        Like history
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  );
}
