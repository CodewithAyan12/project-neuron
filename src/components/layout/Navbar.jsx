import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3 flex-1">
        <div className="relative max-w-md w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search problems, topics..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-white">
              {user?.name?.split(' ').map((n) => n[0]).join('') || 'AS'}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">{user?.name || 'Ayan Sharma'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'demo@neuron.ai'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
