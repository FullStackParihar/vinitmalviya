import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, Calculator } from 'lucide-react';
import heroImage from '../assets/hero.png';
import kitchenImage from '../assets/kitchen.png';

const slides = [
  {
    id: 1,
    image: heroImage,
    title: "Redefining Luxury Living",
    subtitle: "Award-winning interior design & construction",
  },
  {
    id: 2,
    image: kitchenImage,
    title: "Modern Kitchen Elegance",
    subtitle: "Functionality meets exquisite design",
  }
];

const Hero = ({ onBookClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-primary">
      {/* Background Slider */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
          <img 
            src={slides[currentSlide].image} 
            alt={slides[currentSlide].title} 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-accent text-lg md:text-xl tracking-[0.2em] uppercase font-medium">
            Ramdev Builders & Developers
          </h2>
          <h1 className="text-4xl md:text-7xl font-serif text-white leading-tight">
            {slides[currentSlide].title}
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto font-light">
            {slides[currentSlide].subtitle}
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            <motion.button
              onClick={onBookClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-accent text-primary font-bold tracking-wide uppercase hover:bg-white transition-colors duration-300 flex items-center justify-center gap-2"
            >
              Book a Site Visit <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.a
              href="#portfolio"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white text-white font-bold tracking-wide uppercase hover:bg-white hover:text-primary transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              Explore Catalog <ChevronRight className="w-4 h-4" />
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-12 h-1 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-accent' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
