// src/pages/Register.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  getIdToken, 
  signInWithPopup 
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase.config";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import DarkVeil from "../components/Hero/DarkVeil";
import { useAuth } from "../context/AuthContext"; // ✅ import context

const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { setUser } = useAuth(); // ✅ context method
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // loading state

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Firebase registration
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Update profile
      await updateProfile(user, {
        displayName: data.name,
        photoURL: data.photoURL || ""
      });

      // Get Firebase ID token
      const idToken = await getIdToken(user, true);

      // Send token to backend
      const res = await axios.post(
        "https://server-1kb7.onrender.com/api/auth/firebase-login",
        { firebaseToken: idToken },
        { withCredentials: true }
      );

      // ⭐ Update context immediately
      setUser(res.data.user);

      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const res = await axios.post(
        "https://server-1kb7.onrender.com/api/auth/firebase-login",
        { firebaseToken: idToken },
        { withCredentials: true }
      );

      // ⭐ Update context immediately
      setUser(res.data.user);

      toast.success("Google Login Successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Dark Background */}
      <DarkVeil />

      {/* Register Form */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center px-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="bg-[#0d0d14]/70 backdrop-blur-md mt-30 p-10 rounded-2xl shadow-2xl w-full max-w-3xl">
          <h2 className="text-3xl font-extrabold uppercase mb-2 text-white text-center">Register</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Name"
                {...register("name", { required: true })}
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#1a1a2e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#1a1a2e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: true, minLength: 6 })}
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#1a1a2e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Photo URL */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Photo URL (optional)"
                {...register("photoURL")}
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#1a1a2e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-all duration-300 ${loading ? "cursor-not-allowed opacity-70" : ""}`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* OR separator */}
          <div className="flex items-center my-3">
            <hr className="flex-1 border-white/20" />
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <hr className="flex-1 border-white/20" />
          </div>

          {/* Google Register */}
          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className={`w-full py-3 flex items-center justify-center gap-2 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300 text-white font-medium ${loading ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <LogIn className="w-5 h-5" /> {loading ? "Registering..." : "Register with Google"}
          </button>

          {/* Login link */}
          <p className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-indigo-500 hover:text-indigo-400 font-medium transition-colors duration-200"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
