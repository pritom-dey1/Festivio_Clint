// src/pages/AllClubsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import ClubCard from "../Global/ClubCard";
import DarkVeil from "../Hero/DarkVeliBanner";
import Loader from "../Loader";

const categories = ["All", "Technology", "Sports", "Arts", "Music", "Literature", "Gaming", "Photography", "Science", "Drama", "Business", "Travel"];

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Highest Fee", value: "highestFee" },
  { label: "Lowest Fee", value: "lowestFee" },
];

const AllClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/clubs", {
        params: {
          search: search || undefined,
          category: category !== "All" ? category : undefined,
          sort,
        },
      });
      setClubs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [search, category, sort]);

  return (
    <div className="relative w-full min-h-screen">
<div className="relative">
    <motion.div
  className="absolute inset-0 flex items-center justify-center"
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
>
  <h1 className="text-5xl text-center md:text-6xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg uppercase">
    Explore All Clubs
  </h1>
</motion.div>

{/* DarkVeil */}
<DarkVeil></DarkVeil>
</div>
      {/* Search / Filter / Sort */}
{/* Filter Bar */}
<div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center md:justify-between">
  {/* Search Box */}
  <div className="flex items-center bg-[#1a1a2e] rounded-[5px] px-4 py-2 w-full md:w-1/2 shadow-md hover:shadow-lg transition-shadow duration-300">
    <Search className="w-5 h-5 text-gray-400 mr-3" />
    <input
      type="text"
      placeholder="Search by club name..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="bg-transparent outline-none w-full text-white placeholder-gray-400"
    />
  </div>

  {/* Category Filter */}
  <div className="relative w-full md:w-1/4">
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="appearance-none bg-[#1a1a2e] text-white rounded-[5px] px-4 py-2 w-full shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>

  {/* Sort Filter */}
  <div className="relative w-full md:w-1/4">
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      className="appearance-none bg-[#1a1a2e] text-white rounded-[5px] px-4 py-2 w-full shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      {sortOptions.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
</div>


      {/* Clubs Grid */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {loading ? (
          <Loader></Loader>
        ) : clubs.length === 0 ? (
          <p className="text-white text-center col-span-full">No clubs found.</p>
        ) : (
          clubs.map((club) => <ClubCard key={club._id} club={club} />)
        )}
      </div>
    </div>
  );
};

export default AllClubsPage;
