import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Plus, 
  DollarSign, 
  Users, 
  AlertCircle 
} from 'lucide-react';
import { UserProfile, AppSettings, UserRank } from '../types';

interface OwnerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  appSettings: AppSettings;
  allUsers: UserProfile[];
  onUpdateSettings: (settings: AppSettings) => void;
  onUpdateUserRank: (uid: string, rank: UserRank) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  isOpen,
  onClose,
  appSettings,
  allUsers,
  onUpdateSettings,
  onUpdateUserRank
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative z-10 w-full max-w-4xl bg-[#151619] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-[#ff4e00]" />
            <h2 className="text-2xl font-bold text-white">Owner Dashboard</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Price Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Global Pricing</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Pro Price ($)</label>
                <input 
                  type="number" 
                  value={appSettings.proPrice}
                  onChange={(e) => onUpdateSettings({ ...appSettings, proPrice: Number(e.target.value) })}
                  className="w-full bg-transparent border-none focus:ring-0 text-white text-xl font-bold"
                />
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Premium Price ($)</label>
                <input 
                  type="number" 
                  value={appSettings.premiumPrice}
                  onChange={(e) => onUpdateSettings({ ...appSettings, premiumPrice: Number(e.target.value) })}
                  className="w-full bg-transparent border-none focus:ring-0 text-white text-xl font-bold"
                />
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>User Management ({allUsers.length})</span>
            </h3>
            <div className="space-y-2">
              {allUsers.map(u => (
                <div key={u.uid} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                  <div className="flex items-center space-x-4">
                    <img src={u.photoURL} className="w-10 h-10 rounded-full border border-white/10" alt="User" />
                    <div>
                      <p className="text-sm font-bold text-white">{u.displayName}</p>
                      <p className="text-xs text-white/40">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {(u as any).requestedRank && (
                      <div className="flex items-center space-x-1 px-2 py-1 rounded bg-yellow-500/20 border border-yellow-500/50 text-yellow-500 animate-pulse">
                        <AlertCircle className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase">Wants {(u as any).requestedRank}</span>
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Messages</p>
                      <p className="text-sm font-bold text-white">{u.messageCount || 0}</p>
                    </div>
                    <select 
                      value={u.rank}
                      onChange={(e) => onUpdateUserRank(u.uid, e.target.value as UserRank)}
                      className="bg-[#0a0502] border border-white/10 rounded-lg text-xs font-bold py-2 px-4 focus:ring-[#ff4e00]"
                    >
                      <option value="normal">Normal</option>
                      <option value="pro">Pro</option>
                      <option value="premium">Premium</option>
                      <option value="owner">Owner</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
