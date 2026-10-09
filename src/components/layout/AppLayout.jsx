import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AppLayout = () => {
  const { user, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`${collapsed ? 'ml-[68px]' : 'ml-60'} min-h-screen flex flex-col transition-all duration-300`}>
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
