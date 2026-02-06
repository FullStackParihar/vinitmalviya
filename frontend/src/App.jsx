import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import MasonryPortfolio from './components/MasonryPortfolio';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import HardwareShowcase from './components/HardwareShowcase';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Chatbot from './components/Chatbot';
import BookingModal from './components/BookingModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-primary selection:bg-accent selection:text-primary">
      <Navbar onBookClick={() => setIsModalOpen(true)} />
      
      {/* 1. Hero: First Impression */}
      <Hero onBookClick={() => setIsModalOpen(true)} />
      
      {/* 2. Stats: Trust Markers */}
      <Stats />
      
      {/* 3. Process: Methodology (New) */}
      <div id="services">
        <Process />
      </div>

      {/* 4. Transformation: Visual Proof */}
      <BeforeAfterSlider />
      
      {/* 5. Portfolio: Core Offering */}
      <div id="portfolio">
        <MasonryPortfolio />
      </div>

      {/* 6. Product Store: Upsell Hardware */}
      <div id="hardware">
         <HardwareShowcase />
      </div>

      {/* 7. Social Proof: Reviews (New) */}
      <Testimonials />
      
      {/* Interactive Elements */}
      <Chatbot />
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      {/* Footer */}
      <footer id="about" className="bg-primary text-white py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h4 className="text-accent font-serif text-2xl font-bold mb-6">Ramdev Builders</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your partner in premium construction and interior excellence. From foundation to finishing touches, we build legacies.
            </p>
            <div className="flex gap-4">
                {/* Placeholder Social Icons */}
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary cursor-pointer transition-colors">IG</div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary cursor-pointer transition-colors">FB</div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary cursor-pointer transition-colors">LN</div>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h5 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">Explore</h5>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="hover:text-accent cursor-pointer transition-colors">Residental Projects</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Commercial Fitouts</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Blueprints & Maps</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Hardware Catalog</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
             <h5 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">Get in Touch</h5>
             <ul className="space-y-4 text-gray-400 text-sm">
               <li className="flex flex-col gap-1">
                  <span className="text-accent">Phone:</span> 
                  <span>+91 98690 61317</span>
                  <span>+91 70734 93193</span>
                  <span>+91 63760 07979</span>
               </li>
               <li className="flex items-start gap-3">
                  <span className="text-accent">Email:</span> 
                  vinitmalviya8369@gmail.com
               </li>
               <li className="flex items-start gap-3">
                  <span className="text-accent">Office:</span> 
                  <span>
                    House No 8, Kenpura Road, Choti Rani,<br/>
                    Landmark: TVS Showroom,<br/>
                    Rani, Pali, Rajasthan
                  </span>
               </li>
             </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">Updates</h5>
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-500 mb-2">Subscribe for design trends and price drops.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-white/5 border-y border-l border-white/10 px-4 py-3 text-white focus:outline-none focus:border-accent w-full text-sm"
                />
                <button className="bg-accent text-primary font-bold px-4 hover:bg-white transition-colors">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
           <p>&copy; {new Date().getFullYear()} Ramdev Builders & Developers. All rights reserved.</p>
           <div className="flex gap-6">
             <span className="cursor-pointer hover:text-gray-400">Privacy Policy</span>
             <span className="cursor-pointer hover:text-gray-400">Terms of Service</span>
           </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
