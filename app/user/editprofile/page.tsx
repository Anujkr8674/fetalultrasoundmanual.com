import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUserFromCookies } from "../../../lib/auth";

export const dynamic = "force-dynamic";

function getMessage(searchParams) {
  const value = searchParams?.message || searchParams?.error || "";
  const map = {
    session_expired: "Your session expired. Please login again.",
  };
  return map[value] || value;
}

export default async function EditProfilePage({ searchParams }) {
  const user = await getAuthenticatedUserFromCookies();
  if (!user) {
    redirect("/user/login?error=session_expired");
  }

  const message = getMessage(searchParams);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1698a7]">
          Edit Profile
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Update your details</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Keep your full name and place updated.
        </p>

        {message ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {message}
          </div>
        ) : null}

        <form action="/api/userapi/profile" method="post" className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
            <input
              name="name"
              type="text"
              disabled
              required
              defaultValue={user.name}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-[#39c7d4] focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Place</label>
            <input
              name="place"
              type="text"
              disabled
              required
              defaultValue={user.place}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-[#39c7d4] focus:bg-white"
            />
          </div>
          <button
            type="submit"
            // className="w-full rounded-2xl bg-gradient-to-r from-[#27c7d2] to-[#7ee4ec] px-4 py-3 font-semibold text-slate-950 transition hover:opacity-95"
          className="w-full text-base border-2 border-[#d5a062] rounded-md px-4 py-3 font-light text-black transition duration-200 hover:bg-[#d5a062] hover:text-white"
          >
            Save changes
          </button>
        </form>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Guidelines</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
          <li>- Full name must stay unique in the system.</li>
          <li>- Place can be any text value.</li>
          <li>- Saving changes keeps the current session valid.</li>
          <li>- Use My Profile to review saved details after update.</li>
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/user/myprofile"
            // className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          className="text-base border-2 border-[#d5a062] rounded-md px-4 py-3 font-light text-black transition duration-200 hover:bg-[#d5a062] hover:text-white"
          >
            View profile
          </Link>
          <Link
            href="/user/changepassword"
            // className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          className="text-base border-2 border-[#d5a062] rounded-md px-4 py-3 font-light text-black transition duration-200 hover:bg-[#d5a062] hover:text-white"
          >
            Change password
          </Link>
        </div>
      </section>
    </div>
  );
}
