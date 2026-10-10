import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Problems ────────────────────────────────────────────
export const fetchProblems = async () => {
  const res = await api.get('/api/problems');
  return res.data;
};

export const createProblem = async (problemData) => {
  const res = await api.post('/api/problems', problemData);
  return res.data;
};

export const deleteProblem = async (problemId) => {
  const res = await api.delete(`/api/problems/${problemId}`);
  return res.data;
};

// ── Analytics / Dashboard ───────────────────────────────
export const fetchAnalytics = async () => {
  const res = await api.get('/api/analytics');
  return res.data;
};

// ── Study Plan ──────────────────────────────────────────
export const fetchStudyPlan = async () => {
  const res = await api.get('/api/study-plan');
  return res.data;
};

export const toggleStudyPlanComplete = async (planId) => {
  const res = await api.post(`/api/study-plan/${planId}/complete`);
  return res.data;
};

// ── AI Mentor ───────────────────────────────────────────
export const sendAIChat = async (message, userId = 1) => {
  const res = await api.post('/api/ai/chat', { message, user_id: userId });
  return res.data;
};

export default api;
