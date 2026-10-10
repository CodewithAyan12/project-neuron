import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate brief loading
    await new Promise(r => setTimeout(r, 500));
    
    const result = login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Brain size={28} className="text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">Project Neuron</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your AI-Powered<br />Coding Mentor
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Track your progress, identify weaknesses, and get personalized guidance to become a better programmer.
          </p>
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center">
                <Sparkles size={16} className="text-blue-400" />
              </div>
              <span className="text-sm">AI-powered performance analysis</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 bg-emerald-600/10 rounded-lg flex items-center justify-center">
                <Sparkles size={16} className="text-emerald-400" />
              </div>
              <span className="text-sm">Personalized study plans</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 bg-purple-600/10 rounded-lg flex items-center justify-center">
                <Sparkles size={16} className="text-purple-400" />
              </div>
              <span className="text-sm">Smart coding mentor chatbot</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Brain size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Neuron</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-gray-400 mb-8">Sign in to continue your learning journey</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@neuron.ai"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-gray-950 text-gray-500">or</span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles size={16} className="text-blue-400" />
            Continue as Demo User
          </button>

          <p className="mt-6 text-center text-xs text-gray-500">
            Demo credentials: demo@neuron.ai / neuron123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
