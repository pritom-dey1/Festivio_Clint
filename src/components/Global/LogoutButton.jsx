import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase.config";
import axios from "axios";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      await signOut(auth);

      navigate("/"); 
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="
        flex items-center gap-2 
        px-5 py-2.5 
        bg-transparent
        text-red-500 font-medium
        rounded-xl
        shadow-red-600/20
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
