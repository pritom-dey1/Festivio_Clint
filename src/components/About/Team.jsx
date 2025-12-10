import React from "react";
import { motion } from "framer-motion";

/**
 * Add your online image URLs here:
 * Example:
 * image: "https://i.ibb.co/image.jpg"
 */

const team = [
  { 
    name: "Rafi Ahmed", 
    role: "Founder & CEO", 
    bio: "Product lead, UX lover, community-first builder.",
    image: "https://img.freepik.com/free-photo/busy-young-attractive-smiling-man-sitting-co-working-open-office-holding-laptop_285396-1768.jpg?semt=ais_hybrid&w=740&q=80" // replace with real image link
  },
  { 
    name: "Aisha Khan", 
    role: "CTO", 
    bio: "Backend & infra, loves building scalable systems.",
    image: "https://img.freepik.com/free-photo/confident-cheerful-young-businesswoman_1262-20881.jpg?semt=ais_hybrid&w=740&q=80" 
  },
  { 
    name: "Samir Hossain", 
    role: "Head of Design", 
    bio: "Design systems, motion, and UI craftsmanship.",
    image: "https://img.freepik.com/free-photo/close-up-young-businessman-holding-disposable-coffee-cup-hand-looking-camera_23-2148176166.jpg?semt=ais_hybrid&w=740&q=80" // no image, will fallback to initials
  }
];

function Avatar({ name, image }) {
  // If image exists, use it
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-20 h-20 rounded-full object-cover shadow-md border border-white/10"
      />
    );
  }

  // Fallback: initials avatar
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
      {initials}
    </div>
  );
}

export default function Team() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <motion.h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
        Meet the Team
      </motion.h2>

      <p className="text-center text-gray-300 max-w-2xl mx-auto mb-10">
        Small, passionate team building ClubSphere — focused on community, reliability, and beautiful UX.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {team.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-[#0d0d14] border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center"
          >
            <Avatar name={t.name} image={t.image} />

            <h4 className="text-white font-semibold mt-4">{t.name}</h4>
            <div className="text-indigo-300 text-sm">{t.role}</div>
            <p className="text-gray-400 text-sm mt-3">{t.bio}</p>

            <div className="mt-4 flex gap-3">
              <button className="px-3 py-1 text-xs rounded-md bg-gradient-to-r from-indigo-600 to-pink-500 text-white">
                Message
              </button>
              <button className="px-3 py-1 text-xs rounded-md border border-white/8 text-gray-300">
                Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
