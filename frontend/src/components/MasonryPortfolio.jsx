import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import kitchenImage from '../assets/kitchen.png';
import heroImage from '../assets/hero.png';
import constructionImage from '../assets/construction_site.png';
import constructionFoundationImage from '../assets/construction_foundation.png';
import floorPlanImage from '../assets/floor_plan.png';
import floorPlanApartmentImage from '../assets/floor_plan_apartment.png';

const projects = [
  {
    id: 1,
    title: "Emerald Heights Villa",
    category: "Living Room",
    scope: "Full Renovation",
    image: heroImage,
    size: "large"
  },
  {
    id: 2,
    title: "Minimalist Cullina",
    category: "Kitchen",
    scope: "Kitchen Redesign",
    image: kitchenImage,
    size: "small"
  },
  {
    id: 6,
    title: "Skyline Tower Site",
    category: "Construction",
    scope: "Structural Work",
    image: constructionImage,
    size: "small"
  },
  {
    id: 7,
    title: "Luxury Villa Blueprint",
    category: "Floor Plans",
    scope: "Architectural Planning",
    image: floorPlanImage,
    size: "large"
  },
  {
    id: 8,
    title: "City Center Foundation",
    category: "Construction",
    scope: "Civil Engineering",
    image: constructionFoundationImage, 
    size: "large"
  },
  {
    id: 9,
    title: "3BHK Apartment Layout",
    category: "Floor Plans",
    scope: "Residential Zoning",
    image: floorPlanApartmentImage,
    size: "small"
  },
  {
    id: 4,
    title: "Executive Suite",
    category: "Office",
    scope: "Commercial Fitout",
    image: kitchenImage, // reusing
    size: "small"
  },
   {
    id: 5,
    title: "Premium Hardware",
    category: "Hardware Fittings",
    scope: "Supply & Install",
    image: heroImage, // reusing
    size: "small"
  }
];

const categories = ["All", "Living Room", "Kitchen", "Construction", "Floor Plans", "Office"];

const MasonryPortfolio = () => {
  const [filter, setFilter] = useState("All");

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section className="py-20 px-4 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-accent tracking-widest uppercase mb-4 font-medium">Our Masterpieces</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-primary">Portfolio & Projects</h3>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm tracking-wide transition-all duration-300 ${
                filter === cat 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`group relative overflow-hidden rounded-sm cursor-pointer ${
                  project.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div className={`w-full h-full overflow-hidden ${project.size === 'large' ? 'aspect-square md:aspect-auto' : 'aspect-[4/3]'}`}>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-6">
                  <h4 className="text-2xl font-serif text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                    {project.title}
                  </h4>
                  <p className="text-accent uppercase tracking-wider text-sm mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                    {project.category}
                  </p>
                  <p className="text-gray-300 text-xs mb-4 max-w-[80%] translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                    {project.scope}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default MasonryPortfolio;
