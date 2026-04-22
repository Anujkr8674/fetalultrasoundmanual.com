import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "../../components/Navbar";
import { getAuthenticatedUserFromCookies } from "../../../lib/auth";

export const dynamic = "force-dynamic";

function messageFrom(searchParams) {
  const error = searchParams?.error;
  const message = searchParams?.message;
  return error || message || "";
}

const genderOptions = ["Male", "Female", "Other"];

export default async function UserSignupPage({ searchParams }) {
  const currentUser = await getAuthenticatedUserFromCookies();
  if (currentUser) {
    redirect("/user/dashboardoverview");
  }

  const feedback = messageFrom(searchParams);

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
          <section className="w-full rounded-[32px] border border-slate-200 bg-white/95 p-4 shadow-[0_25px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-6">
            <div className="mx-auto max-w-md">
              <div className="mb-6 text-center">
                <p className="inline-flex rounded-full bg-[#e6fbff] px-4 py-2 text-sm font-medium text-[#06606d]">
                  Create account
                </p>
                <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Signup in seconds
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Enter your details to create a secure user account.
                </p>
              </div>

              {feedback ? (
                <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {feedback}
                </div>
              ) : null}

              <form action="/api/userapi/signup" method="post" className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={120}
                    autoComplete="name"
                    placeholder="Enter your name"
                    pattern="[A-Za-z][A-Za-z\s.'-]*"
                    title="Use letters only, with spaces allowed."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#39c7d4] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={191}
                    autoComplete="email"
                    placeholder="ram123@gmail.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#39c7d4] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{7,15}"
                    placeholder="Digits only, optional"
                    title="Use digits only, 7 to 15 numbers."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#39c7d4] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Gender</label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {genderOptions.map((option) => (
                      <label
                        key={option}
                        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-[#39c7d4] hover:bg-white"
                      >
                        <input
                          name="gender"
                          type="radio"
                          value={option}
                          required
                          className="h-4 w-4 accent-[#39c7d4]"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    maxLength={128}
                    autoComplete="new-password"
                    placeholder="Min 8 chars, mixed case, number, symbol"
                    title="Minimum 8 characters with uppercase, lowercase, number, and symbol."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#39c7d4] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Confirm password
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    maxLength={128}
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#39c7d4] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl border-2 border-[#d5a062] px-4 py-3 text-base font-semibold text-slate-900 transition duration-200 hover:bg-[#d5a062] hover:text-white"
                >
                  Create account
                </button>
              </form>

              <div className="mt-5 text-center text-sm">
                <Link href="/user/login" className="font-medium text-[#2366c1] hover:underline">
                  Already have an account? Login
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
