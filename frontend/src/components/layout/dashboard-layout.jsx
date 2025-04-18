import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Users, FileText, User, Bell, Settings } from 'lucide-react';

const DashboardLayout = ({ children, userRole }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isEmployer = userRole === "employer";
  
  const employerLinks = [
    { name: "Dashboard", href: "/employer/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Managers", href: "/employer/managers", icon: <Users className="w-5 h-5" /> },
    { name: "Leads", href: "/employer/leads", icon: <FileText className="w-5 h-5" /> },
  ];
  
  const managerLinks = [
    { name: "Leads", href: "/manager/leads", icon: <FileText className="w-5 h-5" /> },
  ];
  
  const links = isEmployer ? employerLinks : managerLinks;
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-800/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col w-full max-w-xs h-full bg-white/95 backdrop-blur-xl">
          <div className="absolute top-4 right-4">
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center px-6 py-8">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              CRM System
            </span>
          </div>
          
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {links.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`${
                  location.pathname === item.href
                    ? "bg-blue-50 text-blue-600 border-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"
                } flex items-center px-4 py-3 text-sm font-medium rounded-xl border transition-all duration-200`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </a>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-72">
        <div className="flex flex-col flex-1 bg-white/95 backdrop-blur-xl border-r border-gray-100">
          <div className="flex items-center px-6 py-8">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              CRM System
            </span>
          </div>
          
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {links.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`${
                  location.pathname === item.href
                    ? "bg-blue-50 text-blue-600 border-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"
                } flex items-center px-4 py-3 text-sm font-medium rounded-xl border transition-all duration-200`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </a>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center p-3 bg-gray-50 rounded-xl">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900">
                  {isEmployer ? "Employer" : "Manager"}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <header className="relative z-10 flex h-16 bg-white/95 backdrop-blur-xl border-b border-gray-100">
          <button
            className="px-4 text-gray-500 lg:hidden focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex justify-between flex-1 px-4">
            <div className="flex flex-1">
              <h1 className="text-xl font-semibold text-gray-900 my-auto">
                {links.find(link => link.href === location.pathname)?.name || "Dashboard"}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full" />
              </button>

              <div className="relative">
                <button className="flex items-center p-1.5 text-sm bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="relative flex-1 overflow-y-auto">
          <div className="py-8">
            <div className="px-6 mx-auto max-w-7xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;