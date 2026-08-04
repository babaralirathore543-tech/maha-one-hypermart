import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you! We will get back to you soon. 📩');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-[#FFFDF7] py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827]">
            Get In <span className="text-[#D4AF37]">Touch</span>
          </h1>
          <p className="text-gray-500 mt-4">We'd love to hear from you. Reach out to us anytime.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          
          {/* ============================================================
          LEFT - CONTACT INFO
          ============================================================ */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }} 
            className="space-y-6"
          >
            {/* ✅ WhatsApp - Updated Number */}
            <div className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-[#E5E7EB] flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="bg-green-50 p-3 rounded-full text-green-600">
                <FaWhatsapp className="text-2xl" />
              </div>
              <div>
                <h4 className="font-semibold text-[#111827]">WhatsApp</h4>
                <p className="text-gray-500">0303-3169725</p>
                <a 
                  href="https://wa.me/923033169725" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-[#0F766E] hover:text-[#D4AF37] transition"
                >
                  Chat on WhatsApp →
                </a>
              </div>
            </div>

            {/* ✅ Phone - Updated Number */}
            <div className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-[#E5E7EB] flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="bg-[#D4AF37]/10 p-3 rounded-full text-[#D4AF37]">
                <FaPhone className="text-2xl" />
              </div>
              <div>
                <h4 className="font-semibold text-[#111827]">Phone</h4>
                <p className="text-gray-500">0303-3169725</p>
                <p className="text-xs text-gray-400">Mon-Sat: 9AM - 9PM</p>
              </div>
            </div>

            {/* ✅ Email */}
            <div className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-[#E5E7EB] flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="bg-[#D4AF37]/10 p-3 rounded-full text-[#D4AF37]">
                <FaEnvelope className="text-2xl" />
              </div>
              <div>
                <h4 className="font-semibold text-[#111827]">Email</h4>
                <p className="text-gray-500">mahaonehypermarket@gmail.com</p>
              </div>
            </div>

            {/* ✅ Address - Updated with Ayesha Manzil, Karachi */}
            <div className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-[#E5E7EB] flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="bg-[#D4AF37]/10 p-3 rounded-full text-[#D4AF37]">
                <FaMapMarkerAlt className="text-2xl" />
              </div>
              <div>
                <h4 className="font-semibold text-[#111827]">Address</h4>
                <p className="text-gray-500">Ayesha Manzil, Karachi, Pakistan</p>
                <p className="text-xs text-gray-400">Sindh, Pakistan</p>
              </div>
            </div>

            {/* Map Link */}
            <div className="mt-4">
              <a 
                href="https://maps.google.com/maps?q=Ayesha+Manzil+Karachi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#0F766E] hover:text-[#D4AF37] transition"
              >
                <FaMapMarkerAlt /> View on Google Maps →
              </a>
            </div>
          </motion.div>

          {/* ============================================================
          RIGHT - CONTACT FORM
          ============================================================ */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.3 }} 
            className="bg-white/80 backdrop-blur p-8 rounded-2xl border border-[#E5E7EB] shadow-sm"
          >
            <h3 className="text-xl font-bold text-[#111827] mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  rows={4} 
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition resize-none" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#b8941f] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition"
              >
                Send Message
              </button>
            </form>

            {/* WhatsApp Quick Chat */}
            <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
              <p className="text-sm text-gray-500 text-center">Or reach us directly on WhatsApp</p>
              <a 
                href="https://wa.me/923033169725" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-3 w-full bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaWhatsapp className="text-xl" /> Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;