import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, BookOpen, Brain, ChevronDown, ChevronUp, Loader2, WifiOff } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import { defaultStudyPlan } from '../data/mockData';
import { fetchStudyPlan, toggleStudyPlanComplete } from '../services/api';

const difficultyVariant = (d) => {
  if (d === 'Easy') return 'success';
  if (d === 'Medium') return 'warning';
  return 'danger';
};

const StudyPlan = () => {
  const [plan, setPlan] = useState([]);
  const [expandedDay, setExpandedDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const loadStudyPlan = async () => {
      setLoading(true);
      try {
        const backendData = await fetchStudyPlan();
        if (backendData && backendData.length > 0) {
          // Merge backend plans with detailed task lists
          const merged = backendData.map((bItem) => {
            const defaultItem = defaultStudyPlan.find((d) => d.day === bItem.day) || {};
            // If the day is marked complete in backend, ensure tasks reflect it or preserve existing
            const tasks = defaultItem.tasks ? defaultItem.tasks.map((t) => ({
              ...t,
              completed: bItem.completed ? true : t.completed,
            })) : [];

            return {
              id: bItem.id,
              day: bItem.day,
              title: defaultItem.title || bItem.topic,
              topic: bItem.topic,
              difficulty: bItem.difficulty || defaultItem.difficulty || 'Medium',
              estimatedTime: bItem.estimated_time || defaultItem.estimatedTime || '2 hours',
              description: bItem.description || defaultItem.description || '',
              completed: bItem.completed,
              tasks: tasks,
            };
          });
          setPlan(merged);
          localStorage.setItem('neuron_study_plan', JSON.stringify(merged));
          setUsingFallback(false);
        } else {
          throw new Error('No study plan returned');
        }
      } catch {
        const stored = localStorage.getItem('neuron_study_plan');
        if (stored) {
          setPlan(JSON.parse(stored));
        } else {
          setPlan(defaultStudyPlan);
          localStorage.setItem('neuron_study_plan', JSON.stringify(defaultStudyPlan));
        }
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    loadStudyPlan();
  }, []);

  const toggleTask = async (dayIndex, taskId) => {
    const targetDay = plan[dayIndex];
    const updatedTasks = targetDay.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const allCompleted = updatedTasks.every((t) => t.completed);

    const updated = plan.map((day, i) => {
      if (i === dayIndex) {
        return {
          ...day,
          completed: allCompleted,
          tasks: updatedTasks,
        };
      }
      return day;
    });

    setPlan(updated);
    localStorage.setItem('neuron_study_plan', JSON.stringify(updated));

    // If day completion status changed, sync with backend
    if (targetDay.id) {
      try {
        await toggleStudyPlanComplete(targetDay.id);
      } catch {
        // Fallback already saved in localStorage
      }
    }
  };

  const getDayProgress = (day) => {
    const total = day.tasks ? day.tasks.length : 1;
    const completed = day.tasks ? day.tasks.filter((t) => t.completed).length : (day.completed ? 1 : 0);
    return { total, completed, percentage: Math.round((completed / total) * 100) };
  };

  const overallProgress = () => {
    if (!plan || plan.length === 0) return { total: 0, completed: 0, percentage: 0 };
    const total = plan.reduce((acc, day) => acc + (day.tasks?.length || 1), 0);
    const completed = plan.reduce((acc, day) => acc + (day.tasks ? day.tasks.filter((t) => t.completed).length : (day.completed ? 1 : 0)), 0);
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const overall = overallProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-blue-400" />
        <span className="ml-3 text-gray-400 text-sm">Loading study plan...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Study Plan</h1>
        <p className="text-gray-400 mt-1">Your personalized 7-day learning roadmap</p>
      </div>

      {/* Fallback Banner */}
      {usingFallback && (
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
          <WifiOff size={14} />
          <span>Unable to connect to Neuron server. Showing saved data.</span>
        </div>
      )}

      {/* Overall Progress */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Brain size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Overall Progress</h3>
              <p className="text-xs text-gray-400">{overall.completed} of {overall.total} tasks completed</p>
            </div>
          </div>
          <div className="w-full sm:w-64">
            <ProgressBar value={overall.percentage} color="blue" size="lg" showLabel />
          </div>
        </div>
      </Card>

      {/* Day Cards */}
      <div className="space-y-3">
        {plan.map((day, dayIndex) => {
          const progress = getDayProgress(day);
          const isExpanded = expandedDay === day.day;

          return (
            <div key={day.day} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              {/* Day Header */}
              <button
                onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                    progress.percentage === 100
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : progress.percentage > 0
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    D{day.day}
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-white">{day.title}</h3>
                    <p className="text-xs text-gray-400">{day.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-3">
                    <Badge variant={difficultyVariant(day.difficulty)}>{day.difficulty}</Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />{day.estimatedTime}
                    </span>
                    <span className="text-xs text-gray-400">{progress.completed}/{progress.total}</span>
                  </div>
                  <div className="w-20 hidden sm:block">
                    <ProgressBar value={progress.percentage} color={progress.percentage === 100 ? 'green' : 'blue'} size="sm" />
                  </div>
                  {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
              </button>

              {/* Day Content */}
              {isExpanded && (
                <div className="border-t border-gray-800 p-5">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Badge variant="info">{day.topic}</Badge>
                    <Badge variant={difficultyVariant(day.difficulty)}>{day.difficulty}</Badge>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} />Est. {day.estimatedTime}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {day.tasks && day.tasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => toggleTask(dayIndex, task.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors text-left"
                      >
                        {task.completed ? (
                          <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Circle size={18} className="text-gray-600 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                          {task.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudyPlan;
