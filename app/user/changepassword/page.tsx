import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUserFromCookies } from "../../../lib/auth";
import PasswordField from "../login/PasswordField";

export const dynamic = "force-dynamic";

export default async function ChangePasswordPage({ searchParams }) {
  const user = await getAuthenticatedUserFromCookies();
  if (!user) {
    redirect("/user/login?error=session_expired");
  }

  const value = searchParams?.message || searchParams?.error || "";
  const map = {
    session_expired: "Your session expired. Please login again.",
    password_changed: "Password updated successfully. Please login again.",
  };
  const message = map[value] || value;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1698a7]">
          Change Password
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Refresh your password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          For security, changing your password will end the current session.
        </p>

        {message ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {message}
          </div>
        ) : null}

        <form action="/api/userapi/change-password" method="post" className="mt-6 space-y-4">
          <PasswordField
            name="currentPassword"
            label="Current password"
            placeholder="Enter current password"
            autoComplete="current-password"
          />
          <PasswordField
            name="newPassword"
            label="New password"
            placeholder="Create a new password"
            autoComplete="new-password"
          />
          <PasswordField
            name="confirmPassword"
            label="Confirm password"
            placeholder="Repeat new password"
            autoComplete="new-password"
          />
          <button
            type="submit"
            // className="w-full rounded-2xl bg-gradient-to-r from-[#27c7d2] to-[#7ee4ec] px-4 py-3 font-semibold text-slate-950 transition hover:opacity-95"
          className="w-full text-base border-2 border-[#d5a062] rounded-md px-4 py-3 font-light text-black transition duration-200 hover:bg-[#d5a062] hover:text-white"
          >
            Update password
          </button>
        </form>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-[#d5a062] p-6 text-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <h2 className="text-2xl font-semibold">Security notes</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-white/85">
          <li>- Current password is required.</li>
          <li>- New password must be strong.</li>
          <li>- You will be redirected to login after save.</li>
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/user/myprofile"
            className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            My Profile
          </Link>
          <Link
            href="/user/dashboardoverview"
            className="rounded-2xl border border-white/30 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Back to overview
          </Link>
        </div>
      </section>
    </div>
  );
}
