import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const stats = [
  { label: "Projects Completed", value: 55, suffix: "+" },
  { label: "Happy Families", value: 50, suffix: "+" },
  { label: "Years Experience", value: 45, suffix: "" },
  { label: "Design Awards", value: 8, suffix: "" },
];

const Counter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    const increment = end / (duration * 60); // 60fps
    
    // Simple implementation, in a real app use useInView to trigger
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

const Stats = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              className="px-4"
            >
              <div className="text-4xl md:text-5xl font-serif font-bold text-accent mb-2">
                <Counter value={stat.value} />{stat.suffix}
              </div>
              <p className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
