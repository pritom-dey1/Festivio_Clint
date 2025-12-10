import React from "react";
import { motion } from "framer-motion";
import { XCircle, ClipboardList, Clock } from "lucide-react";

const card = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } }
};

export default function ProblemSolve() {
  const problems = [
    { icon: <XCircle className="w-7 h-7 text-pink-400" />, title: "Discoverability", desc: "Many clubs are hidden across social platforms; users can’t easily find the  groups." },
    { icon: <ClipboardList className="w-7 h-7 text-indigo-400" />, title: "Fragmented Management", desc: "Clubs juggle spreadsheets, chats, and manual payments — leading to inefficiency." },
    { icon: <Clock className="w-7 h-7 text-purple-400" />, title: "Time-consuming", desc: "Members and managers waste time coordinating events and  attendance." }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}>
        <motion.h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          The Problem We Solve
        </motion.h2>
        <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12">
          ClubSphere centralizes discovery, management, and payments so communities thrive — not struggle.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((p, i) => (
            <motion.div key={i} variants={card} className="bg-[#0d0d14] border border-white/5 p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-20 h-12 rounded-lg bg-gradient-to-br from-indigo-700 to-purple-600 flex items-center justify-center shadow-md">
                  {p.icon}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{p.title}</h4>
                  <p className="text-gray-400 text-sm mt-1">{p.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
