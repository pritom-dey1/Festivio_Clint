import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUsers, FiGrid, FiCreditCard, FiClipboard } from "react-icons/fi";
import Logo from "../../assets/Logo.png"; // replace with your logo path
import LogoutButton from "../Global/LogoutButton";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useAuth } from "../../context/AuthContext";

const tabs = [
  { id: "overview", label: "Overview", icon: FiGrid },
  { id: "users", label: "Users", icon: FiUsers },
  { id: "clubs", label: "Clubs", icon: FiUsers },
  { id: "payments", label: "Payments", icon: FiCreditCard },
];

const API_ROOT = "http://localhost:5000/api/dashboard/admin";

const neonColors = ["#6366f1", "#a855f7", "#ec4899", "#f472b6"];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [overview, setOverview] = useState(null);
  console.log();
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} =useAuth();
  console.log(clubs);
  // Fetch API
  const fetchOverview = async () => {
    const res = await axios.get(`${API_ROOT}/overview`, { withCredentials: true });
    setOverview(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get(`${API_ROOT}/users`, { withCredentials: true });
    setUsers(res.data.data || []);
  };

  const fetchClubs = async () => {
    const res = await axios.get(`${API_ROOT}/clubs`, { withCredentials: true });
    setClubs(res.data.data || []);
  };

  const fetchPayments = async () => {
    const res = await axios.get(`${API_ROOT}/payments`, { withCredentials: true });
    setPayments(res.data.data || []);
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchOverview(), fetchUsers(), fetchClubs(), fetchPayments()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Actions
  const handleChangeUserRole = async (userId, role) => {
    await axios.patch(`${API_ROOT}/users/${userId}/role`, { role }, { withCredentials: true });
    fetchUsers();
  };

  const handleApproveClub = async (clubId) => {
    await axios.patch(`${API_ROOT}/clubs/${clubId}/status`, { status: "approved" }, { withCredentials: true });
    fetchClubs();
  };

  const handleRejectClub = async (clubId) => {
    await axios.patch(`${API_ROOT}/clubs/${clubId}/status`, { status: "rejected" }, { withCredentials: true });
    fetchClubs();
  };

  if (loading || !overview) return <p className="text-center mt-10 text-white">Loading Admin Dashboard...</p>;

  // Prepare data for charts
  const clubPieData = clubs.map(c => ({ name: c.clubName, value: c.membersCount || 1 }));
  const paymentsBarData = payments.slice(0, 10).map(p => ({ name: p.clubName || "N/A", amount: p.amount }));

  // Total clubs by status
  const totalClubs = {
    pending: clubs.filter(c => c.status === "pending").length,
    approved: clubs.filter(c => c.status === "approved").length,
    rejected: clubs.filter(c => c.status === "rejected").length,
  };

  return (
    <div className="relative min-h-screen flex bg-gradient-to-br from-[#0a0d15] via-[#090c14] to-[#070a12] text-gray-200">
      {/* Sidebar */}
      <div className="w-64 h-screen fixed left-0 top-0 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col shadow-xl">
        <div className="flex items-center gap-3 mb-10">
          <img src={Logo} alt="logo" className="w-10" />
        </div>
        <div className="space-y-2">
          {tabs.map(tab => (
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
        {/* Topbar */}
        <div className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#161b29]/90 to-[#0f131d]/90 backdrop-blur-xl border-b border-white/10 shadow-xl">
          <div>
            <p className="text-lg font-semibold">{user?.name || "Admin"}(Admin)</p>
            <p className="text-sm opacity-60">{user?.email || "admin@example.com"}</p>
          </div>
          <LogoutButton />
        </div>

        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Overview</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { label: "Total Users", value: overview.totalUsers },
                  { label: "Total Clubs", value: `${overview.totalClubs} ` },
                  { label: "Total Memberships", value: overview.totalMemberships },
                  { label: "Total Payments", value: `$${overview.totalPayments}` },
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

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl h-72">
                  <h4 className="mb-2 text-lg font-semibold">Club Members</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie dataKey="value" data={clubPieData} outerRadius={80} label>
                        {clubPieData.map((entry, index) => (
                          <Cell key={index} fill={neonColors[index % neonColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl h-72">
                  <h4 className="mb-2 text-lg font-semibold">Recent Payments</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={paymentsBarData}>
                      <XAxis dataKey="name" stroke="#aaa" />
                      <YAxis stroke="#aaa" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="amount" fill="#ec4899" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-3xl font-bold mb-6">Users</h2>
              <div className="overflow-auto rounded-2xl bg-white/5 border border-white/10 shadow-lg p-4">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Role</th>
                      <th className="px-4 py-2">Created At</th>
                      <th className="px-4 py-2">Change Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-b border-white/10">
                        <td className="px-4 py-2">{u.name}</td>
                        <td className="px-4 py-2">{u.email}</td>
                        <td className="px-4 py-2">{u.role}</td>
                        <td className="px-4 py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-2">
                          <select value={u.role} onChange={(e) => handleChangeUserRole(u._id, e.target.value)} className="bg-[#1a1a26] px-2 py-1 rounded-md text-white">
                            <option value="admin">Admin</option>
                            <option value="clubManager">Manager</option>
                            <option value="member">Member</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Clubs Tab */}
          {activeTab === "clubs" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-3xl font-bold mb-6">Clubs</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {clubs.map(c => (
                  <motion.div key={c._id} whileHover={{ scale: 1.03 }} className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition">
                    <p className="text-lg font-semibold">{c.clubName}</p>
                    <p className="opacity-60">Manager: {c.managerEmail}</p>
                    <p className="opacity-60">Status: {c.status}</p>
                    <p className="opacity-60">Members: {c.membersCount || 0}</p>
                    <p className="opacity-60">Events: {c.eventsCount || 0}</p>
                    <p className="opacity-60">Fee: ${c.membershipFee || 0}</p>
                    <div className="flex gap-3 mt-2">
                      {c.status === "pending" && (
                        <>
                          <button onClick={() => handleApproveClub(c._id)} className="btn-primary text-sm">Approve</button>
                          <button onClick={() => handleRejectClub(c._id)} className="btn-delete text-sm">Reject</button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-3xl font-bold mb-6">Payments</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {payments.map(p => (
                  <motion.div key={p._id} whileHover={{ scale: 1.03 }} className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition">
                    <p className="text-lg font-semibold">${p.amount}</p>
                    <p className="opacity-60 text-sm">{p.userEmail || p.userId?.email || p.userId?._id}</p>
                    <p className="opacity-60 text-sm">Type: {p.type || "membership"}</p>
                    <p className="opacity-60 text-sm">Date: {new Date(p.createdAt).toLocaleDateString()}</p>
                    <p className="text-indigo-400">{p.status || "paid"}</p>
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

export default AdminDashboard;
