import { NavLink } from "react-router";
import logo from "../assets/logo.svg";
import { useAuth } from "../context/useAuth";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const displayName = user?.email || user?.name || "Logged in";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="site-navbar sticky top-0 z-50">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3 sm:px-7 lg:gap-8">
        <NavLink to="/" className="site-brand flex shrink-0 items-center gap-2.5" aria-label="Evendule home">
          <img src={logo} alt="" className="w-10 h-10" />
          <span className="text-xl font-bold tracking-tight text-white">Evendule</span>
        </NavLink>

        <div className="hidden lg:flex flex-1 justify-center">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `site-nav-link ${isActive ? "is-active" : ""}`}
          >
            Explore events
          </NavLink>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <NavLink to="/events/create" className="site-action-primary">
                <span className="hidden sm:inline">Create event</span>
                <span className="sm:hidden">Create</span>
              </NavLink>

              <div className="site-nav-divider hidden lg:block" aria-hidden="true" />

              <div className="site-account flex items-center gap-2.5" title={displayName}>
                <span className="site-account-avatar" aria-hidden="true">{initial}</span>
                <div className="hidden xl:flex flex-col text-left leading-tight">
                  <span className="site-account-label">SIGNED IN AS</span>
                  <span className="site-account-email">{displayName}</span>
                </div>
              </div>
              <button type="button" onClick={logout} className="site-action-secondary">
                <span className="hidden sm:inline">Log out</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/sign-in" className="site-action-secondary">Sign in</NavLink>
              <NavLink to="/sign-up" className="site-action-primary">
                <span className="hidden sm:inline">Create account</span>
                <span className="sm:hidden">Sign up</span>
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
