import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Sparkles, 
  Terminal,
  AlertCircle
} from 'lucide-react';
import { useKiro } from './hooks/useKiro';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { InputArea } from './components/InputArea';
import { UpgradeModal } from './components/UpgradeModal';
import { OwnerDashboard } from './components/OwnerDashboard';
import { generateText, generateImage } from './services/ai';
import { UserRank } from './types';

export default function App() {
  const {
    user,
    profile,
    sessions,
    currentSessionId,
    setCurrentSessionId,
    messages,
    appSettings,
    allUsers,
    loading,
    login,
    logout,
    createSession,
    deleteSession,
    sendMessage,
    requestRank,
    updateSettings,
    updateUserRank
  } = useKiro();

  const [isGenerating, setIsGenerating] = useState(false);
  const [terminalMode, setTerminalMode] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showOwnerDashboard, setShowOwnerDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (text: string, imageUrl?: string) => {
    if (!user || !profile) return;
    
    // Check limits
    if (profile.rank === 'normal' && profile.messageCount >= 10) {
      setShowUpgradeModal(true);
      return;
    }

    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = await createSession(text.slice(0, 30) + "...");
    }

    if (!sessionId) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Send user message
      await sendMessage(text, 'user', imageUrl);

      // Determine if it's an image request
      const isImageRequest = text.toLowerCase().includes('generate image') || 
                            text.toLowerCase().includes('create image') || 
                            text.toLowerCase().includes('draw');

      if (isImageRequest) {
        if (profile.rank === 'normal') {
          await sendMessage("Image generation is a Premium feature. Please upgrade to use it.", 'assistant');
        } else {
          const genImageUrl = await generateImage(text);
          await sendMessage(`I've generated this image for you based on: "${text}"`, 'assistant', genImageUrl);
        }
      } else {
        const systemInstruction = `You are KiroAI, a universal assistant. 
          Current User Rank: ${profile.rank}. 
          Owner Email: markcvakgd@gmail.com.
          If the user is the owner, be extremely helpful and respectful.
          If the user is normal, remind them of their 10-message limit occasionally.
          Terminal Mode: ${terminalMode ? 'ON (Respond in a concise, technical manner)' : 'OFF'}.`;
        
        const aiResponse = await generateText(text, systemInstruction);
        await sendMessage(aiResponse, 'assistant');
      }
    } catch (err: any) {
      console.error("Generation Error:", err);
      setError(err.message || "An unexpected error occurred.");
      await sendMessage(`Error: ${err.message || "Failed to generate response."}`, 'assistant');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#0a0502] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-2xl bg-[#ff4e00] flex items-center justify-center"
        >
          <Shield className="w-8 h-8 text-white" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen bg-[#0a0502] flex items-center justify-center p-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,78,0,0.1),transparent_50%)]" />
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 max-w-md w-full text-center space-y-8"
        >
          <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-[#ff4e00] to-[#ff8e00] mx-auto flex items-center justify-center shadow-2xl shadow-[#ff4e00]/20">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-white tracking-tighter">KIRO<span className="text-[#ff4e00]">AI</span></h1>
            <p className="text-white/40 text-lg font-medium">The next generation of universal intelligence.</p>
          </div>
          <button 
            onClick={login}
            className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-white/10"
          >
            Get Started with Google
          </button>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">By continuing, you agree to our terms of service.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0502] flex overflow-hidden font-sans selection:bg-[#ff4e00]/30">
      <Sidebar 
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onCreateSession={() => createSession()}
        onDeleteSession={deleteSession}
        profile={profile}
        onLogout={logout}
        onShowUpgrade={() => setShowUpgradeModal(true)}
        onShowOwner={() => setShowOwnerDashboard(true)}
      />

      <main className="flex-1 flex flex-col relative">
        {error && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-red-500/10 border border-red-500/50 backdrop-blur-xl p-4 rounded-2xl flex items-center space-x-3 text-red-500"
            >
              <AlertCircle className="w-5 h-5" />
              <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
            </motion.div>
          </div>
        )}

        <ChatArea 
          messages={messages}
          profile={profile}
          isGenerating={isGenerating}
          terminalMode={terminalMode}
        />

        <InputArea 
          onSend={handleSend}
          isGenerating={isGenerating}
          profile={profile}
          terminalMode={terminalMode}
          setTerminalMode={setTerminalMode}
        />
      </main>

      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={requestRank}
        appSettings={appSettings}
      />

      <OwnerDashboard 
        isOpen={showOwnerDashboard}
        onClose={() => setShowOwnerDashboard(false)}
        appSettings={appSettings}
        allUsers={allUsers}
        onUpdateSettings={updateSettings}
        onUpdateUserRank={updateUserRank}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .prose pre {
          background: rgba(0, 0, 0, 0.3) !important;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
        }
        
        .prose code {
          color: #ff8e00 !important;
          background: rgba(255, 142, 0, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.4rem;
        }
      `}} />
    </div>
  );
}
