import AdminShell from "./components/AdminShell";
import { getAuthenticatedAdminFromCookies } from "../../lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const admin = await getAuthenticatedAdminFromCookies();
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
