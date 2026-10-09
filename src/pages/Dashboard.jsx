import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Brain, Flame, Target, AlertTriangle, ArrowRight, Lightbulb, Clock, Loader2, WifiOff } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/common/StatCard';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import { useAuth } from '../contexts/AuthContext';
import {
  dashboardStats,
  todaysMissions,
  topicPerformance as mockTopicPerformance,
  codingActivity,
  aiInsight,
  recentActivity as mockRecentActivity,
  recommendedProblems,
} from '../data/mockData';
import { fetchAnalytics } from '../services/api';

const difficultyVariant = (d) => {
  if (d === 'Easy') return 'success';
  if (d === 'Medium') return 'warning';
  return 'danger';
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-white">{payload[0].value} problems</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Ayan';

  const [stats, setStats] = useState(dashboardStats);
  const [topicPerformance, setTopicPerformance] = useState(mockTopicPerformance);
  const [recentActivity, setRecentActivity] = useState(mockRecentActivity);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const data = await fetchAnalytics();
        // Map backend analytics to dashboard stat cards
        setStats({
          problemsSolved: data.total_problems || dashboardStats.problemsSolved,
          currentStreak: dashboardStats.currentStreak, // streak not yet tracked by backend
          confidenceScore: dashboardStats.confidenceScore,
          weakestTopic: data.topic_performance
            ? data.topic_performance.reduce((min, t) => (t.score < min.score ? t : min), data.topic_performance[0])?.topic || dashboardStats.weakestTopic
            : dashboardStats.weakestTopic,
        });

        // Map backend topic performance (add colors for the progress bars)
        if (data.topic_performance && data.topic_performance.length > 0) {
          const colorMap = {
            'Arrays': '#10b981',
            'Strings': '#3b82f6',
            'Linked List': '#8b5cf6',
            'Trees': '#f59e0b',
            'Graphs': '#ef4444',
            'Dynamic Programming': '#ef4444',
          };
          setTopicPerformance(
            data.topic_performance.map((t) => ({
              topic: t.topic,
              score: t.score,
              color: colorMap[t.topic] || '#6b7280',
            }))
          );
        }

        // Map backend recent activity
        if (data.recent_activity && data.recent_activity.length > 0) {
          setRecentActivity(
            data.recent_activity.map((a) => ({
              id: a.id,
              title: a.title,
              platform: a.platform,
              difficulty: a.difficulty,
              status: a.status,
              time: a.time,
              date: a.date,
            }))
          );
        }
        setUsingFallback(false);
      } catch {
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-blue-400" />
        <span className="ml-3 text-gray-400 text-sm">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-white">{getGreeting()}, {firstName}</h1>
        <p className="text-gray-400 mt-1">Let's improve your coding skills today.</p>
      </div>

      {/* Fallback Banner */}
      {usingFallback && (
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
          <WifiOff size={14} />
          <span>Unable to connect to Neuron server. Showing saved data.</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Problems Solved" value={stats.problemsSolved} icon={Target} color="blue" />
        <StatCard title="Current Streak" value={`${stats.currentStreak} Days`} icon={Flame} color="orange" />
        <StatCard title="Confidence Score" value={`${stats.confidenceScore}%`} icon={Brain} color="green" />
        <StatCard title="Weakest Topic" value={stats.weakestTopic} subtitle="Needs attention" icon={AlertTriangle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Coding Activity Chart */}
          <Card title="Coding Activity" subtitle="Problems solved this week">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={codingActivity}>
                  <defs>
                    <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="problems" stroke="#3b82f6" strokeWidth={2} fill="url(#colorProblems)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Topic Performance */}
          <Card title="Topic Performance" subtitle="Your proficiency across topics">
            <div className="space-y-4">
              {topicPerformance.map(({ topic, score }) => (
                <div key={topic} className="flex items-center gap-4">
                  <span className="text-sm text-gray-300 w-40 flex-shrink-0">{topic}</span>
                  <ProgressBar
                    value={score}
                    color={score >= 75 ? 'green' : score >= 60 ? 'blue' : score >= 50 ? 'orange' : 'red'}
                    showLabel
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card title="Recent Activity" subtitle="Your latest problem attempts">
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'Solved' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.platform} · {item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={difficultyVariant(item.difficulty)}>{item.difficulty}</Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} />{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Today's Mission */}
          <Card title="Today's Mission" subtitle="Complete these to stay on track">
            <div className="space-y-3">
              {todaysMissions.map((mission) => (
                <div key={mission.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  {mission.completed ? (
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle size={18} className="text-gray-600 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${mission.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                    {mission.task}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Insight */}
          <Card>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb size={16} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">AI Insight</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{aiInsight}</p>
              </div>
            </div>
          </Card>

          {/* Recommended Problems */}
          <Card title="Recommended Problems" subtitle="Based on your weak areas">
            <div className="space-y-3">
              {recommendedProblems.map((prob) => (
                <div key={prob.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-white">{prob.title}</p>
                    <p className="text-xs text-gray-500">{prob.topic}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={difficultyVariant(prob.difficulty)} size="xs">{prob.difficulty}</Badge>
                    <ArrowRight size={14} className="text-gray-600" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
