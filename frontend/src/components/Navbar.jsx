import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="border-b border-ink/10 bg-paper/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex flex-col leading-none group" onClick={() => setOpen(false)}>
            <span className="font-display text-2xl font-semibold tracking-tight group-hover:text-moss transition-colors">
              Marginalia
            </span>
            <span className="byline mt-1">Words, Worth Reading</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 font-body text-sm">
            <Link to="/" className="hover:text-moss transition-colors">
              Home
            </Link>
            {user && (
              <Link to="/dashboard" className="hover:text-moss transition-colors">
                Dashboard
              </Link>
            )}
            {user ? (
              <>
                <Link to="/create" className="btn-primary text-sm">
                  Write a post
                </Link>
                <button onClick={handleLogout} className="text-ink/60 hover:text-rust transition-colors">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-moss transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Get started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 -mr-2"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`h-px bg-ink transition-transform ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`h-px bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`h-px bg-ink transition-transform ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="md:hidden flex flex-col gap-1 pb-5 font-body text-sm border-t border-ink/10 pt-4">
            <Link to="/" className="py-2" onClick={() => setOpen(false)}>
              Home
            </Link>
            {user && (
              <Link to="/dashboard" className="py-2" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
            )}
            {user ? (
              <>
                <Link to="/create" className="py-2" onClick={() => setOpen(false)}>
                  Write a post
                </Link>
                <button onClick={handleLogout} className="py-2 text-left text-rust">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
                <Link to="/register" className="py-2" onClick={() => setOpen(false)}>
                  Get started
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
