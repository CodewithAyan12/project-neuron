import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import Analytics from './pages/Analytics';
import AIMentor from './pages/AIMentor';
import StudyPlan from './pages/StudyPlan';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai-mentor" element={<AIMentor />} />
            <Route path="/study-plan" element={<StudyPlan />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
