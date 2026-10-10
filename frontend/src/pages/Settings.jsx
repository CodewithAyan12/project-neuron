import { useState } from 'react';
import { Bell, Moon, Globe, Shield, Palette, Save, RotateCcw } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    emailNotifications: false,
    weeklyReport: true,
    dailyReminder: true,
    reminderTime: '09:00',
    language: 'English',
    timezone: 'Asia/Kolkata (IST)',
    difficulty: 'Medium',
    dailyGoal: 3,
    showStreak: true,
    publicProfile: false,
  });

  const [saved, setSaved] = useState(false);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('neuron_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings({
      darkMode: true,
      notifications: true,
      emailNotifications: false,
      weeklyReport: true,
      dailyReminder: true,
      reminderTime: '09:00',
      language: 'English',
      timezone: 'Asia/Kolkata (IST)',
      difficulty: 'Medium',
      dailyGoal: 3,
      showStreak: true,
      publicProfile: false,
    });
    setSaved(false);
  };

  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const inputClass = 'bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your application preferences</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={RotateCcw} onClick={handleReset}>Reset</Button>
          <Button icon={Save} onClick={handleSave}>
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Appearance */}
      <Card title="Appearance" subtitle="Customize the look and feel">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-white">Dark Mode</p>
                <p className="text-xs text-gray-500">Use dark theme across the application</p>
              </div>
            </div>
            <Toggle enabled={settings.darkMode} onChange={() => handleToggle('darkMode')} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette size={18} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-white">Show Streak Badge</p>
                <p className="text-xs text-gray-500">Display streak counter on dashboard</p>
              </div>
            </div>
            <Toggle enabled={settings.showStreak} onChange={() => handleToggle('showStreak')} />
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card title="Notifications" subtitle="Configure your notification preferences">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-white">Push Notifications</p>
                <p className="text-xs text-gray-500">Receive push notifications for reminders</p>
              </div>
            </div>
            <Toggle enabled={settings.notifications} onChange={() => handleToggle('notifications')} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-white">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive weekly progress reports via email</p>
              </div>
            </div>
            <Toggle enabled={settings.emailNotifications} onChange={() => handleToggle('emailNotifications')} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-white">Daily Reminder</p>
                <p className="text-xs text-gray-500">Get reminded to practice daily</p>
              </div>
            </div>
            <Toggle enabled={settings.dailyReminder} onChange={() => handleToggle('dailyReminder')} />
          </div>
          {settings.dailyReminder && (
            <div className="ml-9">
              <label className="block text-sm text-gray-400 mb-1">Reminder Time</label>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => handleChange('reminderTime', e.target.value)}
                className={inputClass}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Practice */}
      <Card title="Practice Preferences" subtitle="Set your coding practice goals">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Default Difficulty</label>
            <select
              value={settings.difficulty}
              onChange={(e) => handleChange('difficulty', e.target.value)}
              className={inputClass}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Daily Problem Goal</label>
            <input
              type="number"
              min="1"
              max="20"
              value={settings.dailyGoal}
              onChange={(e) => handleChange('dailyGoal', parseInt(e.target.value, 10))}
              className={inputClass}
            />
          </div>
        </div>
      </Card>

      {/* General */}
      <Card title="General" subtitle="Language and regional settings">
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white mb-1">
              <Globe size={16} className="text-gray-400" /> Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className={inputClass}
            >
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className={inputClass}
            >
              <option>Asia/Kolkata (IST)</option>
              <option>UTC</option>
              <option>America/New_York (EST)</option>
              <option>Europe/London (GMT)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Privacy */}
      <Card title="Privacy" subtitle="Control your data visibility">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-white">Public Profile</p>
              <p className="text-xs text-gray-500">Allow others to see your coding profile</p>
            </div>
          </div>
          <Toggle enabled={settings.publicProfile} onChange={() => handleToggle('publicProfile')} />
        </div>
      </Card>
    </div>
  );
};

export default Settings;
