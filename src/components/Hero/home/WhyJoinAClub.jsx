import { motion, AnimatePresence } from "framer-motion";
import { Users, Sparkles, HeartHandshake, Trophy, ChevronDown } from "lucide-react";
import React, { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const float = {
  initial: { y: 0 },
  animate: {
    y: -10,
    transition: {
      duration: 1.8,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

const steps = [
  { icon: <Users className="w-12 h-12 text-indigo-400" />, title: "Meet New People", desc: "Connect with like-minded people and expand your network." },
  { icon: <Sparkles className="w-12 h-12 text-purple-400" />, title: "Develop New Skills", desc: "Learn new abilities through hands-on experiences." },
  { icon: <HeartHandshake className="w-12 h-12 text-pink-400" />, title: "Be Part of a Community", desc: "Club activities make you feel included, valued, and supported." },
  { icon: <Trophy className="w-12 h-12 text-blue-400" />, title: "Achieve More", desc: "Participate in competitions and events that help you grow." },
  
];

const faqs = [
  { q: "Is joining a club free?", a: "Most clubs are free to join, while some may have small membership fees depending on the club and events." },
  { q: "Do I need experience to join?", a: "No experience needed — beginners are welcome. Clubs often run workshops for different skill levels." },
  { q: "Can I join multiple clubs?", a: "Yes — you can join as many clubs as you like and participate based on your time and interest." },
  { q: "How do events work?", a: "Club managers create events; you can view details and register through ClubSphere. Payments (if any) are handled within the platform." },
  {
  q: "Can I suggest new clubs or events?",
  a: "Yes! ClubSphere allows members to propose new clubs or events. Admins and club managers will review your suggestions and take action accordingly."
}
];

export default function WhyJoinAClub() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 select-none">
      {/* Heading */}
      <motion.h2
        className="text-4xl md:text-5xl font-extrabold text-center mb-6 uppercase"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Why Join a Club?
        </span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        className="text-gray-300 text-center max-w-2xl mx-auto text-lg mb-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        Joining a club is more than an activity—it's a path to growth, belonging, and opportunities.
      </motion.p>

      {/* TIMELINE + FAQ in FLEX ROW */}
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Timeline */}
        <div className="relative border-l border-white/10 ml-4 flex-1">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="relative pl-10 mb-16 flex items-start gap-6"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
            >
              <span className="w-4 h-4 bg-indigo-500 absolute left-[-9px] top-3 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
              <motion.div variants={float} initial="initial" animate="animate">
                {step.icon}
              </motion.div>
              <div>
                <h3 className="text-xl text-white font-semibold">{step.title}</h3>
                <p className="text-gray-400 text-sm max-w-md">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="flex-1">
          <div className="space-y-4">
            {faqs.map((f, i) => {
              const open = openIndex === i;
              return (
                <div key={i} className="bg-[#0d0d14] border border-white/5 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between px-5 py-4 focus:outline-none"
                    aria-expanded={open}
                    aria-controls={`faq-${i}`}
                  >
                    <div className="text-left">
                      <h4 className="text-white text-lg font-medium">{f.q}</h4>
                    </div>
                    <motion.span
                      className="ml-4 flex-shrink-0"
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-300" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`faq-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="px-5 pb-4"
                      >
                        <div className="pt-2 text-gray-300 text-sm leading-relaxed">{f.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
