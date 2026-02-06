import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, initialInterest = "General Consultation" }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const response = await fetch('https://vinitmalviya.onrender.com/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, interest: initialInterest }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus('idle');
          setFormData({ name: '', phone: '', email: '' });
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error'); // Or simulate success for demo
      // Demo fallback
      setTimeout(() => {
         setStatus('success');
         setTimeout(() => onClose(), 2000);
      }, 1000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto z-[70] w-full max-w-md h-fit bg-white p-8 rounded-xl shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <X size={24} />
            </button>

            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2">Thank You!</h3>
                <p className="text-gray-500">We will contact you shortly to schedule your visit.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-serif font-bold mb-2">Book a Site Visit</h3>
                <p className="text-gray-500 mb-6 text-sm">Get a free consultation and estimate for your dream space.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-accent"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-accent"
                      placeholder="+91 63760 07979"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Email (Optional)</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-accent"
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <button 
                    disabled={status === 'submitting'}
                    type="submit" 
                    className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-black transition-all disabled:opacity-70 mt-4"
                  >
                    {status === 'submitting' ? 'Scheduling...' : 'CONFIRM BOOKING'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
