import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import MasonryPortfolio from '../components/MasonryPortfolio';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import HardwareShowcase from '../components/HardwareShowcase';
import Process from '../components/Process';
import Testimonials from '../components/Testimonials';
import Chatbot from '../components/Chatbot';
import BookingModal from '../components/BookingModal';
import Footer from '../components/Footer';

const Home = () => {
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
      
      
      <Footer />
    </div>
  );
};

export default Home;
