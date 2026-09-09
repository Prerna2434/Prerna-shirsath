import React, { useState, useRef, useEffect } from 'react';
import { requestClinicalResponse } from '../../services/clinicalAssistant';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  loading?: boolean;
}

interface AiAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const suggestedQuestions = [
  'What is the generic equivalent of Lipitor 20mg?',
  'Explain AB-rated therapeutic equivalence',
  'What are common drug interactions with Metformin?',
  'How much can a patient save switching to generics?',
  'Explain DAW-0 vs DAW-1 prescription codes',
];

export const AiAssistantPanel: React.FC<AiAssistantPanelProps> = ({ isOpen, onClose, initialQuery }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I\'m your GeneticMedicine AI assistant. Ask me about drug equivalences, interactions, dosages, or patient savings. How can I help?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const processedQueryRef = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
      if (initialQuery && initialQuery !== processedQueryRef.current) {
        processedQueryRef.current = initialQuery;
        sendMessage(initialQuery);
      }
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const streamResponse = async (assistantId: string, responseText: string) => {
    const words = responseText.split(' ');
    let current = '';
    for (let i = 0; i < words.length; i++) {
      current += (i > 0 ? ' ' : '') + words[i];
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId ? { ...m, content: current, loading: false } : m
        )
      );
      await new Promise(r => setTimeout(r, 20));
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text.trim() };
    const assistantId = `a-${Date.now()}`;
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '', loading: true };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsStreaming(true);

    try {
      const response = await requestClinicalResponse(text);
      await streamResponse(assistantId, response.content);
    } catch {
      await streamResponse(
        assistantId,
        'The clinical assistant is temporarily unavailable. Please retry after confirming the backend service is running.'
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40"
          onClick={onClose}
        />
      )}

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-[#ffffff] z-50 flex flex-col shadow-2xl border-l border-[#e5eeff] transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between bg-gradient-to-r from-[#006b53] to-[#00a884] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px]">auto_awesome</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">AI Drug Assistant</p>
              <p className="text-white/70 text-[10px]">Powered by Gemini 1.5 Flash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close panel"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.role === 'user'
                    ? 'bg-[#006b53]'
                    : 'bg-gradient-to-br from-[#006b53] to-[#00a884]'
                }`}
              >
                <span className="material-symbols-outlined text-white text-[14px]">
                  {msg.role === 'user' ? 'person' : 'auto_awesome'}
                </span>
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#006b53] text-white rounded-tr-sm'
                    : 'bg-[#f8f9ff] border border-[#e5eeff] text-[#0b1c30] rounded-tl-sm'
                }`}
              >
                {msg.loading ? (
                  <span className="flex items-center gap-1.5 text-[#525f75]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#525f75] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#525f75] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#525f75] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                ) : (
                  <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#525f75] mb-2">Suggested questions</p>
            <div className="flex flex-col gap-1.5">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-left px-3 py-2 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-xs text-[#0b1c30] font-medium border border-[#dce9ff] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-4 pt-2 border-t border-[#e5eeff] shrink-0">
          <div className="flex items-center gap-2 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] focus-within:border-[#00a884] focus-within:ring-1 focus-within:ring-[#00a884]/30 transition-all px-3 py-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about drug equivalences, interactions..."
              className="flex-1 bg-transparent text-sm text-[#0b1c30] placeholder:text-[#525f75] focus:outline-none"
              disabled={isStreaming}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming}
              className="w-8 h-8 rounded-lg bg-[#006b53] hover:bg-[#00513e] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
              aria-label="Send"
            >
              <span className="material-symbols-outlined text-white text-[18px]">send</span>
            </button>
          </div>
          <p className="text-[10px] text-[#525f75] text-center mt-2">
            AI responses are informational only. Always verify with a licensed clinician.
          </p>
        </div>
      </div>
    </>
  );
};
