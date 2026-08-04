import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, FaPaperPlane, FaGem, FaCrown,
  FaStore, FaTruck, FaShieldAlt, FaHeart,
  FaWhatsapp
} from 'react-icons/fa';

// ✅ Public Folder Se Image
const aiBotImage = '/images/ai-bot.png';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "✨ Hello! I'm MAHA AI, your premium shopping assistant. How can I make your experience extraordinary today?", 
      isBot: true,
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ============================================================
  // QUICK QUESTIONS WITH ICONS
  // ============================================================
  const quickQuestions = [
    { icon: <FaStore className="text-[#D4AF37]" />, text: 'Products', response: 'We offer premium Dry Fruits, Sweets, and Fashion collections. Visit our Shop page to explore our exclusive products!' },
    { icon: <FaTruck className="text-[#D4AF37]" />, text: 'Delivery', response: '🚚 We deliver across Pakistan within 2-3 business days. Free delivery on orders above PKR 2,000!' },
    { icon: <FaShieldAlt className="text-[#D4AF37]" />, text: 'Returns', response: '🔄 We offer a 7-day return policy. If you\'re not satisfied, we\'ll replace or refund your order.' },
    { icon: <FaWhatsapp className="text-[#D4AF37]" />, text: 'Contact', response: '📞 You can reach us at 0303-3169725 or WhatsApp us. We\'re here to help 9AM-9PM!' },
  ];

  // ============================================================
  // SMART RESPONSES
  // ============================================================
  const getSmartResponse = (userInput: string): string => {
    const lower = userInput.toLowerCase();
    
    if (lower.match(/^(hi|hello|hey|hola|salam|assalam|good morning|good evening)/)) {
      return "👋 Hello! Welcome to MAHA ONE HYPERMART. How can I assist you with your premium shopping today? ✨";
    }
    
    if (lower.includes('product') || lower.includes('item') || lower.includes('buy') || lower.includes('shop')) {
      return "🛍️ We offer a premium selection of:\n\n🥜 Dry Fruits - Almonds, Cashews, Pistachios, Walnuts, Raisins, Dates\n🍬 Sweets - Premium chocolates, bars, eclairs\n👗 Fashion - Coming soon!\n\nVisit our Shop page to explore!";
    }
    
    if (lower.includes('delivery') || lower.includes('ship') || lower.includes('shipping') || lower.includes('order')) {
      return "🚚 We deliver across Pakistan within 2-3 business days.\n\n✅ Free delivery on orders above PKR 2,000\n✅ Order tracking available\n✅ Cash on Delivery available";
    }
    
    if (lower.includes('return') || lower.includes('refund') || lower.includes('exchange') || lower.includes('replace')) {
      return "🔄 We offer a 7-day return policy.\n\n✅ 100% satisfaction guaranteed\n✅ Full refund or replacement\n✅ Easy return process\n\nContact us for assistance!";
    }
    
    if (lower.includes('payment') || lower.includes('pay') || lower.includes('card') || lower.includes('cash')) {
      return "💳 We accept multiple payment methods:\n\n✅ Cash on Delivery (COD)\n✅ JazzCash\n✅ EasyPaisa\n✅ Bank Transfer\n✅ Visa/Mastercard\n\nAll payments are secure!";
    }
    
    if (lower.includes('contact') || lower.includes('support') || lower.includes('help') || lower.includes('number')) {
      return "📞 We're here to help!\n\n📱 Phone: 0303-3169725\n💬 WhatsApp: 0303-3169725\n📧 Email: info@mahaone.pk\n\nMon-Sat: 9AM - 9PM";
    }
    
    if (lower.includes('discount') || lower.includes('offer') || lower.includes('sale') || lower.includes('deal')) {
      return "🎉 Yes! We have amazing offers:\n\n⚡ Flash Sale - Limited time\n🏆 Best Sellers - Top rated\n🆕 New Arrivals - Fresh products\n\nCheck our Shop page for current offers!";
    }
    
    if (lower.includes('sweet') || lower.includes('chocolate') || lower.includes('bar') || lower.includes('candy')) {
      return "🍬 Yes! We have a premium Sweet Collection:\n\n🍫 Caramel Dream Choco Bar\n🍫 HISS Crispy Wafer\n🍫 Nani Caramel Choco Bar\n🍫 Nani Coconut Bar\n🍬 Rili Eclairs\n\nVisit our Sweets page!";
    }
    
    if (lower.includes('almond') || lower.includes('cashew') || lower.includes('pistachio') || lower.includes('walnut') || lower.includes('raisin') || lower.includes('date')) {
      return "🥜 We offer premium Dry Fruits:\n\n✅ American Almonds\n✅ Premium Cashews\n✅ Iranian Pistachios\n✅ California Walnuts\n✅ Afghani Raisins\n✅ Ajwa Dates\n\nAll sourced from the finest farms!";
    }
    
    if (lower.includes('fashion') || lower.includes('cloth') || lower.includes('wear') || lower.includes('dress')) {
      return "👗 Our Fashion Collection is coming soon!\n\n✨ Premium clothing and accessories\n✨ Exclusive designs\n✨ Luxury quality\n\nStay tuned for the launch!";
    }
    
    if (lower.includes('thanks') || lower.includes('thank you') || lower.includes('ty')) {
      return "😊 You're welcome! It's my pleasure to help. Is there anything else I can assist you with? \n\n🌟 Remember, we're always here for you!";
    }
    
    return "🌟 Thank you for your question! I'm here to help with:\n\n🛍️ Products\n🚚 Delivery\n🔄 Returns\n💳 Payments\n📞 Contact\n\nCould you please be more specific?";
  };

  // ============================================================
  // SEND MESSAGE
  // ============================================================
  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: input,
      isBot: false,
      time: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getSmartResponse(input);
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        time: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleQuickQuestion = (response: string) => {
    setInput(response);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* ============================================================
      CHAT BUTTON - Public Image
      ============================================================ */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="relative group"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-[#D4AF37] rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse" />
              
              {/* ✅ Main Button with Public Image */}
              <div className="relative w-16 h-16 rounded-full shadow-2xl hover:shadow-[#D4AF37]/30 transition-all duration-300 overflow-hidden border-2 border-[#D4AF37]">
                <img 
                  src={aiBotImage} 
                  alt="MAHA AI Assistant"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/64x64/0F766E/FFFFFF?text=AI';
                  }}
                />
                <div className="absolute -top-1 -right-1">
                  <FaGem className="text-[#D4AF37] text-xs animate-pulse" />
                </div>
              </div>
              
              {/* Notification Dot */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ============================================================
        CHAT WINDOW - Premium Design
        ============================================================ */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute bottom-20 right-0 w-[420px] max-w-[90vw] bg-white rounded-3xl shadow-2xl border border-[#E5E7EB] overflow-hidden"
            >
              {/* ============================================================
              HEADER - Premium with Public Image
              ============================================================ */}
              <div className="bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {/* ✅ Public Image in Header */}
                      <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-white/20 backdrop-blur">
                        <img 
                          src={aiBotImage} 
                          alt="MAHA AI"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/48x48/0F766E/FFFFFF?text=AI';
                          }}
                        />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#065F46]" />
                    </div>
                    <div>
                      <span className="font-bold text-lg flex items-center gap-2">
                        MAHA AI
                        <FaCrown className="text-[#D4AF37] text-sm" />
                      </span>
                      <p className="text-xs text-white/70 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse" />
                        Online • Premium Assistant
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              {/* ============================================================
              MESSAGES
              ============================================================ */}
              <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-[#F8FAFC] to-white">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.isBot 
                        ? 'bg-white shadow-md text-gray-800 rounded-tl-none border border-[#E5E7EB]' 
                        : 'bg-gradient-to-r from-[#0F766E] to-[#065F46] text-white rounded-tr-none'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.isBot ? 'text-gray-400' : 'text-white/60'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white shadow-md rounded-2xl rounded-tl-none p-3 border border-[#E5E7EB]">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-[#0F766E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-[#0F766E] rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                        <div className="w-2 h-2 bg-[#0F766E] rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* ============================================================
              QUICK QUESTIONS
              ============================================================ */}
              <div className="px-4 py-2 bg-white border-t border-[#E5E7EB] flex gap-2 overflow-x-auto">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q.response)}
                    className="flex items-center gap-1.5 text-xs bg-[#F8FAFC] hover:bg-[#0F766E] hover:text-white px-3 py-1.5 rounded-full transition-all duration-300 whitespace-nowrap border border-[#E5E7EB] hover:border-[#0F766E]"
                  >
                    {q.icon}
                    {q.text}
                  </button>
                ))}
              </div>

              {/* ============================================================
              INPUT
              ============================================================ */}
              <div className="p-4 bg-white border-t border-[#E5E7EB] flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2.5 bg-[#F8FAFC] border-2 border-[#E5E7EB] rounded-full text-sm focus:outline-none focus:border-[#0F766E] transition-all duration-300"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#b8941f] text-white p-2.5 rounded-full hover:shadow-lg transition-all duration-300"
                >
                  <FaPaperPlane className="text-sm" />
                </motion.button>
              </div>

              {/* ============================================================
              FOOTER
              ============================================================ */}
              <div className="px-4 py-2 bg-gradient-to-r from-[#F8FAFC] to-white text-center border-t border-[#E5E7EB]">
                <p className="text-[10px] text-gray-400 flex items-center justify-center gap-2">
                  <FaHeart className="text-[#D4AF37] text-xs animate-pulse" />
                  MAHA ONE HYPERMART • Premium AI Assistant
                  <FaHeart className="text-[#D4AF37] text-xs animate-pulse" />
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AIAssistant;