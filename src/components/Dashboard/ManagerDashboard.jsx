// src/pages/ManagerDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUsers, FiCalendar, FiCreditCard, FiGrid } from "react-icons/fi";
import Logo from "../../assets/Logo.png";
import LogoutButton from "../Global/LogoutButton";
import { Link } from "react-router";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const tabs = [
  { id: "overview", label: "Overview", icon: FiGrid },
  { id: "clubs", label: "My Clubs", icon: FiUsers },
  { id: "events", label: "My Events", icon: FiCalendar },
  { id: "members", label: "Club Members", icon: FiUsers },
  { id: "payments", label: "Payments", icon: FiCreditCard },
  { id: "registrations", label: "Event Registrations", icon: FiUsers },
];

const API_ROOT = "http://localhost:5000/api/dashboard/manager";

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [overview, setOverview] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newClub, setNewClub] = useState({
    clubName: "",
    description: "",
    category: "Sports",
    location: "",
    bannerImage: "",
    membershipFee: 0,
  });

  const [editClub, setEditClub] = useState(null);

  const [newEvent, setNewEvent] = useState({
    clubId: "",
    title: "",
    description: "",
    eventDate: "",
    location: "",
    isPaid: false,
    eventFee: 0,
    maxAttendees: 0,
  });

  const [editEvent, setEditEvent] = useState(null);

  // ----------- Fetch helpers -----------
  const fetchOverview = async () => {
    const res = await axios.get(`${API_ROOT}/overview`, { withCredentials: true });
    return res.data;
  };

  const fetchClubs = async () => {
    const res = await axios.get(`${API_ROOT}/clubs`, { withCredentials: true });
    return res.data || [];
  };

  const fetchEventsForClubs = async (clubsArr) => {
    if (!clubsArr || clubsArr.length === 0) return [];
    const promises = clubsArr.map((c) =>
      axios.get(`${API_ROOT}/events/${c._id}`, { withCredentials: true }).then(r => r.data || [])
    );
    const eventsNested = await Promise.all(promises);
    return eventsNested.flat();
  };

  const fetchMembersForClubs_safe = async (clubsArr) => {
    if (!clubsArr || clubsArr.length === 0) return [];
    const promises = clubsArr.map((c) =>
      axios.get(`${API_ROOT}/clubs/${c._id}/members`, { withCredentials: true }).then(r => r.data || []).catch(() => [])
    );
    const membersNested = await Promise.all(promises);
    return membersNested.flat();
  };

  const fetchPaymentsForClubs = async (clubsArr) => {
    if (!clubsArr || clubsArr.length === 0) return [];
    const promises = clubsArr.map((c) =>
      axios.get(`${API_ROOT}/payments/${c._id}`, { withCredentials: true }).then(r => r.data || []).catch(() => [])
    );
    const paymentsNested = await Promise.all(promises);
    return paymentsNested.flat();
  };

  const fetchRegistrationsForEvents = async (eventsArr) => {
    if (!eventsArr || eventsArr.length === 0) return [];
    const promises = eventsArr.map((ev) =>
      axios
        .get(`${API_ROOT}/events/${ev._id}/registrations`, { withCredentials: true })
        .then((r) => {
          const data = Array.isArray(r.data) ? r.data : (r.data?.data ?? []);
          return { event: ev, regs: data };
        })
        .catch(() => ({ event: ev, regs: [] }))
    );
    return Promise.all(promises);
  };

  // ----------- Master fetch -----------
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const ov = await fetchOverview();
      setOverview(ov);

      const clubsRes = await fetchClubs();
      setClubs(clubsRes);

      const [eventsRes, membersRes, paymentsRes] = await Promise.all([
        fetchEventsForClubs(clubsRes),
        fetchMembersForClubs_safe(clubsRes),
        fetchPaymentsForClubs(clubsRes),
      ]);

      setEvents(eventsRes);
      setMembers(membersRes);
      setPayments(paymentsRes);

      const regsForEvents = await fetchRegistrationsForEvents(eventsRes);
      setEventRegistrations(regsForEvents);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err?.response?.data?.error || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ----------- CRUD Handlers -----------
  const handleCreateClub = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_ROOT}/clubs`, newClub, { withCredentials: true });
      setNewClub({ clubName: "", description: "", category: "Sports", location: "", bannerImage: "", membershipFee: 0 });
      await fetchAllData();
      setActiveTab("clubs");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to create club");
    }
  };

  const handleUpdateClub = async (e) => {
    e.preventDefault();
    if (!editClub?._id) return;
    try {
      await axios.put(`${API_ROOT}/clubs/${editClub._id}`, editClub, { withCredentials: true });
      setEditClub(null);
      await fetchAllData();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to update club");
    }
  };

  const handleDeleteClub = async (id) => {
    if (!window.confirm("Are you sure you want to delete this club?")) return;
    try {
      await axios.delete(`${API_ROOT}/clubs/${id}`, { withCredentials: true });
      await fetchAllData();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to delete club");
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      if (!newEvent.clubId) return alert("Select a club first!");
      await axios.post(`${API_ROOT}/events/${newEvent.clubId}`, newEvent, { withCredentials: true });
      setNewEvent({ clubId: "", title: "", description: "", eventDate: "", location: "", isPaid: false, eventFee: 0, maxAttendees: 0 });
      const eventsRes = await fetchEventsForClubs(clubs);
      setEvents(eventsRes);
      const regs = await fetchRegistrationsForEvents(eventsRes);
      setEventRegistrations(regs);
      setActiveTab("events");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to create event");
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!editEvent?._id) return;
    try {
      await axios.put(`${API_ROOT}/events/edit/${editEvent._id}`, editEvent, { withCredentials: true });
      setEditEvent(null);
      const eventsRes = await fetchEventsForClubs(clubs);
      setEvents(eventsRes);
      const regs = await fetchRegistrationsForEvents(eventsRes);
      setEventRegistrations(regs);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to update event");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`${API_ROOT}/events/${id}`, { withCredentials: true });
      const eventsRes = await fetchEventsForClubs(clubs);
      setEvents(eventsRes);
      const regs = await fetchRegistrationsForEvents(eventsRes);
      setEventRegistrations(regs);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to delete event");
    }
  };

  const handleExpireMember = async (membershipId) => {
    if (!membershipId) return;
    try {
      await axios.patch(`${API_ROOT}/membership/${membershipId}/status`, { status: "expired" }, { withCredentials: true });
      const membersRes = await fetchMembersForClubs_safe(clubs);
      setMembers(membersRes);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to update membership");
    }
  };

  // ----------- UI helpers -----------
  if (loading || !overview) return <p className="text-center mt-10">Loading Manager Dashboard...</p>;
  if (error) return <p className="text-center mt-10 text-red-400">Error: {error}</p>;

  // Chart Data
  const chartData = [
    { name: "Clubs", value: overview.totalClubs },
    { name: "Members", value: overview.totalMembers },
    { name: "Events", value: overview.totalEvents },
    { name: "Payments", value: overview.totalPayments },
  ];
  const COLORS = ["#4f46e5", "#10b981", "#8b5cf6", "#ec4899"];

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
              className={`flex items-center gap-3 p-3 rounded-xl w-full transition-all duration-300 hover:bg-indigo-600/40 ${
                activeTab === tab.id ? "bg-indigo-600/60 shadow-lg border border-indigo-400/20" : "bg-white/5"
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
        <div className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#161b29]/90 to-[#0f131d]/90 backdrop-blur-xl border-b border-white/10 shadow-xl">
          <div>
            <p className="text-lg font-semibold">{overview.managerName || "Manager"}</p>
            <p className="text-sm opacity-60">{overview.managerEmail || "manager@example.com"}</p>
          </div>
          <LogoutButton />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Overview with Pie Chart */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-3xl font-bold mb-6">Overview</h2>
              <div className="w-full h-80 md:h-96 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg backdrop-blur-xl">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Clubs, Events, Members, Payments, Registrations */}
          {/* ... baki code thik thak vabe thakbe, ja ami age diyechilam ... */}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
