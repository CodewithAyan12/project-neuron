import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  BarChart3,
  Bot,
  BookOpen,
  User,
  Settings,
  Brain,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/problems', label: 'Problems', icon: Code2 },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/ai-mentor', label: 'AI Mentor', icon: Bot },
  { path: '/study-plan', label: 'Study Plan', icon: BookOpen },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { logout } = useAuth();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gray-950 border-r border-gray-800 flex flex-col z-40 transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Brain size={18} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold text-white tracking-tight">Neuron</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`
            }
          >
            <Icon size={20} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-gray-800 space-y-1">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800/50 transition-colors w-full"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800/50 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
