import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../assets/Logo.png";
import LogoutButton from "./LogoutButton";
import ProfileModal from "./ProfileModal";

export default function Navbar() {
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-4">
        <div className="max-w-7xl mx-auto backdrop-blur-2xl bg-white/30 rounded-md px-5 py-3 mt-3 shadow">

          <div className="flex items-center justify-between w-full">

            {/* LEFT - LOGO */}
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="logo" className="w-12" />
            </Link>

            {/* CENTER - NAV LINKS (Desktop) */}
            <nav className="hidden md:flex gap-8 text-white uppercase font-medium">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/clubs">Clubs</Link>
              <Link to="/events">Events</Link>
            </nav>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-4">

              {/* If not logged in */}
              {!loading && !user && (
                <>
                  <Link
                    to="/auth/login"
                    className="px-5 py-2 rounded-md bg-gray-200 text-gray-800 font-semibold uppercase text-sm"
                  >
                    Login
                  </Link>

                  <Link
                    to="/auth"
                    className="px-5 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold uppercase text-sm"
                  >
                    Register
                  </Link>
                </>
              )}

              {/* If logged in */}
              {!loading && user && (
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center"
                  >
                    <img
                      src={user.photoURL}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover border shadow"
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border py-2">
                      
                      <button
                        onClick={() => {
                          setProfileModalOpen(true);
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Edit Profile
                      </button>

                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>

                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>

                      <LogoutButton />
                    </div>
                  )}
                </div>
              )}

              {/* MOBILE MENU BUTTON */}
              <button
                className="md:hidden p-2 rounded hover:bg-gray-100"
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                {mobileOpen ? (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* MOBILE MENU DROPDOWN */}
          {mobileOpen && (
            <div className="md:hidden mt-3 bg-white shadow rounded-md px-4 py-3 space-y-2">
              <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/about" onClick={() => setMobileOpen(false)}>About</Link>
              <Link to="/clubs" onClick={() => setMobileOpen(false)}>Clubs</Link>
              <Link to="/events" onClick={() => setMobileOpen(false)}>Events</Link>

              {!loading && !user && (
                <>
                  <Link to="/auth/login" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/auth" onClick={() => setMobileOpen(false)} className="text-indigo-600">Register</Link>
                </>
              )}

              {!loading && user && (
                <>
                  <button
                    onClick={() => {
                      setProfileModalOpen(true);
                      setMobileOpen(false);
                    }}
                    className="block text-left w-full"
                  >
                    Edit Profile
                  </button>

                  <Link to="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link>

                  <LogoutButton />
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* MODAL */}
      {profileModalOpen && (
        <ProfileModal close={() => setProfileModalOpen(false)} />
      )}
    </>
  );
}
