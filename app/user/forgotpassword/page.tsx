import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUserFromCookies } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export default async function UserForgotPasswordPage({ searchParams }) {
  const currentUser = await getAuthenticatedUserFromCookies();
  if (currentUser) {
    redirect("/user/dashboardoverview");
  }

  const message = searchParams?.message || searchParams?.error || "";
  const token = searchParams?.token || "";
  const fullName = searchParams?.name || "";

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-10 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('https://fetalultrasoundmanual.com/assets/bg-images/bg.png')",
      }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center justify-center">
        <section className="w-full md:w-[80%] mx-auto rounded-[32px] border border-slate-200 bg-white/95 p-2 shadow-[0_25px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-6">
          <div className="mx-auto max-w-md">
            <div className="mb-6 text-center">
              <p className="inline-flex rounded-full bg-[#e6fbff] px-4 py-2 text-sm font-medium text-[#06606d]">
                Forgot password
              </p>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Reset your place
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Generate a token, then use it to set a new place value.
              </p>
            </div>

            {message ? (
              <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {message}
              </div>
            ) : null}

            {token ? (
              <div className="mb-5 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
                Reset token: <span className="break-all font-mono">{token}</span>
              </div>
            ) : null}

            <div className="space-y-6">
              <form action="/api/userapi/forgot-password" method="post" className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    defaultValue={fullName}
                    placeholder="Enter registered full name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#39c7d4] focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={Boolean(token)}
                  className={`w-full rounded-2xl border px-4 py-3 font-medium transition duration-200 ${
                    token
                      ? "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-500"
                      : "border-[#d5a062] text-slate-900 hover:bg-[#d5a062] hover:text-white"
                  }`}
                >
                  {token ? "Token generated" : "Generate token"}
                </button>
              </form>

              <form action="/api/userapi/reset-password" method="post" className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    defaultValue={fullName}
                    placeholder="Registered full name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#39c7d4] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Reset token</label>
                  <input
                    name="token"
                    type="text"
                    required
                    placeholder="Paste token here"
                    defaultValue={token}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#39c7d4] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">New place</label>
                  <input
                    name="newPlace"
                    type="text"
                    required
                    placeholder="Enter new place text"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#39c7d4] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Confirm place
                  </label>
                  <input
                    name="confirmPlace"
                    type="text"
                    required
                    placeholder="Repeat place text"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#39c7d4] focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-2xl border border-[#d5a062] px-4 py-3 font-medium text-slate-900 transition duration-200 hover:bg-[#d5a062] hover:text-white"
                >
                  Set new place
                </button>
              </form>
            </div>

            <div className="mt-5 text-center text-sm">
              <Link href="/user/login" className="font-medium text-[#2366c1] hover:underline">
                Back to login
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
