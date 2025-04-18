import { useState, useEffect } from "react"
import DashboardLayout from "../../components/layout/dashboard-layout"
import { CheckCircle, XCircle, Clock, TrendingUp, Users, FileText, ArrowUp, ArrowDown } from "lucide-react"
import axiosInstance from '../../api/axiosInstance';

const StatCard = ({ title, value, icon, color, gradient, trend }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-30 transition-all duration-300"></div>
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br opacity-[0.03]" style={{ background: gradient }} />
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className={`flex-shrink-0 rounded-xl p-3 ${color} bg-opacity-10`}>
              {icon}
            </div>
            {trend && (
              <div className={`flex items-center space-x-1 text-sm ${
                trend > 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {trend > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-bold text-gray-900">{value}</h3>
            <p className="mt-2 text-sm font-medium text-gray-600">{title}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ActivityItem = ({ icon, title, subtitle, time, status }) => (
  <li className="hover:bg-gray-50/50 transition-all duration-200">
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            status === 'New' ? 'text-emerald-700 bg-emerald-50' :
            status === 'Pending' ? 'text-amber-700 bg-amber-50' :
            'text-blue-700 bg-blue-50'
          }`}>
            {status}
          </span>
          <time className="text-xs text-gray-500 whitespace-nowrap">{time}</time>
        </div>
      </div>
    </div>
  </li>
)

const EmployerDashboard = () => {
  const [stats, setStats] = useState({
    leadsInProgress: 0,
    leadsCompleted: 0,
    leadsCanceled: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/employer/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setStats({
          leadsInProgress: response.data.inProgressCount || 0,
          leadsCompleted: response.data.completedCount || 0,
          leadsCanceled: response.data.canceledCount || 0
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard statistics");
        setLoading(false);
        console.error("Error fetching dashboard stats:", err);
      }
    };
    
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout userRole="employer">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
            <div className="w-16 h-16 border-4 border-transparent rounded-full absolute top-0 animate-ping"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout userRole="employer">
        <div className="bg-red-50/50 backdrop-blur-sm p-6 rounded-2xl border border-red-100">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-red-500" />
            <div className="ml-4">
              <h3 className="text-base font-semibold text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="employer">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h2>
            <p className="mt-2 text-gray-600">Track your business metrics and activity</p>
          </div>
          <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
            <time className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</time>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Leads in Progress"
            value={stats.leadsInProgress}
            icon={<Clock className="h-6 w-6 text-blue-600" />}
            color="text-blue-600"
            gradient="linear-gradient(135deg, #3b82f6, #1d4ed8)"
            trend={12}
          />
          <StatCard
            title="Leads Completed"
            value={stats.leadsCompleted}
            icon={<CheckCircle className="h-6 w-6 text-emerald-600" />}
            color="text-emerald-600"
            gradient="linear-gradient(135deg, #10b981, #059669)"
            trend={8}
          />
          <StatCard
            title="Leads Canceled"
            value={stats.leadsCanceled}
            icon={<XCircle className="h-6 w-6 text-rose-600" />}
            color="text-rose-600"
            gradient="linear-gradient(135deg, #f43f5e, #e11d48)"
            trend={-5}
          />
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              <ActivityItem
                icon={<Users className="w-6 h-6 text-blue-600" />}
                title="New Lead Assignment"
                subtitle="Sarah Wilson assigned to Project X"
                time="2 hours ago"
                status="New"
              />
              <ActivityItem
                icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}
                title="Lead Completed"
                subtitle="Marketing Campaign for ABC Corp"
                time="5 hours ago"
                status="Completed"
              />
              <ActivityItem
                icon={<Clock className="w-6 h-6 text-amber-600" />}
                title="Follow-up Required"
                subtitle="Client meeting scheduled for Tech Solutions"
                time="1 day ago"
                status="Pending"
              />
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EmployerDashboard