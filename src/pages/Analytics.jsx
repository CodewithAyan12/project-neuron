import { useState, useEffect } from 'react';
import { BarChart3, Clock, Flame, TrendingUp, AlertTriangle, Lightbulb, Loader2, WifiOff } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import StatCard from '../components/common/StatCard';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import Badge from '../components/common/Badge';
import {
  analyticsStats as mockAnalyticsStats,
  weeklyCodingActivity,
  topicPerformance as mockTopicPerformance,
  difficultyDistribution as mockDifficultyDistribution,
  weakAreas as mockWeakAreas,
  aiLearningInsights,
} from '../data/mockData';
import { fetchAnalytics } from '../services/api';

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

const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-semibold text-white">{payload[0].name}: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [stats, setStats] = useState(mockAnalyticsStats);
  const [topicPerf, setTopicPerf] = useState(mockTopicPerformance);
  const [difficultyDist, setDifficultyDist] = useState(mockDifficultyDistribution);
  const [weakAreasList, setWeakAreasList] = useState(mockWeakAreas);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const data = await fetchAnalytics();
        if (data) {
          setStats({
            problemsSolved: data.total_problems || mockAnalyticsStats.problemsSolved,
            avgSolveTime: `${data.average_solve_time || 22} min`,
            currentStreak: mockAnalyticsStats.currentStreak,
            successRate: mockAnalyticsStats.successRate,
          });

          if (data.easy_count !== undefined) {
            setDifficultyDist([
              { name: 'Easy', value: data.easy_count, color: '#10b981' },
              { name: 'Medium', value: data.medium_count, color: '#f59e0b' },
              { name: 'Hard', value: data.hard_count, color: '#ef4444' },
            ]);
          }

          if (data.topic_performance && data.topic_performance.length > 0) {
            const colorMap = {
              'Arrays': '#10b981',
              'Strings': '#3b82f6',
              'Linked List': '#8b5cf6',
              'Trees': '#f59e0b',
              'Graphs': '#ef4444',
              'Dynamic Programming': '#ef4444',
            };
            setTopicPerf(
              data.topic_performance.map((t) => ({
                topic: t.topic,
                score: t.score,
                color: colorMap[t.topic] || '#6b7280',
              }))
            );

            // Filter topics with score < 70 as weak areas
            const lowTopics = data.topic_performance
              .filter((t) => t.score < 70)
              .map((t) => ({
                topic: t.topic,
                score: t.score,
                suggestion: `Focus on fundamentals and transition patterns for ${t.topic}.`,
              }));
            if (lowTopics.length > 0) {
              setWeakAreasList(lowTopics);
            }
          }
          setUsingFallback(false);
        }
      } catch {
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-purple-400" />
        <span className="ml-3 text-gray-400 text-sm">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 mt-1">Deep dive into your coding performance</p>
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
        <StatCard title="Problems Solved" value={stats.problemsSolved} icon={BarChart3} color="blue" />
        <StatCard title="Avg Solve Time" value={stats.avgSolveTime} icon={Clock} color="purple" />
        <StatCard title="Current Streak" value={`${stats.currentStreak} Days`} icon={Flame} color="orange" />
        <StatCard title="Success Rate" value={stats.successRate} icon={TrendingUp} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coding Activity */}
        <Card title="Weekly Coding Activity" subtitle="Problems solved per week">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyCodingActivity}>
                <defs>
                  <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="problems" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorWeekly)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Difficulty Distribution */}
        <Card title="Difficulty Distribution" subtitle="Breakdown by difficulty level">
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {difficultyDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Topic Performance */}
        <Card title="Topic Performance" subtitle="Your proficiency across topics">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicPerf} layout="vertical">
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis type="category" dataKey="topic" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} width={120} />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
                        <p className="text-sm font-semibold text-white">{payload[0].value}%</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {topicPerf.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weak Areas */}
        <Card title="Weak Areas" subtitle="Topics that need attention">
          <div className="space-y-4">
            {weakAreasList.map((area) => (
              <div key={area.topic} className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-400" />
                    <span className="text-sm font-medium text-white">{area.topic}</span>
                  </div>
                  <Badge variant={area.score < 50 ? 'danger' : 'warning'}>{area.score}%</Badge>
                </div>
                <p className="text-xs text-gray-400">{area.suggestion}</p>
                <div className="mt-2">
                  <ProgressBar value={area.score} color={area.score < 50 ? 'red' : 'orange'} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AI Learning Insights */}
      <Card title="AI Learning Insights" subtitle="Personalized observations about your learning pattern">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiLearningInsights.map((insight, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
              <Lightbulb size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300">{insight}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
