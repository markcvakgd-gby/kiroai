import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  LogOut, 
  Shield, 
  Zap, 
  Crown, 
  Settings 
} from 'lucide-react';
import { ChatSession, UserProfile } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (id: string) => void;
  profile: UserProfile | null;
  onLogout: () => void;
  onShowUpgrade: () => void;
  onShowOwner: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  profile,
  onLogout,
  onShowUpgrade,
  onShowOwner
}) => {
  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'owner': return <Shield className="w-4 h-4 text-[#ff4e00]" />;
      case 'premium': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'pro': return <Zap className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
  };

  return (
    <div className="w-80 bg-[#0a0502] border-r border-white/5 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff4e00] to-[#ff8e00] flex items-center justify-center shadow-lg shadow-[#ff4e00]/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white">KIRO<span className="text-[#ff4e00]">AI</span></h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Universal Assistant</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="px-6 pb-6">
        <button 
          onClick={onCreateSession}
          className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center space-x-3 transition-all group active:scale-95"
        >
          <Plus className="w-5 h-5 text-[#ff4e00] group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-sm font-bold text-white">New Session</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
        {sessions.map(session => (
          <div 
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
              currentSessionId === session.id 
                ? 'bg-white/10 border border-white/10' 
                : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0">
              <MessageSquare className={`w-4 h-4 flex-shrink-0 ${currentSessionId === session.id ? 'text-[#ff4e00]' : 'text-white/20'}`} />
              <span className={`text-sm font-medium truncate ${currentSessionId === session.id ? 'text-white' : 'text-white/60'}`}>
                {session.title}
              </span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-6 bg-white/5 border-t border-white/5">
        {profile && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img src={profile.photoURL} className="w-12 h-12 rounded-2xl border-2 border-white/10" alt="Profile" />
                <div className="absolute -bottom-1 -right-1 p-1 bg-[#0a0502] rounded-lg border border-white/10">
                  {getRankIcon(profile.rank)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{profile.displayName}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff4e00]">{profile.rank}</p>
              </div>
              <button onClick={onLogout} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                <LogOut className="w-5 h-5 text-white/40 hover:text-white" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {profile.rank === 'owner' && (
                <button 
                  onClick={onShowOwner}
                  className="flex items-center justify-center space-x-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
                >
                  <Settings className="w-4 h-4 text-white/60" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Admin</span>
                </button>
              )}
              <button 
                onClick={onShowUpgrade}
                className="flex items-center justify-center space-x-2 py-3 bg-gradient-to-br from-[#ff4e00] to-[#ff8e00] hover:opacity-90 rounded-xl shadow-lg shadow-[#ff4e00]/20 transition-all col-span-1"
              >
                <Zap className="w-4 h-4 text-white" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Upgrade</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
