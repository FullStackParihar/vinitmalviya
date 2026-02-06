import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

const Navbar = ({ onBookClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const navLinks = [
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Services', href: '#services' },
    { name: 'Hardware', href: '#hardware' },
    { name: 'About', href: '#about' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center text-primary font-bold font-serif text-xl">
            R
          </div>
          <span className={`text-xl font-serif font-bold tracking-wide ${
            isScrolled ? 'text-primary' : 'text-white'
          }`}>
            RAMDEV <span className="text-accent">BUILDERS</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm tracking-widest uppercase font-medium hover:text-accent transition-colors ${
                isScrolled ? 'text-primary' : 'text-white/90'
              }`}
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={onBookClick}
            className={`px-6 py-2 border-2 text-sm font-bold uppercase tracking-wider transition-all hover:bg-accent hover:border-accent hover:text-primary ${
            isScrolled ? 'border-primary text-primary' : 'border-white text-white'
          }`}>
            Contact Us
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-accent"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white shadow-xl border-t border-gray-100"
        >
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-primary font-medium uppercase tracking-wide py-2 border-b border-gray-50"
              >
                {link.name}
              </a>
            ))}
             <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onBookClick();
                }}
                className="w-full py-3 bg-accent text-primary font-bold uppercase mt-4 flex items-center justify-center gap-2"
              >
               <Phone size={18} /> Book Consultation
             </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
