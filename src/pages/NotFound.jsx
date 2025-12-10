import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">

      {/* Animated Gradient Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-gradient-to-br from-purple-700 via-blue-700 to-black blur-3xl"
      />

      {/* Floating Lights */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
        }}
        className="absolute top-10 left-10 w-40 h-40 bg-purple-600 rounded-full blur-2xl opacity-40"
      />

      <motion.div
        animate={{
          y: [0, 20, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
        }}
        className="absolute bottom-20 right-20 w-32 h-32 bg-blue-600 rounded-full blur-2xl opacity-40"
      />

      {/* 404 Content */}
      <div className="relative z-10 text-center text-white px-6">
        <h1 className="text-9xl font-extrabold drop-shadow-xl">404</h1>
        <p className="text-xl mt-4 opacity-80">Oops! The page you are looking for doesn’t exist.</p>
        <p className="text-sm opacity-60 mt-1">Maybe it moved… or maybe you're lost inside Fastivio’s universe.</p>

        <Link
          to="/"
          className="inline-block mt-8 px-6 py-3 bg-purple-700 hover:bg-purple-800 rounded-full font-medium shadow-lg transition-all duration-300"
        >
          Go Back Home
        </Link>
      </div>

    </div>
  );
}
