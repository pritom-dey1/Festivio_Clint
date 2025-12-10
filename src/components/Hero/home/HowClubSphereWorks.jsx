import { motion } from "framer-motion";
import { Share2, Users, CalendarDays, Cog } from "lucide-react";
import { useTranslation } from "react-i18next";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } }
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function HowClubSphereWorks() {
  const { t } = useTranslation();
  const steps = t("howClubSphereWorks.steps", { returnObjects: true });

  const icons = [Share2, Users, CalendarDays, Cog];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-14 uppercase">
        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          {t("howClubSphereWorks.title")}
        </span>
      </h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {steps.map((step, idx) => {
          const Icon = icons[idx];
          return (
            <motion.div
              key={idx}
              variants={item}
              className="bg-[#0f0f15] p-8 rounded-2xl border border-white/5 shadow-xl shadow-black/40 backdrop-blur-md hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex justify-center mb-5">
                <Icon className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-2">
                {step.title}
              </h3>
              <p className="text-gray-300 text-center text-sm">{step.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
