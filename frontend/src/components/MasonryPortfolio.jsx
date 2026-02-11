import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import API_BASE_URL, { getImageUrl } from '../config';
import kitchenImage from '../assets/kitchen.png';
import heroImage from '../assets/hero.png';
import constructionImage from '../assets/construction_site.png';
import constructionFoundationImage from '../assets/construction_foundation.png';
import floorPlanImage from '../assets/floor_plan.png';
import floorPlanApartmentImage from '../assets/floor_plan_apartment.png';
import exteriorImage from '../assets/exterior_elevation.png';

// Fallback data
const staticProjects = [
  {
    id: 1,
    title: "Emerald Heights Villa",
    category: "Living Room",
    scope: "Full Renovation",
    image: heroImage,
    size: "large"
  },
  {
    id: 10,
    title: "The Glass House",
    category: "Exterior",
    scope: "Elevation Design",
    image: exteriorImage,
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

const categories = ["All", "Construction", "Exterior", "Floor Plans", "Living Room", "Kitchen", "Office"];

const MasonryPortfolio = () => {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState(staticProjects);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch dynamic projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/portfolio`);
        if (response.data && response.data.length > 0) {
          const apiProjects = response.data.map(p => ({
            ...p,
            image: getImageUrl(p.image_url) 
          }));
          setProjects([...apiProjects, ...staticProjects]); // Append or replace? Let's append for now so it's not empty
        }
      } catch (error) {
        console.log("Using static data (Backend offline or empty)");
      }
    };
    fetchProjects();
  }, []);

  const handleWhatsapp = (project) => {
    const message = encodeURIComponent(`Hi, I'm interested in knowing more about the project: ${project.title}.`);
    window.open(`https://wa.me/916376007979?text=${message}`, '_blank');
  };

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
          className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
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
                onClick={() => setSelectedProject(project)}
                className="group relative overflow-hidden rounded-sm cursor-pointer break-inside-avoid shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-full relative">
                  {project.media_type === 'video' ? (
                       <video 
                         src={project.image} 
                         className="w-full h-auto block rounded-sm transition-transform duration-700 group-hover:scale-105"
                         autoPlay loop muted playsInline
                       />
                  ) : (
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-auto block rounded-sm transition-transform duration-700 group-hover:scale-105"
                      />
                  )}
                </div>
                
                {/* Overlay: Always visible bottom-gradient on mobile, full-screen hover on desktop */}
                <div className="absolute inset-x-0 bottom-0 md:inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent md:bg-primary/80 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end md:justify-center items-center text-center p-4 md:p-6 pb-6 md:pb-6">
                  <div className="translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
                    <h4 className="text-lg md:text-2xl font-serif text-white mb-1 md:mb-2">
                      {project.title}
                    </h4>
                    <p className="text-accent uppercase tracking-wider text-[10px] md:text-sm mb-1 md:mb-4 font-bold">
                      {project.category}
                    </p>
                    <p className="hidden md:block text-gray-300 text-xs max-w-[80%] mx-auto">
                      {project.scope}
                    </p>
                    <div className="mt-4 hidden md:block">
                      <span className="text-white text-xs border border-white/30 px-3 py-1 rounded-full bg-white/10">View Details</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-primary/95 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>

              {/* Image Section */}
              <div className="md:w-3/5 relative bg-gray-100 h-[300px] md:h-auto overflow-hidden">
                {selectedProject.media_type === 'video' ? (
                  <video 
                    src={selectedProject.image} 
                    className="w-full h-full object-cover"
                    autoPlay loop muted playsInline
                  />
                ) : (
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Details Section */}
              <div className="md:w-2/5 p-6 md:p-10 flex flex-col overflow-y-auto">
                <div className="mb-8">
                  <span className="text-accent text-sm font-bold uppercase tracking-widest">{selectedProject.category}</span>
                  <h2 className="text-3xl font-serif text-primary mt-2 mb-4">{selectedProject.title}</h2>
                  <div className="h-1 w-20 bg-accent rounded-full mb-6"></div>
                  
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Project Scope</h5>
                      <p className="text-primary font-medium">{selectedProject.scope}</p>
                    </div>
                    
                    {selectedProject.description && (
                      <div>
                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</h5>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {selectedProject.description}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Scale</h5>
                        <p className="text-xs font-bold text-primary uppercase">{selectedProject.size}</p>
                      </div>
                      <div>
                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</h5>
                        <p className="text-xs font-bold text-green-600 uppercase">Completed</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-4 italic">Love this design? Let's build your dream space.</p>
                  <button 
                    onClick={() => handleWhatsapp(selectedProject)}
                    className="w-full py-4 bg-primary text-white font-bold uppercase tracking-widest rounded-xl hover:bg-accent hover:text-primary transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Discuss This Project
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MasonryPortfolio;
