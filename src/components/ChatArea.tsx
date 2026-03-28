import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Terminal, 
  Sparkles, 
  Image as ImageIcon, 
  User as UserIcon, 
  Shield, 
  Zap, 
  Crown,
  Copy,
  Check
} from 'lucide-react';
import { Message, UserProfile } from '../types';

interface ChatAreaProps {
  messages: Message[];
  profile: UserProfile | null;
  isGenerating: boolean;
  terminalMode: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  profile,
  isGenerating,
  terminalMode
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'owner': return <Shield className="w-4 h-4 text-[#ff4e00]" />;
      case 'premium': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'pro': return <Zap className="w-4 h-4 text-blue-400" />;
      default: return <UserIcon className="w-4 h-4 text-white/40" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative" ref={scrollRef}>
      {messages.length === 0 && !isGenerating && (
        <div className="h-full flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-[#ff4e00] to-[#ff8e00] flex items-center justify-center shadow-2xl shadow-[#ff4e00]/20"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white tracking-tight">How can I assist you today?</h2>
            <p className="text-white/40 text-lg leading-relaxed">
              I'm KiroAI, your universal assistant. I can help with code, creative writing, image generation, and more.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            {[
              { icon: <Terminal className="w-5 h-5" />, title: "Code Analysis", desc: "Expert debugging and refactoring" },
              { icon: <ImageIcon className="w-5 h-5" />, title: "Image Gen", desc: "DALL-E 3 powered visuals" },
              { icon: <Sparkles className="w-5 h-5" />, title: "Creative Writing", desc: "Stories, scripts, and more" },
              { icon: <Shield className="w-5 h-5" />, title: "Secure Logic", desc: "Privacy-first processing" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group text-left"
              >
                <div className="p-3 rounded-2xl bg-[#ff4e00]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-[#ff4e00]">{item.icon}</div>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-white/40">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {messages.map((msg, idx) => (
          <motion.div 
            key={msg.id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] flex space-x-4 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border ${
                msg.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-gradient-to-br from-[#ff4e00] to-[#ff8e00] border-transparent shadow-lg shadow-[#ff4e00]/20'
              }`}>
                {msg.role === 'user' ? (
                  <img src={profile?.photoURL} className="w-full h-full rounded-2xl" alt="User" />
                ) : (
                  <Sparkles className="w-5 h-5 text-white" />
                )}
              </div>
              
              <div className={`space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    {msg.role === 'user' ? profile?.displayName : 'KiroAI'}
                  </span>
                  {msg.role === 'user' && getRankIcon(profile?.rank || 'normal')}
                </div>
                
                <div className={`p-6 rounded-3xl border ${
                  msg.role === 'user' 
                    ? 'bg-white/5 border-white/10 text-white' 
                    : 'bg-[#151619] border-white/5 text-white/90 shadow-xl'
                }`}>
                  {msg.imageUrl && (
                    <div className="mb-4 rounded-2xl overflow-hidden border border-white/10">
                      <img src={msg.imageUrl} className="w-full h-auto" alt="Generated" />
                    </div>
                  )}
                  <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0">
                    <Markdown
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <div className="relative group">
                              <SyntaxHighlighter
                                style={atomDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {msg.text}
                    </Markdown>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff4e00] to-[#ff8e00] flex items-center justify-center shadow-lg shadow-[#ff4e00]/20">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">KiroAI is thinking...</span>
                <div className="p-6 rounded-3xl bg-[#151619] border border-white/5 flex space-x-2">
                  <div className="w-2 h-2 bg-[#ff4e00] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#ff4e00] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#ff4e00] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
