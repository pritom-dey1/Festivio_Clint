// src/pages/ManagerDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUsers, FiCalendar, FiCreditCard, FiGrid } from "react-icons/fi";
import Logo from "../../assets/Logo.png";
import LogoutButton from "../Global/LogoutButton";
import { Link } from "react-router";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useAuth } from "../../context/AuthContext";

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
  const { user } = useAuth();
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
    const res = await axios.get(`${API_ROOT}/overview`, {
      withCredentials: true,
    });
    return res.data;
  };

  const fetchClubs = async () => {
    const res = await axios.get(`${API_ROOT}/clubs`, { withCredentials: true });
    return res.data || [];
  };

  const fetchEventsForClubs = async (clubsArr) => {
    if (!clubsArr || clubsArr.length === 0) return [];
    const promises = clubsArr.map((c) =>
      axios
        .get(`${API_ROOT}/events/${c._id}`, { withCredentials: true })
        .then((r) => r.data || [])
    );
    const eventsNested = await Promise.all(promises);
    return eventsNested.flat();
  };

  const fetchMembersForClubs_safe = async (clubsArr) => {
    if (!clubsArr || clubsArr.length === 0) return [];
    const promises = clubsArr.map((c) =>
      axios
        .get(`${API_ROOT}/clubs/${c._id}/members`, { withCredentials: true })
        .then((r) => r.data || [])
        .catch(() => [])
    );
    const membersNested = await Promise.all(promises);
    return membersNested.flat();
  };

  const fetchPaymentsForClubs = async (clubsArr) => {
    if (!clubsArr || clubsArr.length === 0) return [];
    const promises = clubsArr.map((c) =>
      axios
        .get(`${API_ROOT}/payments/${c._id}`, { withCredentials: true })
        .then((r) => r.data || [])
        .catch(() => [])
    );
    const paymentsNested = await Promise.all(promises);
    return paymentsNested.flat();
  };

  const fetchRegistrationsForEvents = async (eventsArr) => {
    if (!eventsArr || eventsArr.length === 0) return [];
    const promises = eventsArr.map((ev) =>
      axios
        .get(`${API_ROOT}/events/${ev._id}/registrations`, {
          withCredentials: true,
        })
        .then((r) => {
          const data = Array.isArray(r.data) ? r.data : r.data?.data ?? [];
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
  // Clubs, Events, Members CRUD handlers (same as before)
  const handleCreateClub = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_ROOT}/clubs`, newClub, { withCredentials: true });
      setNewClub({
        clubName: "",
        description: "",
        category: "Sports",
        location: "",
        bannerImage: "",
        membershipFee: 0,
      });
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
      await axios.put(`${API_ROOT}/clubs/${editClub._id}`, editClub, {
        withCredentials: true,
      });
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
      await axios.post(`${API_ROOT}/events/${newEvent.clubId}`, newEvent, {
        withCredentials: true,
      });
      setNewEvent({
        clubId: "",
        title: "",
        description: "",
        eventDate: "",
        location: "",
        isPaid: false,
        eventFee: 0,
        maxAttendees: 0,
      });
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
      await axios.put(`${API_ROOT}/events/edit/${editEvent._id}`, editEvent, {
        withCredentials: true,
      });
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
      await axios.patch(
        `${API_ROOT}/membership/${membershipId}/status`,
        { status: "expired" },
        { withCredentials: true }
      );
      const membersRes = await fetchMembersForClubs_safe(clubs);
      setMembers(membersRes);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to update membership");
    }
  };

  if (loading || !overview)
    return <p className="text-center mt-10">Loading Manager Dashboard...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-400">Error: {error}</p>;

  // Chart Data
  const clubsData = [{ name: "Clubs", value: overview.totalClubs }];
  const membersData = [
    { name: "Members", value: overview.totalMembers },
    { name: "Others", value: 0 },
  ];
  const eventsData = [{ name: "Events", value: overview.totalEvents }];
  const paymentsData = [
    { name: "Payments", value: overview.totalPayments },
    { name: "Others", value: 0 },
  ];

  const COLORS = ["#4f46e5", "#10b981", "#8b5cf6", "#ec4899"];

  return (
    <div className="relative min-h-screen flex bg-gradient-to-br from-[#0a0d15] via-[#090c14] to-[#070a12] text-gray-200">
      {/* Sidebar */}
      <div className="w-64 h-screen fixed left-0 top-0 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col shadow-xl">
        <div className="flex items-center gap-3 mb-10">
          <Link to="/">
            <img src={Logo} alt="logo" className="w-10" />
          </Link>
        </div>
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 p-3 rounded-xl w-full transition-all duration-300 hover:bg-indigo-600/40 ${
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
        <div className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#161b29]/90 to-[#0f131d]/90 backdrop-blur-xl border-b border-white/10 shadow-xl">
          <div>
            <p className="text-lg font-semibold">
              {user?.name|| "Manager"}(Manger)
            </p>
            <p className="text-sm opacity-60">
              {user?.email || "manager@example.com"}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Overview with 4 charts */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-3xl font-bold mb-6">Overview</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Total Clubs - Bar */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg backdrop-blur-xl h-72">
                  <h3 className="font-semibold text-lg mb-2">Total Clubs</h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={clubsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Total Members - Pie */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg backdrop-blur-xl h-72">
                  <h3 className="font-semibold text-lg mb-2">Total Members</h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                      <Pie
                        data={membersData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#10b981"
                        label
                      >
                        {membersData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Total Events - Bar */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg backdrop-blur-xl h-72">
                  <h3 className="font-semibold text-lg mb-2">Total Events</h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={eventsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Total Payments - Pie */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg backdrop-blur-xl h-72">
                  <h3 className="font-semibold text-lg mb-2">Total Payments</h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                      <Pie
                        data={paymentsData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#ec4899"
                        label
                      >
                        {paymentsData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
          {/* My Clubs */}{" "}
          {activeTab === "clubs" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {" "}
              <h2 className="text-3xl font-bold mb-6">My Clubs</h2>{" "}
              <form
                onSubmit={handleCreateClub}
                className="space-y-4 mb-6 p-6 bg-white/5 rounded-2xl border border-white/10 shadow-lg backdrop-blur-xl"
              >
                {" "}
                <input
                  type="text"
                  placeholder="Club Name"
                  value={newClub.clubName}
                  onChange={(e) =>
                    setNewClub({ ...newClub, clubName: e.target.value })
                  }
                  className="input-field"
                  required
                />{" "}
                <input
                  type="text"
                  placeholder="Description"
                  value={newClub.description}
                  onChange={(e) =>
                    setNewClub({ ...newClub, description: e.target.value })
                  }
                  className="input-field"
                  required
                />{" "}
                <select
                  value={newClub.category}
                  onChange={(e) =>
                    setNewClub({ ...newClub, category: e.target.value })
                  }
                  className="input-field"
                >
                  {" "}
                  <option value="Photography">Photography</option>{" "}
                  <option value="Sports">Sports</option>{" "}
                  <option value="Tech">Tech</option>{" "}
                  <option value="Music">Music</option>{" "}
                  <option value="Art">Art</option>{" "}
                  <option value="Other">Other</option>{" "}
                </select>{" "}
                <input
                  type="text"
                  placeholder="Location"
                  value={newClub.location}
                  onChange={(e) =>
                    setNewClub({ ...newClub, location: e.target.value })
                  }
                  className="input-field"
                  required
                />{" "}
                <input
                  type="text"
                  placeholder="Banner URL"
                  value={newClub.bannerImage}
                  onChange={(e) =>
                    setNewClub({ ...newClub, bannerImage: e.target.value })
                  }
                  className="input-field"
                />{" "}
                <input
                  type="number"
                  placeholder="Membership Fee"
                  value={newClub.membershipFee}
                  onChange={(e) =>
                    setNewClub({
                      ...newClub,
                      membershipFee: Number(e.target.value),
                    })
                  }
                  className="input-field"
                />{" "}
                <button type="submit" className="btn-primary">
                  Create Club
                </button>{" "}
              </form>{" "}
              {/* Edit Club Modal */}{" "}
              {editClub && (
                <form
                  onSubmit={handleUpdateClub}
                  className="space-y-4 mb-6 p-6 bg-indigo-900/30 rounded-2xl border border-indigo-400/20 shadow-lg backdrop-blur-xl"
                >
                  {" "}
                  <h3 className="text-xl font-semibold text-indigo-100">
                    Edit Club
                  </h3>{" "}
                  <input
                    type="text"
                    placeholder="Club Name"
                    value={editClub.clubName}
                    onChange={(e) =>
                      setEditClub({ ...editClub, clubName: e.target.value })
                    }
                    className="input-field"
                    required
                  />{" "}
                  <input
                    type="text"
                    placeholder="Description"
                    value={editClub.description}
                    onChange={(e) =>
                      setEditClub({ ...editClub, description: e.target.value })
                    }
                    className="input-field"
                    required
                  />{" "}
                  <select
                    value={editClub.category}
                    onChange={(e) =>
                      setEditClub({ ...editClub, category: e.target.value })
                    }
                    className="input-field"
                  >
                    {" "}
                    <option value="Photography">Photography</option>{" "}
                    <option value="Sports">Sports</option>{" "}
                    <option value="Tech">Tech</option>{" "}
                    <option value="Music">Music</option>{" "}
                    <option value="Art">Art</option>{" "}
                    <option value="Other">Other</option>{" "}
                  </select>{" "}
                  <input
                    type="text"
                    placeholder="Location"
                    value={editClub.location}
                    onChange={(e) =>
                      setEditClub({ ...editClub, location: e.target.value })
                    }
                    className="input-field"
                    required
                  />{" "}
                  <input
                    type="text"
                    placeholder="Banner URL"
                    value={editClub.bannerImage}
                    onChange={(e) =>
                      setEditClub({ ...editClub, bannerImage: e.target.value })
                    }
                    className="input-field"
                  />{" "}
                  <input
                    type="number"
                    placeholder="Membership Fee"
                    value={editClub.membershipFee}
                    onChange={(e) =>
                      setEditClub({
                        ...editClub,
                        membershipFee: Number(e.target.value),
                      })
                    }
                    className="input-field"
                  />{" "}
                  <div className="flex gap-3">
                    {" "}
                    <button type="submit" className="btn-primary">
                      Update
                    </button>{" "}
                    <button
                      type="button"
                      onClick={() => setEditClub(null)}
                      className="btn-delete"
                    >
                      Cancel
                    </button>{" "}
                  </div>{" "}
                </form>
              )}{" "}
              {/* Clubs List */}{" "}
              <div className="grid md:grid-cols-2 gap-6">
                {" "}
                {clubs.map((c) => (
                  <motion.div
                    key={c._id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition"
                  >
                    {" "}
                    <p className="text-lg font-semibold">{c.clubName}</p>{" "}
                    <p className="opacity-60">{c.category}</p>{" "}
                    <p>${c.membershipFee}</p>{" "}
                    <div className="flex gap-3 mt-2">
                      {" "}
                      <button
                        onClick={() => setEditClub(c)}
                        className="btn-primary text-sm"
                      >
                        Edit
                      </button>{" "}
                      <button
                        onClick={() => handleDeleteClub(c._id)}
                        className="btn-delete text-sm"
                      >
                        Delete
                      </button>{" "}
                    </div>{" "}
                  </motion.div>
                ))}{" "}
              </div>{" "}
            </motion.div>
          )}{" "}
          {/* My Events */}{" "}
          {activeTab === "events" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {" "}
              <h2 className="text-3xl font-bold mb-6">My Events</h2>{" "}
              {/* Create Event Form */}{" "}
              <form
                onSubmit={handleCreateEvent}
                className="space-y-4 mb-6 p-6 bg-white/5 rounded-2xl border border-white/10 shadow-lg backdrop-blur-xl"
              >
                {" "}
                <select
                  value={newEvent.clubId}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, clubId: e.target.value })
                  }
                  required
                  className="input-field"
                >
                  {" "}
                  <option value="">Select Club</option>{" "}
                  {clubs.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.clubName}
                    </option>
                  ))}{" "}
                </select>{" "}
                <input
                  type="text"
                  placeholder="Title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="input-field"
                  required
                />{" "}
                <textarea
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  className="input-field"
                />{" "}
                <input
                  type="date"
                  value={newEvent.eventDate}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, eventDate: e.target.value })
                  }
                  className="input-field"
                  required
                />{" "}
                <input
                  type="text"
                  placeholder="Location"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                  className="input-field"
                />{" "}
                <label className="flex items-center gap-2">
                  {" "}
                  Paid Event{" "}
                  <input
                    type="checkbox"
                    checked={newEvent.isPaid}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, isPaid: e.target.checked })
                    }
                  />{" "}
                </label>{" "}
                {newEvent.isPaid && (
                  <input
                    type="number"
                    placeholder="Event Fee"
                    value={newEvent.eventFee}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        eventFee: Number(e.target.value),
                      })
                    }
                    className="input-field"
                  />
                )}{" "}
                <input
                  type="number"
                  placeholder="Max Attendees"
                  value={newEvent.maxAttendees}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      maxAttendees: Number(e.target.value),
                    })
                  }
                  className="input-field"
                />{" "}
                <button type="submit" className="btn-primary">
                  Create Event
                </button>{" "}
              </form>{" "}
              {/* Edit Event Modal */}{" "}
              {editEvent && (
                <form
                  onSubmit={handleUpdateEvent}
                  className="space-y-4 mb-6 p-6 bg-indigo-900/30 rounded-2xl border border-indigo-400/20 shadow-lg backdrop-blur-xl"
                >
                  {" "}
                  <h3 className="text-xl font-semibold text-indigo-100">
                    Edit Event
                  </h3>{" "}
                  <input
                    type="text"
                    placeholder="Title"
                    value={editEvent.title}
                    onChange={(e) =>
                      setEditEvent({ ...editEvent, title: e.target.value })
                    }
                    className="input-field"
                    required
                  />{" "}
                  <textarea
                    placeholder="Description"
                    value={editEvent.description}
                    onChange={(e) =>
                      setEditEvent({
                        ...editEvent,
                        description: e.target.value,
                      })
                    }
                    className="input-field"
                  />{" "}
                  <input
                    type="date"
                    value={editEvent.eventDate}
                    onChange={(e) =>
                      setEditEvent({ ...editEvent, eventDate: e.target.value })
                    }
                    className="input-field"
                    required
                  />{" "}
                  <input
                    type="text"
                    placeholder="Location"
                    value={editEvent.location}
                    onChange={(e) =>
                      setEditEvent({ ...editEvent, location: e.target.value })
                    }
                    className="input-field"
                  />{" "}
                  <label className="flex items-center gap-2">
                    {" "}
                    Paid Event{" "}
                    <input
                      type="checkbox"
                      checked={editEvent.isPaid}
                      onChange={(e) =>
                        setEditEvent({ ...editEvent, isPaid: e.target.checked })
                      }
                    />{" "}
                  </label>{" "}
                  {editEvent.isPaid && (
                    <input
                      type="number"
                      placeholder="Event Fee"
                      value={editEvent.eventFee}
                      onChange={(e) =>
                        setEditEvent({
                          ...editEvent,
                          eventFee: Number(e.target.value),
                        })
                      }
                      className="input-field"
                    />
                  )}{" "}
                  <input
                    type="number"
                    placeholder="Max Attendees"
                    value={editEvent.maxAttendees}
                    onChange={(e) =>
                      setEditEvent({
                        ...editEvent,
                        maxAttendees: Number(e.target.value),
                      })
                    }
                    className="input-field"
                  />{" "}
                  <div className="flex gap-3">
                    {" "}
                    <button type="submit" className="btn-primary">
                      Update
                    </button>{" "}
                    <button
                      type="button"
                      onClick={() => setEditEvent(null)}
                      className="btn-delete"
                    >
                      Cancel
                    </button>{" "}
                  </div>{" "}
                </form>
              )}{" "}
              {/* Events List */}{" "}
              <div className="grid md:grid-cols-2 gap-6">
                {" "}
                {events.map((e) => (
                  <motion.div
                    key={e._id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition"
                  >
                    {" "}
                    <p className="text-lg font-semibold">{e.title}</p>{" "}
                    <p className="opacity-60">
                      {new Date(e.eventDate).toLocaleDateString()}
                    </p>{" "}
                    <p>{e.isPaid ? `$${e.eventFee}` : "Free"}</p>{" "}
                    <div className="flex gap-3 mt-2">
                      {" "}
                      <button
                        onClick={() => setEditEvent(e)}
                        className="btn-primary text-sm"
                      >
                        Edit
                      </button>{" "}
                      <button
                        onClick={() => handleDeleteEvent(e._id)}
                        className="btn-delete text-sm"
                      >
                        Delete
                      </button>{" "}
                    </div>{" "}
                  </motion.div>
                ))}{" "}
              </div>{" "}
            </motion.div>
          )}{" "}
          {/* Club Members */}{" "}
          {activeTab === "members" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {" "}
              <h2 className="text-3xl font-bold mb-6">Club Members</h2>{" "}
              <div className="grid md:grid-cols-2 gap-6">
                {" "}
                {members.length === 0 ? (
                  <p>No members found.</p>
                ) : (
                  members.map((m) => (
                    <motion.div
                      key={m._id}
                      whileHover={{ scale: 1.03 }}
                      className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition"
                    >
                      {" "}
                      <p className="font-semibold">
                        {m.userId?.name || m.userName || "No name"}
                      </p>{" "}
                      <p className="opacity-60">
                        {m.userId?.email || m.userEmail || "No email"}
                      </p>{" "}
                      <p>Status: {m.status}</p>{" "}
                      {m.status !== "expired" && (
                        <button
                          onClick={() => handleExpireMember(m._id)}
                          className="btn-delete mt-2"
                        >
                          Expire
                        </button>
                      )}{" "}
                    </motion.div>
                  ))
                )}{" "}
              </div>{" "}
            </motion.div>
          )}{" "}
          {/* Payments */}{" "}
          {activeTab === "payments" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {" "}
              <h2 className="text-3xl font-bold mb-6">Payments</h2>{" "}
              <div className="grid md:grid-cols-2 gap-6">
                {" "}
                {payments.length === 0 ? (
                  <p>No payments yet.</p>
                ) : (
                  payments.map((p) => (
                    <motion.div
                      key={p._id}
                      whileHover={{ scale: 1.03 }}
                      className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition"
                    >
                      {" "}
                      <p className="text-lg font-semibold">${p.amount}</p>{" "}
                      <p className="opacity-60 text-sm">
                        {p.userId?.email || p.userEmail || "unknown"}
                      </p>{" "}
                      <p className="text-indigo-400">
                        {p.status || p.paymentStatus || "paid"}
                      </p>{" "}
                    </motion.div>
                  ))
                )}{" "}
              </div>{" "}
            </motion.div>
          )}{" "}
          {/* Event Registrations */}{" "}
          {activeTab === "registrations" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {" "}
              <h2 className="text-3xl font-bold mb-6">
                Event Registrations
              </h2>{" "}
              {eventRegistrations.length === 0 ? (
                <p>No registrations yet.</p>
              ) : (
                eventRegistrations.map((er) => (
                  <div
                    key={er.event._id}
                    className="mb-6 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg"
                  >
                    {" "}
                    <h3 className="text-xl font-semibold">
                      {er.event.title}
                    </h3>{" "}
                    <p className="opacity-60 mb-2">
                      Date: {new Date(er.event.eventDate).toLocaleDateString()}
                    </p>{" "}
                    <p className="opacity-60 mb-2">Registered Members:</p>{" "}
                    {!er.regs || er.regs.length === 0 ? (
                      <p className="ml-4 text-gray-400">
                        No members registered yet.
                      </p>
                    ) : (
                      <ul className="ml-4 list-disc">
                        {" "}
                        {er.regs.map((r) => (
                          <li key={r._id}>
                            {" "}
                            {r.userEmail || r.userName || "No email"} — Status:{" "}
                            {r.status}{" "}
                            {r.registeredAt
                              ? `(${new Date(r.registeredAt).toLocaleString()})`
                              : ""}{" "}
                          </li>
                        ))}{" "}
                      </ul>
                    )}{" "}
                  </div>
                ))
              )}{" "}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
