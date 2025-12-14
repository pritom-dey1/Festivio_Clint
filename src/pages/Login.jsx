// src/pages/Login.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase.config";
import axios from "axios";
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import DarkVeil from "../components/Hero/DarkVeil";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ context import

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { setUser } = useAuth(); // ✅ context method
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ loading state
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const idToken = await userCredential.user.getIdToken();

      const res = await axios.post(
        "https://server-1kb7.onrender.com/api/auth/firebase-login",
        { firebaseToken: idToken },
        { withCredentials: true }
      );

      // ⭐ Update context immediately
      setUser(res.data.user);

      toast.success("Login Successful!");
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
      <DarkVeil />

      <motion.div
        className="absolute inset-0 flex items-center justify-center px-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="bg-[#0d0d14]/60 mt-20 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-3xl">
          <h2 className="text-3xl font-extrabold text-white text-center mb-8">Login</h2>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#1a1a2e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: true })}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading} // ✅ disable during login
              className={`w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-all duration-300 ${loading ? "cursor-not-allowed opacity-70" : ""}`}
            >
              {loading ? "Logging in..." : "Login"} {/* ✅ Loading text */}
            </button>
          </form>

          {/* OR separator */}
          <div className="flex items-center my-6">
            <hr className="flex-1 border-white/20" />
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <hr className="flex-1 border-white/20" />
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading} // ✅ disable during Google login
            className={`w-full py-3 flex items-center justify-center gap-2 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300 text-white font-medium ${loading ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <LogIn className="w-5 h-5" /> {loading ? "Logging in..." : "Login with Google"}
          </button>

          <p className="mt-6 text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link to="/auth" className="text-indigo-500 hover:text-indigo-400 font-medium transition-colors duration-200">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
