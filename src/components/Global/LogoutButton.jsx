// src/components/LogoutButton.jsx
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase.config";
import axios from "axios";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
  const handleLogout = async () => {
    await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    await signOut(auth);
  };

  return (
    <button
      onClick={handleLogout}
      className="
        flex items-center gap-2 
        px-5 py-2.5 
        bg-gradient-to-r from-red-500 to-red-600 
        hover:from-red-600 hover:to-red-700
        text-white font-medium
        rounded-xl
        shadow-lg shadow-red-600/20
        transition-all duration-300
        active:scale-95
      "
    >
      <FiLogOut className="text-xl" />
      Logout
    </button>
  );
};

export default LogoutButton;
