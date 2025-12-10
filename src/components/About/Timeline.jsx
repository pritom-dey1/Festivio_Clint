import React from "react";
import { motion } from "framer-motion";

const timeline = [
  { year: "2024", title: "Idea & Prototype", desc: "ClubSphere concept and first MVP built." },
  { year: "2025", title: "Public Beta", desc: "Launched club discovery, membership, and events." },
  { year: "2026", title: "Manager Dashboard", desc: "Advanced management tools for club owners." },
  { year: "2027", title: "Community Growth", desc: "Scaling to support communities worldwide." }
];

export default function Timeline() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <motion.h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
        Milestones & Timeline
      </motion.h2>

      <div className="relative mx-auto max-w-4xl">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-indigo-600 to-pink-500 h-full rounded" />
        <div className="space-y-12">
          {timeline.map((t, i) => {
            const left = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`relative w-full md:w-1/2 ${left ? "md:left-0 md:pl-8 md:pr-6" : "md:ml-auto md:pr-8 md:pl-6"}`}
                style={{ clear: "both" }}
              >
                <div className={`md:absolute ${left ? "md:-left-56 md:text-right" : "md:-right-56 md:text-left"} top-0 md:w-48`}>
                  <div className="text-sm text-indigo-300 font-semibold">{t.year}</div>
                </div>

                <div className={`bg-[#0e0e14] border border-white/5 p-6 rounded-2xl shadow-xl ${left ? "md:ml-8" : "md:mr-8"}`}>
                  <h3 className="text-white font-semibold">{t.title}</h3>
                  <p className="text-gray-400 mt-2 text-sm">{t.desc}</p>
                </div>

                <div className={`absolute top-6 ${left ? "-left-6" : "-right-6"} w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-pink-400 border border-white/10`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
