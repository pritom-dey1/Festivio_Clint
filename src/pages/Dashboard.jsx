import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../components/Dashboard/AdminDashboard";
import ManagerDashboard from "../components/Dashboard/ManagerDashboard";
import MemberDashboard from "../components/Dashboard/MemberDashboard";
import Loader from "../components/Loader";

const Dashboard = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      let url = ""
      if (user.role === "admin") url = "/api/dashboard/admin/overview"
      else if (user.role === "clubManager") url = "/api/dashboard/manager/overview"
      else url = "/api/dashboard/member/overview"

      const res = await axios.get(url, { withCredentials: true })
      setDashboardData(res.data)
    }
    fetchData()
  }, [user])

  if (!dashboardData) return <Loader />

  switch (user.role) {
    case "admin":
      return <AdminDashboard data={dashboardData} />
    case "clubManager":
      return <ManagerDashboard data={dashboardData} />
    case "member":
      return <MemberDashboard data={dashboardData} />
    default:
      return <p>Invalid role</p>
  }
}

export default Dashboard;
