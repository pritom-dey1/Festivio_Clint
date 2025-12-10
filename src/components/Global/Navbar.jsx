import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Logo from '../../assets/Logo.png'
import LogoutButton from "./LogoutButton"
export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)


  return (
    <header className="fixed top-[2%]  max-w-7xl mx-auto left-0 right-0 z-50">
      <div className="backdrop-blur-3xl bg-white/30 rounded-[5px] px-4 py-3">
          <div >
            <div className="w-full flex">
        <div className="w-[20%] flex ">
                <Link to="/" >
                <img src={Logo} alt="logo" className='w-12' />
              </Link>
        </div>

<div className="w-[60%] flex justify-center items-center ">
                  <nav className="flex text-white uppercase gap-6" >
                <Link to="/" >Home</Link>
                <Link to="/about" >about</Link>
                <Link to="/clubs" >Clubs</Link>
                <Link to="/events" >Events</Link>
              </nav>
            </div>

            <div className="flex items-center gap-4 justify-end w-[20%]">
              <div className="hidden md:flex items-center space-x-3">
                {!loading && !user && (
                  <>
                   <Link
  to="/auth/login"
  className="px-6 py-3 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-300 uppercase"
>
  Login
</Link>

<Link
  to="/auth"
  className="p-5 py-3 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition duration-300 uppercase"
>
  Register
</Link>

                  </>
                )}

                {!loading && user && (
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(prev => !prev)}
                      className="flex items-center gap-2 focus:outline-none"
                      aria-haspopup="true"
                      aria-expanded={profileOpen}
                    >
                      <img
                        src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=ddd&color=444`}
                        alt="avatar"
                        className="w-9 h-9 rounded-full object-cover border"
                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=ddd&color=444` }}
                      />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg py-1">
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                        <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
   <LogoutButton></LogoutButton>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={() => setMobileOpen(prev => !prev)}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-4 py-3 space-y-2">
              <Link to="/" onClick={() => setMobileOpen(false)} className="block text-gray-700">Home</Link>
              <Link to="/clubs" onClick={() => setMobileOpen(false)} className="block text-gray-700">Clubs</Link>
              <Link to="/events" onClick={() => setMobileOpen(false)} className="block text-gray-700">Events</Link>

              {!loading && !user && (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-gray-700">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block text-indigo-600">Register</Link>
                </>
              )}

              {!loading && user && (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="block text-gray-700">Profile</Link>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block text-gray-700">Dashboard</Link>
                 <LogoutButton></LogoutButton>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
