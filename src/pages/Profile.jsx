import { User, Mail, GraduationCap, Calendar, Target, Award, AlertTriangle, BookOpen } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import { useAuth } from '../contexts/AuthContext';
import { dashboardStats, topicPerformance } from '../data/mockData';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 mt-1">Your coding profile and statistics</p>
      </div>

      {/* Profile Header */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user?.name?.split(' ').map((n) => n[0]).join('') || 'AS'}
            </span>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">{user?.name || 'Ayan Sharma'}</h2>
            <p className="text-gray-400 flex items-center gap-2 justify-center sm:justify-start mt-1">
              <GraduationCap size={16} />
              {user?.degree || 'B.Tech Information Technology'}
            </p>
            <p className="text-gray-500 flex items-center gap-2 justify-center sm:justify-start mt-0.5">
              <Mail size={14} />
              {user?.email || 'demo@neuron.ai'}
            </p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
              <Badge variant="info">{user?.year || '4th Year'}</Badge>
              <Badge variant="success">{user?.college || 'University of Technology'}</Badge>
            </div>
          </div>
        </div>
        {user?.bio && <p className="text-sm text-gray-400 mt-4 pt-4 border-t border-gray-800">{user.bio}</p>}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coding Statistics */}
        <Card title="Coding Statistics">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">{dashboardStats.problemsSolved}</p>
              <p className="text-xs text-gray-400 mt-1">Problems Solved</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">{dashboardStats.currentStreak}</p>
              <p className="text-xs text-gray-400 mt-1">Day Streak</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">{dashboardStats.confidenceScore}%</p>
              <p className="text-xs text-gray-400 mt-1">Confidence Score</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">84%</p>
              <p className="text-xs text-gray-400 mt-1">Success Rate</p>
            </div>
          </div>
        </Card>

        {/* Topic Performance */}
        <Card title="Topic Proficiency">
          <div className="space-y-3">
            {topicPerformance.map(({ topic, score }) => (
              <div key={topic} className="flex items-center gap-3">
                <span className="text-sm text-gray-300 w-36 flex-shrink-0">{topic}</span>
                <ProgressBar
                  value={score}
                  color={score >= 75 ? 'green' : score >= 60 ? 'blue' : score >= 50 ? 'orange' : 'red'}
                  showLabel
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Strengths */}
        <Card title="Strengths">
          <div className="space-y-2">
            {(user?.strengths || ['Arrays', 'Strings', 'Hash Tables', 'Sorting']).map((s) => (
              <div key={s} className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                <Award size={16} className="text-emerald-400" />
                <span className="text-sm text-gray-200">{s}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Weak Areas */}
        <Card title="Areas to Improve">
          <div className="space-y-2">
            {(user?.weakAreas || ['Dynamic Programming', 'Graphs', 'Trees']).map((w) => (
              <div key={w} className="flex items-center gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                <AlertTriangle size={16} className="text-amber-400" />
                <span className="text-sm text-gray-200">{w}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Learning Goals */}
        <Card title="Learning Goals" className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(user?.goals || ['Master Dynamic Programming', 'Solve 500 problems', 'Crack FAANG interviews', 'Learn System Design']).map((goal) => (
              <div key={goal} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <Target size={16} className="text-blue-400 flex-shrink-0" />
                <span className="text-sm text-gray-200">{goal}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
