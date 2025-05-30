// app/components/Navbar.tsx
import Link from "next/link";
import { getUserFromCookie } from "@/lib/getUser";
import { logout } from "@/actions/userController";



const Header = async () => {
  const user = await getUserFromCookie();

  return (
    <header className="bg-base-300 shadow-md">
      <div className="container mx-auto">
        <div className="navbar shadow-sm">
          <div className="flex-1">
            <Link href="/" className="btn btn-ghost text-xl">
              Haiku App
            </Link>
          </div>

          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              {!user ? (
                <li>
                  <Link href="/login">Log In</Link>
                </li>
              ) : (
                <li>
                  <form action={logout}>
                    <button type="submit">Log Out</button>
                  </form>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
