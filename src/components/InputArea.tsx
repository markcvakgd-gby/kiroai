import React, { useState, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Terminal, 
  Zap, 
  Sparkles, 
  Plus, 
  X,
  Shield,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface InputAreaProps {
  onSend: (text: string, imageUrl?: string) => void;
  isGenerating: boolean;
  profile: UserProfile | null;
  terminalMode: boolean;
  setTerminalMode: (mode: boolean) => void;
}

export const InputArea: React.FC<InputAreaProps> = ({
  onSend,
  isGenerating,
  profile,
  terminalMode,
  setTerminalMode
}) => {
  const [input, setInput] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && !selectedImage) return;
    onSend(input, selectedImage || undefined);
    setInput('');
    setSelectedImage(null);
    setShowImagePreview(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
        setShowImagePreview(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const isPro = profile?.rank === 'pro' || profile?.rank === 'premium' || profile?.rank === 'owner';

  return (
    <div className="p-6 bg-[#0a0502]/80 backdrop-blur-xl border-t border-white/5">
      <div className="max-w-4xl mx-auto space-y-4">
        <AnimatePresence>
          {showImagePreview && selectedImage && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="relative w-32 h-32 rounded-2xl overflow-hidden border border-white/10 group"
            >
              <img src={selectedImage} className="w-full h-full object-cover" alt="Preview" />
              <button 
                onClick={() => { setSelectedImage(null); setShowImagePreview(false); }}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-lg hover:bg-black/80 transition-all"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff4e00]/20 to-[#ff8e00]/20 blur-2xl group-hover:blur-3xl transition-all opacity-0 group-focus-within:opacity-100" />
          
          <div className={`relative flex items-end space-x-4 p-4 rounded-[2rem] border transition-all ${
            terminalMode 
              ? 'bg-black border-[#ff4e00]/30 shadow-[0_0_30px_rgba(255,78,0,0.1)]' 
              : 'bg-white/5 border-white/10 focus-within:border-white/20'
          }`}>
            <div className="flex items-center space-x-2 pb-2">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 hover:bg-white/5 rounded-2xl transition-all group/btn"
              >
                <Paperclip className="w-5 h-5 text-white/40 group-hover/btn:text-white" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={terminalMode ? "root@kiroai:~# " : "Message KiroAI..."}
              className={`flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-white/20 resize-none py-3 max-h-48 custom-scrollbar ${
                terminalMode ? 'font-mono text-[#ff4e00]' : 'text-lg'
              }`}
              rows={1}
            />

            <div className="flex items-center space-x-2 pb-2">
              <button 
                type="button"
                onClick={() => setTerminalMode(!terminalMode)}
                className={`p-3 rounded-2xl transition-all ${
                  terminalMode ? 'bg-[#ff4e00]/20 text-[#ff4e00]' : 'hover:bg-white/5 text-white/40 hover:text-white'
                }`}
              >
                <Terminal className="w-5 h-5" />
              </button>
              
              <button 
                type="submit"
                disabled={isGenerating || (!input.trim() && !selectedImage)}
                className={`p-4 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 ${
                  terminalMode 
                    ? 'bg-[#ff4e00] text-white shadow-[#ff4e00]/20' 
                    : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-between px-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isPro ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-yellow-500'}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                {isPro ? 'Unlimited Access' : `${profile?.messageCount || 0}/10 Messages`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3 h-3 text-[#ff4e00]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Gemini 3.1 Pro</span>
            </div>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
            Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};
