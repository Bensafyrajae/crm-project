import { useState, useEffect } from "react"
import DashboardLayout from "../../components/layout/dashboard-layout"
import { CheckCircle, XCircle, Clock, TrendingUp, Users, FileText, ArrowUp, ArrowDown } from "lucide-react"
import axiosInstance from '../../api/axiosInstance';

// StatCard Component
const StatCard = ({ title, value, icon, color, gradient, trend }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-md opacity-20 group-hover:opacity-30 transition-all duration-300"></div>
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br opacity-[0.05]" style={{ background: gradient }} />
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
            <h3 className="text-4xl font-extrabold text-gray-900">{value}</h3>
            <p className="mt-2 text-sm font-medium text-gray-600">{title}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ActivityItem Component
const ActivityItem = ({ title, percentage, color }) => (
  <div className="flex flex-col items-center space-y-4">
    {/* Cercle statistique */}
    <div className="relative w-24 h-24">
      <div
        className={`absolute inset-0 rounded-full border-8 ${color} border-opacity-30`}
      ></div>
      <div
        className={`absolute inset-0 rounded-full border-8 ${color} border-t-transparent animate-spin`}
        style={{
          transform: `rotate(${(percentage / 100) * 360}deg)`,
        }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-semibold text-gray-900">{percentage}%</span>
      </div>
    </div>
    {/* Titre */}
    <p className="text-sm font-medium text-gray-700">{title}</p>
  </div>
);

// OverallStatsCircle Component
const OverallStatsCircle = ({ stats }) => {
  const total = stats.leadsInProgress + stats.leadsCompleted + stats.leadsCanceled;

  const progressInProgress = (stats.leadsInProgress / total) * 100;
  const progressCompleted = (stats.leadsCompleted / total) * 100;
  const progressCanceled = (stats.leadsCanceled / total) * 100;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Cercle statistique global */}
      <div className="relative w-48 h-48">
        {/* Cercle de base */}
        <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>

        {/* Segment "Leads in Progress" */}
        <div
          className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent"
          style={{
            transform: `rotate(${(progressInProgress / 100) * 360}deg)`,
          }}
        ></div>

        {/* Segment "Leads Completed" */}
        <div
          className="absolute inset-0 rounded-full border-8 border-emerald-500 border-t-transparent"
          style={{
            transform: `rotate(${(progressCompleted / 100) * 360 + (progressInProgress / 100) * 360}deg)`,
          }}
        ></div>

        {/* Segment "Leads Canceled" */}
        <div
          className="absolute inset-0 rounded-full border-8 border-rose-500 border-t-transparent"
          style={{
            transform: `rotate(${(progressCanceled / 100) * 360 + (progressCompleted / 100) * 360 + (progressInProgress / 100) * 360}deg)`,
          }}
        ></div>

        {/* Texte au centre */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-900">Total</h3>
          <p className="text-2xl font-extrabold text-gray-900">{total}</p>
        </div>
      </div>

      {/* Légende */}
      <div className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 rounded-full bg-blue-500"></span>
          <span className="text-sm text-gray-700">In Progress</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 rounded-full bg-emerald-500"></span>
          <span className="text-sm text-gray-700">Completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 rounded-full bg-rose-500"></span>
          <span className="text-sm text-gray-700">Canceled</span>
        </div>
      </div>
    </div>
  );
};

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
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
          <OverallStatsCircle stats={stats} />
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
                title="New Lead Assignment"
                percentage={75}
                color="border-blue-600"
              />
              <ActivityItem
                title="Lead Completed"
                percentage={100}
                color="border-emerald-600"
              />
              <ActivityItem
                title="Follow-up Required"
                percentage={50}
                color="border-amber-600"
              />
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EmployerDashboard