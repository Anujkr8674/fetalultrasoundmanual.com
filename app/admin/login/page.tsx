import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedAdminFromCookies } from "../../../lib/auth";
import PasswordField from "../../user/login/PasswordField";

export const dynamic = "force-dynamic";

function getMessage(searchParams) {
  const value = searchParams?.error || searchParams?.message || "";
  const map = {
    logged_out: "You have been logged out successfully.",
    password_changed: "Password updated successfully. Please login again.",
    session_expired: "Your session expired. Please login again.",
    admin_signup_disabled: "Admin signup is disabled. Use the fixed Admin ID.",
  };
  return map[value] || value;
}

export default async function AdminLoginPage({ searchParams }) {
  const admin = await getAuthenticatedAdminFromCookies();
  if (admin) {
    redirect("/admin/dashboardoverview");
  }

  const message = getMessage(searchParams);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-10 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('https://fetalultrasoundmanual.com/assets/bg-images/bg.png')",
      }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center justify-center">
        <section className="w-full rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8">
          <div className="mx-auto max-w-md">
            <div className="mb-6 text-center">
              <p className="inline-flex rounded-full bg-[#f1eeff] px-4 py-2 text-sm font-medium text-[#5e52d1]">
                Admin access
              </p>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Login to admin panel
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Use the fixed admin ID and password to access dashboard, users, and controls.
              </p>
            </div>

            {message ? (
              <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {message}
              </div>
            ) : null}

            <form action="/api/adminapi/login" method="post" className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Admin ID</label>
                <input
                  name="adminId"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="ADM00001"
                  maxLength={20}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#6f63ff] focus:bg-white"
                />
              </div>

              <PasswordField
                name="password"
                label="Password"
                placeholder="Your password"
                autoComplete="current-password"
              />

              <button
                type="submit"
                className="w-full rounded-2xl border-2 border-[#6f63ff] px-4 py-3 text-base font-semibold text-slate-900 transition duration-200 hover:bg-[#6f63ff] hover:text-white"
              >
                Login
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between text-sm">
              <Link href="/" className="font-medium text-[#5e52d1] hover:underline">
                Back home
              </Link>
              <div className="font-medium text-slate-500">ID: ADM00001</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
