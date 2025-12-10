import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ClubCard from "../../Global/ClubCard";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15, 
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const FeaturedClub = () => {
  const { data: clubs, isLoading } = useQuery({
    queryKey: ["featured-clubs"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/clubs");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="text-center text-white py-10 text-xl">
        Loading Featured Clubs...
      </div>
    );
  }

  const topClubs = clubs
    .sort((a, b) => b.members_count - a.members_count)
    .slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Title with gradient glow */}
      <h2 className="text-4xl uppercase md:text-5xl font-extrabold text-center mb-12">
        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          Featured Club
        </span>
      </h2>

      {/* Club Cards Grid with stagger effect */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        variants={containerVariants}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.2 }}
      >
        {topClubs.map((club) => (
          <motion.div key={club._id} variants={cardVariants}>
            <ClubCard club={club} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedClub;
