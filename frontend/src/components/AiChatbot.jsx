import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, CornerDownRight } from 'lucide-react';
export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Welcome to ShopEZ intelligence. I can query our live database, make comparative specifications side-by-side matrices, or compile list outputs within your budget limits. What are you looking to discover today?'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const contextSuggestions = [
    'Recommend trending devices',
    'Show premium items under ₹25,000',
    'Compare catalog flagships'
  ];
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);
  const handleSend = async (textToSend) => {
    const query = textToSend || message;
    if (!query.trim()) return;
    setMessage('');
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setLoading(true);
    try {
      const res = await axios.post('/api/ai/chat', { message: query });
      if (res.data.success) {
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'ai', 
            text: res.data.reply, 
            products: res.data.products 
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev, 
        { sender: 'ai', text: 'Service temporarily offline. Please verify local server connection.' }
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <button 
        id="ai-dock-toggle-btn" 
        onClick={() => setIsOpen(true)} 
        className="hidden"
      />
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-40 bg-apple-dark text-white p-4 rounded-full shadow-2xl hover:bg-brand-500 transition-all hover:scale-105 cursor-pointer flex items-center justify-center group border border-white/10"
        >
          <Sparkles className="w-5 h-5 text-brand-500 fill-brand-500 group-hover:rotate-12 transition-transform duration-300" />
        </button>
      )}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 pointer-events-none flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="w-full max-w-lg h-full bg-brand-50 border-l border-black/5 shadow-2xl flex flex-col relative pointer-events-auto z-10"
            >
              <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-500 fill-brand-500 animate-pulse" />
                  <div>
                    <h3 className="font-display font-black text-sm text-apple-dark">ShopEZ Intelligence</h3>
                    <span className="text-[9px] font-semibold text-brand-500 uppercase tracking-widest font-display">Context Aware Engine</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-black/5 text-apple-dark/40 hover:text-apple-dark transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-8 py-4 bg-white/50 border-b border-black/5 flex flex-wrap gap-2">
                {contextSuggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sug)}
                    className="text-[10px] font-semibold px-3 py-1.5 rounded-full border border-black/5 hover:border-brand-500/20 hover:bg-brand-100/50 text-apple-dark/60 hover:text-apple-dark transition-all cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
              <div className="flex-grow p-8 overflow-y-auto space-y-6 no-scrollbar">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}>
                    <div className={`max-w-[85%] rounded-3xl px-5 py-3.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-apple-dark text-white rounded-tr-none shadow-sm'
                        : 'bg-white text-apple-dark border border-black/5 rounded-tl-none shadow-sm font-medium'
                    }`}>
                      {msg.text}
                    </div>
                    {msg.products && msg.products.length > 0 && (
                      <div className="grid grid-cols-1 gap-3 w-full max-w-[85%] pt-2">
                        {msg.products.map(prod => (
                          <Link
                            to={`/product/${prod._id}`}
                            key={prod._id}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-black/5 hover:border-brand-500/20 shadow-sm transition-all group hover:translate-y-[-2px]"
                          >
                            <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 object-cover rounded-xl border border-black/5" />
                            <div className="flex-grow">
                              <h4 className="text-xs font-bold text-apple-dark group-hover:text-brand-500 transition-colors line-clamp-1">{prod.name}</h4>
                              <span className="text-[10px] font-semibold text-apple-dark/40 font-display">₹{prod.basePrice}</span>
                            </div>
                            <CornerDownRight className="w-4 h-4 text-brand-500 opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-black/5 rounded-2xl px-5 py-3.5 rounded-tl-none flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
                className="p-6 border-t border-black/5 bg-white flex gap-3"
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Inquire specs, budgets, comparisons..."
                  className="flex-grow px-4 py-3 bg-brand-50 border border-black/5 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder:text-apple-dark/30"
                />
                <button 
                  type="submit" 
                  className="p-3 bg-apple-dark hover:bg-brand-500 text-white rounded-2xl transition-colors shadow-lg cursor-pointer flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
