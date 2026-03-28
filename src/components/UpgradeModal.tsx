import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Shield, 
  Zap, 
  Crown, 
  Check, 
  Sparkles, 
  Image as ImageIcon, 
  Terminal, 
  MessageSquare 
} from 'lucide-react';
import { UserRank, AppSettings } from '../types';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (rank: UserRank) => void;
  appSettings: AppSettings;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  appSettings
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
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative z-10 w-full max-w-5xl bg-[#151619] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Left Side: Visuals */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-[#ff4e00] to-[#ff8e00] p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 blur-[100px] rounded-full -ml-32 -mb-32" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-8">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4 tracking-tighter">UNLEASH THE POWER OF KIROAI</h2>
            <p className="text-white/80 text-lg font-medium">Join thousands of creators and developers using the most advanced AI assistant.</p>
          </div>

          <div className="relative z-10 space-y-6">
            {[
              { icon: <MessageSquare className="w-5 h-5" />, text: "Unlimited Messages" },
              { icon: <ImageIcon className="w-5 h-5" />, text: "DALL-E 3 Generation" },
              { icon: <Terminal className="w-5 h-5" />, text: "Advanced Code Analysis" }
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-4 text-white/90">
                <div className="p-2 rounded-lg bg-white/10">{item.icon}</div>
                <span className="font-bold text-sm uppercase tracking-widest">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Plans */}
        <div className="flex-1 p-12 grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0a0502]">
          {/* Pro Plan */}
          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-[#ff4e00]/50 transition-all group flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400">
                  <Zap className="w-8 h-8" />
                </div>
                <span className="px-4 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">Popular</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-2">PRO RANK</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-white">${appSettings.proPrice}</span>
                  <span className="text-white/40 font-bold uppercase tracking-widest text-xs">/month</span>
                </div>
              </div>
              <div className="space-y-4">
                {["Unlimited Text Messages", "Priority Support", "Advanced Models", "Custom Themes"].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3 text-white/60">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-widest">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => onUpgrade('pro')}
              className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all active:scale-95 mt-8"
            >
              Get Pro Now
            </button>
          </div>

          {/* Premium Plan */}
          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-yellow-500/50 transition-all group flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Crown className="w-12 h-12 text-yellow-500/20 rotate-12" />
            </div>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="p-4 rounded-2xl bg-yellow-500/10 text-yellow-500">
                  <Crown className="w-8 h-8" />
                </div>
                <span className="px-4 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest">Ultimate</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-2">PREMIUM RANK</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-white">${appSettings.premiumPrice}</span>
                  <span className="text-white/40 font-bold uppercase tracking-widest text-xs">/month</span>
                </div>
              </div>
              <div className="space-y-4">
                {["Everything in Pro", "Unlimited Image Gen", "Early Access Features", "Direct Owner Support"].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3 text-white/60">
                    <Check className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => onUpgrade('premium')}
              className="w-full py-5 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all active:scale-95 mt-8 shadow-xl shadow-yellow-500/20"
            >
              Go Premium
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 hover:bg-white/5 rounded-full transition-all text-white/40 hover:text-white"
        >
          <Plus className="w-8 h-8 rotate-45" />
        </button>
      </motion.div>
    </div>
  );
};
