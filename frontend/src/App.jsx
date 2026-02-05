import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import MasonryPortfolio from './components/MasonryPortfolio';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import HardwareShowcase from './components/HardwareShowcase';
import Chatbot from './components/Chatbot';
import BookingModal from './components/BookingModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookClick={() => setIsModalOpen(true)} />
      <Hero onBookClick={() => setIsModalOpen(true)} />
      <Stats />
      
      {/* Scroll sections for navigation */}
      <div id="services">
        <BeforeAfterSlider />
      </div>
      
      <div id="portfolio">
        <MasonryPortfolio />
      </div>

      <HardwareShowcase />
      
      <Chatbot />
      
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      {/* Footer */}
      <footer id="about" className="bg-primary text-white py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <h4 className="text-accent font-serif text-2xl font-bold mb-6">Elite Interior</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Transforming spaces into timeless masterpieces. We combine luxury design with premium hardware for unmatched elegance.
            </p>
          </div>
          
          <div>
            <h5 className="text-white font-bold uppercase tracking-wider mb-6">Quick Links</h5>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="hover:text-accent cursor-pointer">Portfolio</li>
              <li className="hover:text-accent cursor-pointer">Services</li>
              <li className="hover:text-accent cursor-pointer">About Us</li>
              <li className="hover:text-accent cursor-pointer">Contact</li>
            </ul>
          </div>

          <div>
             <h5 className="text-white font-bold uppercase tracking-wider mb-6">Contact</h5>
             <ul className="space-y-3 text-gray-400 text-sm">
               <li>+91 98765 43210</li>
               <li>hello@eliteinteriors.com</li>
               <li>123, Luxury Lane, Mumbai</li>
             </ul>
          </div>

          <div>
            <h5 className="text-white font-bold uppercase tracking-wider mb-6">Newsletter</h5>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-white/5 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-accent"
              />
              <button className="bg-accent text-primary font-bold py-2 hover:bg-white transition-colors">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Elite Interior & Hardware. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
