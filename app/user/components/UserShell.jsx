"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const authRoutes = ["/user/login", "/user/signup", "/user/forgotpassword"];

const navItems = [
  {
    href: "/user/dashboardoverview",
    label: "Overview",
    description: "Snapshot and quick actions",
  },
  {
    href: "/user/mylikes",
    label: "Liked Videos",
    description: "View Likes details",
  },
   {
    href: "/user/mylikeshistory",
    label: "Like History",
    description: "View Likes History details",
  },
  {
    href: "/user/myprofile",
    label: "My Profile",
    description: "View account details",
  },
  {
    href: "/user/editprofile",
    label: "Edit Profile",
    description: "Update your details",
  },
  {
    href: "/user/changepassword",
    label: "Change Password",
    description: "Refresh your security",
  },

   {
    href: "https://fetalultrasoundmanual.com/",
    label: "Website",
    description: "go to Website",
  },
];

function isActive(pathname, href) {
  return pathname === href || pathname?.startsWith(`${href}/`);
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path fill="currentColor" d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" />
    </svg>
  );
}

function SidebarContent({ user, pathname, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1698a7]">
          User Dashboard
        </p>
        <h3 className="mt-2 text-xl font-semibold leading-tight text-slate-900 sm:text-2xl">
          Welcome&nbsp;
          <span className="font-bold text-[#d5a062]">{user?.name || "Welcome"}</span>
          &nbsp; to FOGSI Practical Fetal Ultrasound
        </h3>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <nav className="mt-5 space-y-2">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`group block rounded-2xl border px-4 py-3 transition ${
                  active
                    ? "border-[#22c4cf] bg-[#e8fbfd] text-slate-950 shadow-sm"
                    : "border-transparent bg-slate-50 text-slate-700 hover:border-slate-200 hover:bg-white"
                }`}
              >
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="mt-1 text-xs text-slate-500 group-hover:text-slate-600">
                  {item.description}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* <div className="mt-5 rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#0f9faa_0%,#23c7d2_100%)] p-5 text-white">
          <p className="text-sm/6 text-white/90">Session status</p>
          <p className="mt-2 text-xl font-semibold">JWT protected</p>
          <p className="mt-2 text-sm text-white/85">
            Logging out destroys the current session token version.
          </p>
        </div> */}
      </div>

      <div className="mt-auto pt-5">
        <form action="/api/userapi/logout" method="post">
          <button
            type="submit"
            className="w-full rounded-2xl border border-red-500 bg-white px-4 py-3 font-semibold text-red-500 transition duration-200 hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}

export default function UserShell({ user, children }) {
  const pathname = usePathname();
  const normalizedPathname = pathname?.replace(/\/$/, "") || "";
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [normalizedPathname]);

  if (authRoutes.includes(normalizedPathname)) {
    return children;
  }

  const currentLabel = navItems.find((item) => isActive(normalizedPathname, item.href))?.label || "Overview";

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#eefcff_0%,#f8fbfc_45%,#ffffff_100%)] text-slate-900">
      <div
        className="mx-auto grid min-h-screen gap-6 bg-cover bg-center bg-no-repeat px-4 py-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6"
        style={{
          backgroundImage: "url('https://fetalultrasoundmanual.com/assets/bg-images/bg.png')",
        }}
      >
        <aside className="hidden overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:sticky lg:top-6 lg:block lg:h-[calc(100vh-3rem)] lg:p-5">
          <SidebarContent user={user} pathname={normalizedPathname} />
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
            aria-label="Close sidebar overlay"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <aside
          className={`fixed left-0 top-0 z-50 h-screen w-[300px] transform rounded-r-[28px] border border-slate-200 bg-white/95 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl transition-transform duration-300 lg:hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent
            user={user}
            pathname={normalizedPathname}
            onNavigate={() => setMobileOpen(false)}
          />
        </aside>

        <main className="flex min-w-0 flex-col gap-6">
          <header className="rounded-[28px] border border-slate-200 bg-white/90 px-5 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 lg:hidden"
                  aria-label="Open sidebar"
                  onClick={() => setMobileOpen(true)}
                >
                  <MenuIcon />
                </button>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1698a7]">
                    FOGSI Dashboard
                  </p>
                  <h2 className="mt-2 truncate text-xl font-semibold text-slate-900">
                    {currentLabel}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600 sm:block">
                  {user?.email || "Signed in user"}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f9faa] text-base font-semibold text-white">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </header>

          <section className="min-w-0">{children}</section>
        </main>
      </div>
    </div>
  );
}
