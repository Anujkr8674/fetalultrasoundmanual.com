import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "../../components/Navbar";
import { getAuthenticatedUserFromCookies } from "../../../lib/auth";
import PasswordField from "./PasswordField";

export const dynamic = "force-dynamic";

function getFeedback(searchParams) {
  const value = searchParams?.error || searchParams?.message || "";
  const map = {
    session_expired: "Your session expired. Please login again.",
    logged_out: "You have been logged out successfully.",
    password_reset_success: "Password reset successful. You can login now.",
    password_changed: "Password updated successfully. Please login again.",
    login_required_for_like: "Please login to like this case.",
  };

  return map[value] || value;
}

function getSafeRedirectPath(value) {
  const redirectTo = String(value || "").trim();
  if (!redirectTo.startsWith("/")) {
    return "/user/dashboardoverview";
  }
  return redirectTo;
}

export default async function UserLoginPage({ searchParams }) {
  const currentUser = await getAuthenticatedUserFromCookies();
  if (currentUser) {
    redirect(getSafeRedirectPath(searchParams?.redirectTo));
  }

  const feedback = getFeedback(searchParams);
  const redirectTo = getSafeRedirectPath(searchParams?.redirectTo);

  return (
    <>
      <Navbar forceShow />
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-10 sm:px-6 lg:px-8"
        style={{
          backgroundImage: "url('https://fetalultrasoundmanual.com/assets/bg-images/bg.png')",
        }}
      >
        <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-2xl items-center justify-center">
          <section className="w-full rounded-[32px] border border-slate-200 bg-white/95 p-2 shadow-[0_25px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-6 md:w-[80%]">
            <div className="mx-auto max-w-md">
              <div className="mb-6 text-center">
                <p className="inline-flex rounded-full bg-[#e6fbff] px-4 py-2 text-sm font-medium text-[#06606d]">
                  User authentication
                </p>
                <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Login to your account
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Enter your email and password to continue.
                </p>
              </div>

              {feedback ? (
                <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {feedback}
                </div>
              ) : null}

              <form action="/api/userapi/login" method="post" className="space-y-4">
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="ram123@gmail.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#39c7d4] focus:bg-white"
                  />
                </div>
                <PasswordField />

                <button
                  type="submit"
                  className="w-full rounded-md border-2 border-[#d5a062] px-4 py-3 text-base font-light text-black transition duration-200 hover:bg-[#d5a062] hover:text-white"
                >
                  Login
                </button>
              </form>

              <div className="mt-5 flex items-center justify-between text-sm">
                <Link href="/user/signup" className="font-medium text-[#2366c1] hover:underline">
                  Create account
                </Link>
                <Link
                  href="/user/forgotpassword"
                  className="font-medium text-[#2366c1] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
