import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, X } from 'lucide-react';
import { askAquaGenius } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AquaGeniusProps {
  context: any;
}

export const AquaGenius: React.FC<AquaGeniusProps> = ({ context }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy AquaGenius. Puedo ayudarte a analizar tus parámetros, diagnosticar enfermedades o planificar proyectos genéticos. ¿Qué necesitas saber hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await askAquaGenius(userMsg, context);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, he tenido un error al procesar tu consulta.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-gold-500' : 'bg-aqua-400'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-gold-500/10 border border-gold-500/20 text-gold-100' 
                  : 'bg-aqua-400/10 border border-aqua-400/20 text-aqua-100'
              }`}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 bg-aqua-400/10 border border-aqua-400/20 p-3 rounded-2xl">
              <Loader2 className="animate-spin text-aqua-400" size={16} />
              <span className="text-sm text-aqua-400">AquaGenius está pensando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 glass border-t border-white/10 rounded-t-3xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pregunta a AquaGenius..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-aqua-400 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-aqua-400 text-slate-950 p-2 rounded-xl hover:bg-aqua-300 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
