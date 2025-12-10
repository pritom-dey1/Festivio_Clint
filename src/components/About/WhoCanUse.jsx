import React from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, MapPin, Briefcase } from "lucide-react";

const items = [
  { icon: <Users className="w-8 h-8 text-indigo-300" />, title: "Students", desc: "Find campus clubs, study groups, and campus activities." },
  { icon: <BookOpen className="w-8 h-8 text-purple-300" />, title: "Hobbyists", desc: "Photography, painting, hiking — discover peers who share your passion." },
  { icon: <MapPin className="w-8 h-8 text-pink-300" />, title: "Local Communities", desc: "Neighborhood groups and interest-based meetups." },
  { icon: <Briefcase className="w-8 h-8 text-indigo-200" />, title: "Professionals", desc: "Networking groups, workshops, and industry meetups." }
];

export default function WhoCanUse() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <motion.h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
        Who Can Use Fastivio?
      </motion.h2>

      <motion.div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {items.map((it, idx) => (
          <div key={idx} className="bg-[#0d0d14] border border-white/5 p-6 rounded-2xl text-center shadow-lg">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-700 to-pink-500 flex items-center justify-center shadow-md">
                {it.icon}
              </div>
            </div>
            <h4 className="text-white font-semibold">{it.title}</h4>
            <p className="text-gray-400 text-sm mt-2">{it.desc}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
