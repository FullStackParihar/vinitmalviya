import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hello! I am RamdevAI. Ask me about construction projects or interior designs.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://vinitmalviya.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Updated to match backend ChatRequest model
        body: JSON.stringify({ 
            message: userMessage.content,
            history: [] // Future: Pass history if needed
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'system', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'system', content: "I'm having trouble connecting to the design server. Please ensure the backend is running." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-accent text-primary rounded-full shadow-2xl flex items-center justify-center border-4 border-white"
        aria-label="Open Chat"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-28 right-6 z-50 w-full max-w-sm h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            <div className="bg-primary p-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-accent">RamdevAI Consultant</h3>
                <p className="text-xs text-gray-400">Online & Ready to Design</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-br-none' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm rounded-bl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about designs..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-accent text-sm"
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="p-2 bg-accent text-primary rounded-full hover:bg-yellow-500 disabled:opacity-50 transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
