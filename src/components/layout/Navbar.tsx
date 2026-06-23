import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { SearchBar } from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/Button";

const nav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/compare", label: "Compare" },
  { to: "/watchlist", label: "Watchlist" },
];

export function Navbar() {
  const { user, authEnabled, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink-900/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3.5 sm:gap-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-line-strong font-serif text-lg">
            S
          </span>
          <span className="font-serif text-xl tracking-tight">Strata</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `focus-ring rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  isActive ? "text-chalk" : "text-fog hover:text-haze"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden w-full max-w-sm sm:block">
          <SearchBar compact />
        </div>

        {authEnabled ? (
          user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-fog lg:inline">{user.email}</span>
              <Button variant="ghost" onClick={() => signOut()}>
                Sign out
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => navigate("/login")} className="shrink-0">
              Sign in
            </Button>
          )
        ) : null}
      </div>
      <div className="px-5 pb-3 sm:hidden">
        <SearchBar compact />
      </div>
    </header>
  );
}
