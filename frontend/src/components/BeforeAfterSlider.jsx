import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';
import beforeImage from '../assets/before.png';
import afterImage from '../assets/after.png';

const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleDrag = (event, info) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      // Convert drag position to percentage (0-100)
      // Note: Framer Motion drag constraints are in pixels, but we want %
      // So we track the position manually or use info.point.x?
      // Simpler approach: Use a standard input range or mouse event manually if drag is tricky.
      // But let's try to make it feel "premium" with framer motion.
    }
  };

  // Simple mouse move implementation for robustness
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  };

  const handleTouchMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-accent tracking-widest uppercase mb-4 font-medium">Transformation</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-primary">See the Difference</h3>
        </div>

        <div 
          ref={containerRef}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-sm cursor-col-resize select-none"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* Background Image (After) */}
          <img 
            src={afterImage} 
            alt="After Renovation" 
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Foreground Image (Before) - Clipped */}
          <div 
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img 
              src={beforeImage} 
              alt="Before Renovation" 
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }} 
              // Note: We need to force this image to be full width of container, not clippath
              // Actually better to use CSS clip-path or width on parent div.
              // If we set width on parent div, child img needs to be the width of the GRANDPARENT container.
            />
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize shadow-[0_0_20px_rgba(0,0,0,0.5)] z-20"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-primary">
              <MoveHorizontal size={20} />
            </div>
          </div>

          {/* Labels */}
          <div className="absolute bottom-6 left-6 bg-black/50 text-white px-4 py-2 text-sm font-semibold tracking-wider rounded-sm z-30 pointer-events-none">
            BEFORE
          </div>
          <div className="absolute bottom-6 right-6 bg-accent text-primary px-4 py-2 text-sm font-semibold tracking-wider rounded-sm z-30 pointer-events-none">
            AFTER
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSlider;
