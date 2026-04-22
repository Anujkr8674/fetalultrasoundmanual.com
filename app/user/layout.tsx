import { getAuthenticatedUserFromCookies } from "../../lib/auth";
import UserShell from "./components/UserShell";

export const dynamic = "force-dynamic";

export default async function UserLayout({ children }) {
  const user = await getAuthenticatedUserFromCookies();

  return <UserShell user={user}>{children}</UserShell>;
}
