import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../assets/Logo.png";
import LogoutButton from "./LogoutButton";
import ProfileModal from "./ProfileModal";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const { t } = useTranslation();

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

            <div className="flex items-center w-[20%]">
              <Link to="/" className="flex items-center">
                <img src={Logo} alt="logo" className="w-12" />
              </Link>
            </div>

            <div className="flex w-[60%] justify-center">
              <nav className="hidden md:flex gap-8 text-white uppercase font-medium">
                <Link to="/">{t("navbar.home")}</Link>
                <Link to="/about">{t("navbar.about")}</Link>
                <Link to="/clubs">{t("navbar.clubs")}</Link>
                <Link to="/events">{t("navbar.events")}</Link>
              </nav>
            </div>

            <div className="w-[20%] h-full flex items-center justify-end gap-3">

              <div className="hidden md:flex items-center gap-4">
                {!user && !loading && (
                  <>
                    <Link
                      to="/auth/login"
                      className="px-5 py-3 rounded-md bg-gray-200 text-gray-800 font-semibold uppercase text-sm"
                    >
                      {t("navbar.login")}
                    </Link>

                    <Link
                      to="/auth"
                      className="px-5 py-3 rounded-md bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold uppercase text-sm register"
                    >
                      {t("navbar.register")}
                    </Link>
                  </>
                )}

                {user && !loading && (
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
              </div>

              <button
                className="md:hidden p-2 rounded"
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                {mobileOpen ? (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="md:hidden mt-3 bg-black/50 flex flex-col items-center shadow rounded-md px-4 py-3 space-y-2">

              <Link to="/" onClick={() => setMobileOpen(false)}>{t("navbar.home")}</Link>
              <Link to="/about" onClick={() => setMobileOpen(false)}>{t("navbar.about")}</Link>
              <Link to="/clubs" onClick={() => setMobileOpen(false)}>{t("navbar.clubs")}</Link>
              <Link to="/events" onClick={() => setMobileOpen(false)}>{t("navbar.events")}</Link>

              {!user && !loading && (
                <>
                  <Link
                    to="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    
                  >
                    {t("navbar.login")}
                  </Link>

                  <Link
                    to="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="px-5 py-3 rounded-md bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold uppercase text-sm register"
                  >
                    {t("navbar.register")}
                  </Link>
                </>
              )}

              {user && !loading && (
                <>
                  <button
                    onClick={() => {
                      setProfileModalOpen(true);
                      setMobileOpen(false);
                    }}
                    className="block text-center w-full"
                  >
                    Edit Profile
                  </button>

                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <LogoutButton />
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {profileModalOpen && (
        <ProfileModal close={() => setProfileModalOpen(false)} />
      )}
    </>
  );
}
