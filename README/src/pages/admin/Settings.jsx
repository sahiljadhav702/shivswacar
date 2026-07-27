import { Globe } from 'lucide-react';
import { User } from 'lucide-react';
import { Bell } from 'lucide-react';
import { Shield } from 'lucide-react';
import { Save } from 'lucide-react';

import { useState } from 'react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">System Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your garage administration preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          <button onClick={() => setActiveTab('general')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${activeTab === 'general' ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30 translate-x-1' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50 hover:translate-x-1'}`}>
            <Globe className="w-5 h-5" /> General
          </button>
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${activeTab === 'profile' ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30 translate-x-1' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50 hover:translate-x-1'}`}>
            <User className="w-5 h-5" /> Profile
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${activeTab === 'notifications' ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30 translate-x-1' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50 hover:translate-x-1'}`}>
            <Bell className="w-5 h-5" /> Notifications
          </button>
          <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${activeTab === 'security' ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30 translate-x-1' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50 hover:translate-x-1'}`}>
            <Shield className="w-5 h-5" /> Security
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-panel rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSave} className="space-y-8">
              
              {activeTab === 'general' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Garage Information</h3>
                    <div className="h-px w-full bg-slate-200 dark:bg-slate-700/50 mt-4"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Business Name</label>
                      <input type="text" defaultValue="AutoCare Pro" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Currency</label>
                      <select className="input-field">
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Business Address</label>
                      <textarea rows="3" defaultValue="123 Mechanic Street, Auto City" className="input-field resize-none"></textarea>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Profile</h3>
                    <div className="h-px w-full bg-slate-200 dark:bg-slate-700/50 mt-4"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                      <input type="text" defaultValue="Super Admin" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                      <input type="email" defaultValue="admin@autocarepro.com" className="input-field" />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6 mt-8 border-t border-slate-200 dark:border-slate-700/50 flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 active:scale-95">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Settings;
