import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Ruler, Hammer, Key } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Consultation & Concept",
    description: "We meet to understand your vision, needs, and budget. Our architects create initial layout sketches.",
    icon: <ClipboardList className="w-8 h-8 md:w-10 md:h-10 text-primary" />
  },
  {
    id: 2,
    title: "Design & Blueprint",
    description: "Detailed 2D/3D maps, structural drawings, and material selection (Hardware, Finish, etc).",
    icon: <Ruler className="w-8 h-8 md:w-10 md:h-10 text-primary" />
  },
  {
    id: 3,
    title: "Execution & Build",
    description: "Our skilled workforce handles construction, civil work, and installation with precision supervision.",
    icon: <Hammer className="w-8 h-8 md:w-10 md:h-10 text-primary" />
  },
  {
    id: 4,
    title: "Handover",
    description: "Final quality checks, cleaning, and handing over the keys to your dream space ready to move in.",
    icon: <Key className="w-8 h-8 md:w-10 md:h-10 text-primary" />
  }
];

const Process = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-accent tracking-widest uppercase mb-4 font-medium">How We Work</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-primary">From Blueprint to Reality</h3>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative bg-white pt-4 text-center md:text-left md:pt-0"
            >
              {/* Icon Circle */}
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto md:mx-0 bg-background rounded-full border border-gray-100 flex items-center justify-center mb-6 group-hover:border-accent group-hover:shadow-lg transition-all duration-300 relative z-10">
                {step.icon}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-sm">
                  0{step.id}
                </div>
              </div>

              <h4 className="text-xl font-serif font-bold text-primary mb-3">{step.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
