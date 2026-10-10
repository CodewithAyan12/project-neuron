import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Code2, Clock, StickyNote, Trash2, Loader2, WifiOff } from 'lucide-react';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { defaultProblems, platforms, topics, difficulties, languages, statuses } from '../data/mockData';
import { fetchProblems, createProblem, deleteProblem as deleteProblemAPI } from '../services/api';

const difficultyVariant = (d) => {
  if (d === 'Easy') return 'success';
  if (d === 'Medium') return 'warning';
  return 'danger';
};

const statusVariant = (s) => {
  if (s === 'Solved') return 'success';
  if (s === 'Attempted') return 'warning';
  return 'info';
};

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [form, setForm] = useState({
    title: '',
    platform: 'LeetCode',
    topic: 'Arrays',
    difficulty: 'Easy',
    language: 'Python',
    timeTaken: '',
    notes: '',
    status: 'Solved',
  });

  // Load from backend → fallback to localStorage → fallback to defaults
  useEffect(() => {
    const loadProblems = async () => {
      setLoading(true);
      try {
        const data = await fetchProblems();
        // Normalize backend fields to match frontend expectations
        const normalized = data.map((p) => ({
          ...p,
          id: String(p.id),
          timeTaken: p.time_taken || p.timeTaken || '',
          date: p.created_at ? p.created_at.split('T')[0] : p.date || '',
        }));
        setProblems(normalized);
        localStorage.setItem('neuron_problems', JSON.stringify(normalized));
        setUsingFallback(false);
      } catch {
        // Backend unavailable → fallback
        const stored = localStorage.getItem('neuron_problems');
        if (stored) {
          setProblems(JSON.parse(stored));
        } else {
          setProblems(defaultProblems);
          localStorage.setItem('neuron_problems', JSON.stringify(defaultProblems));
        }
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };
    loadProblems();
  }, []);

  // Keep localStorage in sync
  useEffect(() => {
    if (problems.length > 0) {
      localStorage.setItem('neuron_problems', JSON.stringify(problems));
    }
  }, [problems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProblem = {
      ...form,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };

    // Optimistic UI update
    setProblems((prev) => [newProblem, ...prev]);
    setForm({
      title: '',
      platform: 'LeetCode',
      topic: 'Arrays',
      difficulty: 'Easy',
      language: 'Python',
      timeTaken: '',
      notes: '',
      status: 'Solved',
    });
    setIsModalOpen(false);

    // Sync with backend
    try {
      const saved = await createProblem({
        title: newProblem.title,
        platform: newProblem.platform,
        topic: newProblem.topic,
        difficulty: newProblem.difficulty,
        language: newProblem.language,
        time_taken: newProblem.timeTaken,
        notes: newProblem.notes,
        status: newProblem.status,
      });
      // Replace optimistic entry with backend-confirmed entry
      setProblems((prev) =>
        prev.map((p) =>
          p.id === newProblem.id
            ? { ...saved, id: String(saved.id), timeTaken: saved.time_taken || '', date: saved.created_at?.split('T')[0] || newProblem.date }
            : p
        )
      );
      setUsingFallback(false);
    } catch {
      // Optimistic entry stays in localStorage — silent fallback
      setUsingFallback(true);
    }
  };

  const handleDelete = async (id) => {
    const updated = problems.filter((p) => String(p.id) !== String(id));
    setProblems(updated);
    localStorage.setItem('neuron_problems', JSON.stringify(updated));

    try {
      await deleteProblemAPI(id);
    } catch {
      // Already removed from UI — no crash
    }
  };

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const matchesTopic = topicFilter === 'All' || p.topic === topicFilter;
    return matchesSearch && matchesDifficulty && matchesTopic;
  });

  const inputClass = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Problems</h1>
          <p className="text-gray-400 mt-1">Track and manage your coding problems</p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add Problem</Button>
      </div>

      {/* Fallback Banner */}
      {usingFallback && (
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
          <WifiOff size={14} />
          <span>Unable to connect to Neuron server. Showing saved data.</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-blue-400" />
          <span className="ml-3 text-gray-400 text-sm">Loading problems...</span>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-700"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-gray-700 appearance-none cursor-pointer"
              >
                <option value="All">All Difficulties</option>
                {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-gray-700 appearance-none cursor-pointer"
              >
                <option value="All">All Topics</option>
                {topics.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex gap-4 text-sm">
            <span className="text-gray-400">Total: <span className="text-white font-medium">{problems.length}</span></span>
            <span className="text-gray-400">Showing: <span className="text-white font-medium">{filteredProblems.length}</span></span>
            <span className="text-gray-400">Solved: <span className="text-emerald-400 font-medium">{problems.filter(p => p.status === 'Solved').length}</span></span>
          </div>

          {/* Problems Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Problem</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Topic</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Difficulty</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Language</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.map((problem) => (
                    <tr key={problem.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-sm font-medium text-white">{problem.title}</p>
                          <p className="text-xs text-gray-500">{problem.platform}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant="purple" size="sm">{problem.topic}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={difficultyVariant(problem.difficulty)} size="sm">{problem.difficulty}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={statusVariant(problem.status)} size="sm">{problem.status}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-300">{problem.language}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock size={12} />{problem.timeTaken || problem.time_taken} min
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-500">{problem.date}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleDelete(problem.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredProblems.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Code2 size={40} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">No problems found</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Problem Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Problem" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Problem Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Two Sum"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Platform</label>
              <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className={inputClass}>
                {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Topic</label>
              <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className={inputClass}>
                {topics.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Difficulty</label>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className={inputClass}>
                {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Language</label>
              <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className={inputClass}>
                {languages.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Time Taken (minutes)</label>
              <input
                type="number"
                value={form.timeTaken}
                onChange={(e) => setForm({ ...form, timeTaken: e.target.value })}
                placeholder="e.g. 25"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any notes about the approach, mistakes, etc."
                rows={3}
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" icon={Plus}>Add Problem</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Problems;
