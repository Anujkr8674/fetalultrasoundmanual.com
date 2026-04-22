import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminSignupPage() {
  redirect("/admin/login?error=admin_signup_disabled");
}
