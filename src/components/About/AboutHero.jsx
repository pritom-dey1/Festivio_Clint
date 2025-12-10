import React from "react";
import { motion } from "framer-motion";
import { Star, Sparkles } from "lucide-react";

const float = {
  animate: { y: [-6, 6, -6], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } }
};

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#0f0f15]">
      {/* Soft radial glow */}
      <div className="absolute -left-40 -top-40 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-indigo-700/30 via-purple-600/20 to-pink-500/10 blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 py-28 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
            >
              About <span className="text-indigo-200">Fastivio</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6 }}
              className="mt-6 text-gray-300 max-w-xl"
            >
              We help people discover local clubs, join communities, and run events — all in one neon-lit,
              beautifully designed platform. Club managers can create clubs, members can register and pay, and admins
              oversee the platform.
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
              <div className="mt-8 flex gap-3">
                <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 shadow-lg text-white font-medium hover:scale-[1.02] transition">
                  Explore Clubs
                </button>
             
              </div>
            </motion.div>

            <div className="mt-8 flex gap-4 items-center text-sm text-gray-400">
              <motion.div className="flex items-center gap-2" {...float}>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-700 to-purple-600 flex items-center justify-center shadow-[0_10px_30px_rgba(124,58,237,0.12)]">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">1000+ Clubs</div>
                  <div className="text-xs opacity-70">Across many categories</div>
                </div>
              </motion.div>

              <motion.div className="flex items-center gap-2" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-700 to-pink-500 flex items-center justify-center shadow-[0_10px_30px_rgba(236,72,153,0.12)]">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">5000+ Members</div>
                  <div className="text-xs opacity-70">And growing every day</div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right illustration / floating cards */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-sm">
              <motion.div
                initial={{ rotate: -6, scale: 0.98, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="bg-gradient-to-br from-[#0d0d14]/60 to-[#0f0f15]/40 border border-white/5 rounded-2xl p-5 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">CS</div>
                  <div>
                    <div className="text-white font-semibold">Photography Club</div>
                    <div className="text-xs text-gray-400">Downtown Creatives • 340 members</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="h-24 rounded-lg bg-gradient-to-br from-indigo-700/30 to-purple-600/10 border border-white/5" />
                  <div className="h-24 rounded-lg bg-gradient-to-br from-pink-600/20 to-indigo-700/10 border border-white/5" />
                  <div className="h-24 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-500/10 border border-white/5" />
                </div>
              </motion.div>

              <motion.div
                animate={{ x: [-18, 18, -18], y: [-8, 8, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 -bottom-6 w-36 h-36 rounded-2xl bg-gradient-to-br from-pink-500/20 to-indigo-700/15 border border-pink-400/10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
