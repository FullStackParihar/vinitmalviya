import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Rajesh & Priya Malhotra",
    location: "Mumbai",
    rating: 5,
    text: "Ramdev Builders transformed our old apartment into a modern masterpiece. The 2D planning phase was crucial—they optimized every inch of space. Highly recommended!",
  },
  {
    id: 2,
    name: "Amit Verma",
    location: "Pune",
    rating: 5,
    text: "Excellent quality of construction. The team was professional, and the hardware used (hinges, locks) is top-notch. They delivered the project on time.",
  },
  {
    id: 3,
    name: "Sarah Fernandes",
    location: "Goa",
    rating: 5,
    text: "We hired them for architectural blueprints and civil work for our villa. The transparency in pricing and material quality was refreshing. True professionals.",
  }
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-primary/5">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Quote className="w-12 h-12 text-accent mx-auto mb-8 opacity-50" />
        
        <div className="relative h-[250px] md:h-[200px] flex items-center justify-center">
          <AnimatePresence mode='wait'>
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="absolute w-full"
            >
              <h3 className="text-xl md:text-2xl font-serif text-primary leading-relaxed italic mb-8">
                "{reviews[current].text}"
              </h3>
              
              <div className="flex flex-col items-center">
                <div className="flex gap-1 text-accent mb-2">
                  {[...Array(reviews[current].rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <h4 className="font-bold text-primary">{reviews[current].name}</h4>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{reviews[current].location}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                current === index ? 'bg-primary w-6' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
