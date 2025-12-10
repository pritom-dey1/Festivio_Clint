// src/pages/MemberDashboard.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiCreditCard, FiUsers, FiCalendar, FiGrid } from "react-icons/fi";
import Logo from "../../assets/Logo.png";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../Global/LogoutButton";
import { Link } from "react-router";

const tabs = [
  { id: "overview", label: "Overview", icon: FiGrid },
  { id: "clubs", label: "My Clubs", icon: FiUsers },
  { id: "events", label: "My Events", icon: FiCalendar },
  { id: "payments", label: "Payments", icon: FiCreditCard },
];

const MemberDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const [overview, setOverview] = useState(null);
  const [myClubs, setMyClubs] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:5000/api/dashboard/member";

  const loadOverview = async () => {
    const res = await axios.get(`${API}/overview`, { withCredentials: true });
    setOverview(res.data);
  };

  const loadClubs = async () => {
    const res = await axios.get(`${API}/my-clubs`, { withCredentials: true });
    setMyClubs(res.data);
  };

  const loadEvents = async () => {
    const res = await axios.get(`${API}/my-events`, { withCredentials: true });
    setMyEvents(res.data);
  };

  const loadPayments = async () => {
    const res = await axios.get(`${API}/payments`, { withCredentials: true });
    setPayments(res.data);
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        await Promise.all([loadOverview(), loadClubs(), loadEvents(), loadPayments()]);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    loadAll();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-300">
        <p></p>
      </div>
    );

  return (
    <div className="relative min-h-screen flex bg-gradient-to-br from-[#0a0d15] via-[#090c14] to-[#070a12] text-gray-200">

      {/* Sidebar */}
      <div className="w-64 h-screen fixed left-0 top-0 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col shadow-xl">
        <div className="flex items-center gap-3 mb-10">
          <Link to='/'>
                    <img src={Logo} alt="logo" className="w-10" />

          </Link>
        </div>

        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 p-3 rounded-xl w-full 
                transition-all duration-300 hover:bg-indigo-600/40 ${
                  activeTab === tab.id
                    ? "bg-indigo-600/60 shadow-lg border border-indigo-400/20"
                    : "bg-white/5"
                }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* Top Bar */}
        <div className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 
          bg-gradient-to-r from-[#161b29]/90 to-[#0f131d]/90
          backdrop-blur-xl border-b border-white/10 shadow-xl">

          <div>
            <p className="text-lg font-semibold">{user?.name}</p>
            <p className="text-sm opacity-60">{user?.email}</p>
          </div>

          <LogoutButton />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">

          {/* Overview */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Overview
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: "Clubs Joined", value: overview.totalClubsJoined },
                  { label: "Events Registered", value: overview.totalEventsRegistered },
                  { label: "Upcoming Events", value: overview.upcomingEvents?.length || 0 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg"
                    whileHover={{ scale: 1.03 }}
                  >
                    <p className="text-sm opacity-60">{item.label}</p>
                    <h3 className="text-3xl font-bold text-indigo-300">{item.value}</h3>
                  </motion.div>
                ))}
              </div>

              <h3 className="mt-8 text-xl font-semibold mb-3">Upcoming Events</h3>
              <div className="space-y-3">
                {(overview.upcomingEvents || []).map((e) => (
                  <div
                    key={e._id}
                    className="bg-white/5 p-4 rounded-xl border border-white/10 shadow hover:bg-white/10 transition"
                  >
                    <p className="font-semibold">{e.title}</p>
                    <p className="text-sm opacity-60">
                      {new Date(e.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Clubs */}
          {activeTab === "clubs" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-3xl font-bold mb-6">My Clubs</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {myClubs.map((c) => (
                  <motion.div
                    key={c._id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition"
                  >
                    <p className="text-lg font-semibold">{c.clubId?.clubName}</p>
                    <p className="text-green-400">Status: {c.status}</p>
                    <p className="opacity-60 text-sm">
                      Expires: {new Date(c.expiryDate).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Events */}
          {activeTab === "events" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-3xl font-bold mb-6">My Events</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {myEvents.map((e) => (
                  <motion.div
                    key={e._id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition"
                  >
                    <p className="text-lg font-semibold">{e.eventId?.title}</p>
                    <p className="opacity-60 text-sm">
                      Date: {new Date(e.eventId?.eventDate).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Payments */}
          {activeTab === "payments" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-3xl font-bold mb-6">Payment History</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {payments.map((p) => (
                  <motion.div
                    key={p._id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition"
                  >
                    <p className="text-lg font-semibold">
                      ${p.amount} — {p.paymentType}
                    </p>
                    <p className="opacity-60 text-sm">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-indigo-400">Status: {p.status}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
