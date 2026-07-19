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
import { CheckCircle2, Clock, Hammer, Sofa, Sparkles, Home as HomeIcon } from 'lucide-react';

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
  const [activeSection, setActiveSection] = useState('gallery'); // 'gallery' | 'tracker'
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState(staticProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [trackerUpdates, setTrackerUpdates] = useState([]);
  const [trackerFilter, setTrackerFilter] = useState('construction_active');
  const [selectedTrackerSite, setSelectedTrackerSite] = useState(null);

  // Fetch dynamic projects and tracker updates
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

    const fetchTrackerUpdates = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/project-updates`);
        setTrackerUpdates(response.data);
      } catch (error) {
        console.log("Could not fetch tracker updates");
      }
    };

    fetchProjects();
    fetchTrackerUpdates();

    const handleSwitchToTracker = () => {
      setActiveSection('tracker');
    };
    const handleSwitchToGallery = () => {
      setActiveSection('gallery');
    };

    window.addEventListener('switch-to-tracker', handleSwitchToTracker);
    window.addEventListener('switch-to-gallery', handleSwitchToGallery);

    return () => {
      window.removeEventListener('switch-to-tracker', handleSwitchToTracker);
      window.removeEventListener('switch-to-gallery', handleSwitchToGallery);
    };
  }, []);

  const getSiteCoverImage = (site) => {
    if (site.main_image) return getImageUrl(site.main_image);
    if (site.work_stages && site.work_stages.length > 0) {
      for (const s of site.work_stages) {
        const stageImages = typeof s === 'string' ? [] : (s.images || []);
        if (stageImages.length > 0) return getImageUrl(stageImages[0]);
      }
    }
    return null;
  };

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

        {/* Toggle Switch */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100/50 p-1.5 rounded-full inline-flex gap-1 border border-gray-200/50 bg-white shadow-inner">
            <button
              onClick={() => setActiveSection('gallery')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeSection === 'gallery'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              Project Gallery
            </button>
            <button
              onClick={() => setActiveSection('tracker')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeSection === 'tracker'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              <Clock size={14} /> Live Site Progress
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeSection === 'gallery' ? (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
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
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Tracker Tabs / Options */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {[
                  { key: 'construction_active', label: 'Ongoing Construction' },
                  { key: 'interior_active', label: 'Ongoing Interiors' },
                  { key: 'construction_completed', label: 'Construction Done' },
                  { key: 'interior_completed', label: 'Interior Done' }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setTrackerFilter(opt.key)}
                    className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      trackerFilter === opt.key 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-white text-gray-500 hover:text-primary border border-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Grid of sites */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trackerUpdates.filter(u => u.category === trackerFilter).length === 0 ? (
                  <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400">
                    No sites found in this category.
                  </div>
                ) : (
                  trackerUpdates.filter(u => u.category === trackerFilter).map(site => {
                    const coverImage = getSiteCoverImage(site);
                    const stageCount = site.work_stages ? site.work_stages.length : 0;
                    const latestStageObj = stageCount > 0 ? site.work_stages[stageCount - 1] : null;
                    const latestStageName = latestStageObj
                      ? (typeof latestStageObj === 'string' ? latestStageObj : latestStageObj.name)
                      : 'Planning Stage';
                    
                    return (
                      <motion.div
                        layout
                        key={site.id}
                        whileHover={{ y: -4 }}
                        onClick={() => setSelectedTrackerSite(site)}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between text-left"
                      >
                        <div>
                          {/* Image preview cover */}
                          <div className="h-48 w-full bg-gray-105 relative overflow-hidden">
                            {coverImage ? (
                              <img 
                                src={coverImage} 
                                alt={site.site_name} 
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/15 flex items-center justify-center">
                                {trackerFilter.includes('construction') ? (
                                  <Hammer className="text-accent/50" size={40} />
                                ) : (
                                  <Sofa className="text-accent/50" size={40} />
                                )}
                              </div>
                            )}
                            <div className="absolute top-4 left-4 bg-primary text-[10px] text-white uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                              {trackerFilter.includes('active') ? 'Ongoing' : 'Completed'}
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-6 space-y-4">
                            <div>
                              <h4 className="font-serif text-xl font-bold text-primary mb-1 line-clamp-1">{site.site_name}</h4>
                              <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                                {site.client_name && <p><span className="font-medium text-gray-700">Client:</span> {site.client_name}</p>}
                                {site.location && <p><span className="font-medium text-gray-700">Location:</span> {site.location}</p>}
                              </div>
                            </div>

                            {/* Current Stage bar / status */}
                            {trackerFilter.includes('active') && (
                              <div className="pt-2 border-t border-gray-100">
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wide text-accent mb-1.5">
                                  <span className="line-clamp-1">Latest: {latestStageName}</span>
                                  <span>{Math.min(100, stageCount * 10 || 10)}%</span>
                                </div>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    style={{ width: `${Math.min(100, stageCount * 10 || 10)}%` }} 
                                    className="bg-accent h-full rounded-full" 
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer details */}
                        <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-gray-100/60 text-xs text-gray-400">
                          <span>{stageCount} updates logged</span>
                          <span className="text-accent font-bold">View Details →</span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

      {/* Tracker Site Details Modal */}
      <AnimatePresence>
        {selectedTrackerSite && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrackerSite(null)}
              className="absolute inset-0 bg-primary/95 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[95vh]"
            >
              <button 
                onClick={() => setSelectedTrackerSite(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors font-bold"
              >
                ✕
              </button>

              {/* Images Grid/Carousel Section */}
              <div className="md:w-3/5 relative bg-gray-50 p-6 flex flex-col h-[400px] md:h-auto overflow-y-auto border-r border-gray-100">
                <div className="space-y-6">
                  {selectedTrackerSite.main_image && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Main Cover Photo</h4>
                      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-sm border border-gray-200">
                        <img 
                          src={getImageUrl(selectedTrackerSite.main_image)} 
                          alt={selectedTrackerSite.site_name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stage-wise Progress Gallery</h4>
                    
                    {(() => {
                      const stagesWithImages = (selectedTrackerSite.work_stages || []).filter(
                        stage => typeof stage !== 'string' && stage.images && stage.images.length > 0
                      );

                      if (stagesWithImages.length === 0) {
                        return (
                          <div className="h-48 flex flex-col items-center justify-center bg-gray-100 rounded-xl text-gray-400">
                            <Sparkles size={32} className="mb-2 text-gray-300" />
                            <p className="text-sm italic">No stage images uploaded yet.</p>
                          </div>
                        );
                      }

                      return stagesWithImages.map((stageObj, sIdx) => (
                        <div key={sIdx} className="space-y-2 border-b border-gray-100 pb-4 last:border-0 last:pb-0 text-left">
                          <span className="text-sm font-bold capitalize text-primary flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            {stageObj.name}
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {stageObj.images.map((img, idx) => {
                              const resolvedImg = getImageUrl(img);
                              return (
                                <a 
                                  href={resolvedImg} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  key={idx} 
                                  className="group relative aspect-[4/3] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all block border border-gray-200"
                                >
                                  <img 
                                    src={resolvedImg} 
                                    alt={`${stageObj.name} update ${idx + 1}`} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                  />
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="md:w-2/5 p-6 md:p-10 flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="mb-6">
                    <span className="text-accent text-xs font-bold uppercase tracking-widest bg-accent/10 text-primary px-3 py-1 rounded-full">
                      {selectedTrackerSite.category === 'construction_active' ? 'Ongoing Construction' :
                       selectedTrackerSite.category === 'interior_active' ? 'Ongoing Interiors' :
                       selectedTrackerSite.category === 'construction_completed' ? 'Construction Done' :
                       'Interior Done'}
                    </span>
                    <h2 className="text-3xl font-serif text-primary mt-3 mb-2">{selectedTrackerSite.site_name}</h2>
                    <div className="h-1 w-20 bg-accent rounded-full mb-4"></div>
                    
                    <div className="space-y-2 text-sm text-gray-650 bg-gray-50 p-4 rounded-xl border border-gray-100 text-left">
                      {selectedTrackerSite.client_name && (
                        <p><span className="font-semibold text-gray-700">Client:</span> {selectedTrackerSite.client_name}</p>
                      )}
                      {selectedTrackerSite.location && (
                        <p><span className="font-semibold text-gray-700">Location:</span> {selectedTrackerSite.location}</p>
                      )}
                      <p><span className="font-semibold text-gray-700">Last Updated:</span> {new Date(selectedTrackerSite.updated_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>

                  {/* Work Stages Timeline */}
                  <div className="text-left">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Construction & Interior Stages</h5>
                    {selectedTrackerSite.work_stages && selectedTrackerSite.work_stages.length > 0 ? (
                      <div className="relative pl-6 border-l-2 border-accent/30 space-y-6">
                        {selectedTrackerSite.work_stages.map((stage, idx) => {
                          const stageName = typeof stage === 'string' ? stage : stage.name;
                          return (
                            <div key={idx} className="relative">
                              {/* Timeline dot */}
                              <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-accent border-4 border-white shadow-sm flex items-center justify-center" />
                              <div>
                                <h6 className="font-bold text-primary text-sm capitalize">{stageName}</h6>
                                <p className="text-[10px] text-gray-400 uppercase">Stage Completed</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm italic">No stages logged yet.</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-4 italic text-center">Want live project updates for your house?</p>
                  <button 
                    onClick={() => {
                      const message = encodeURIComponent(`Hi, I'd like to talk about constructing my dream home. I saw your site updates for ${selectedTrackerSite.site_name}.`);
                      window.open(`https://wa.me/916376007979?text=${message}`, '_blank');
                    }}
                    className="w-full py-4 bg-primary text-white font-bold uppercase tracking-widest rounded-xl hover:bg-accent hover:text-primary transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Inquire About This Site
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
