import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2, Upload, LogOut, LayoutGrid, Users, Phone, Mail, FileText, Calendar, Menu, X, Video, Package, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL, { getImageUrl } from '../config';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [items, setItems] = useState([]);
  const [leads, setLeads] = useState([]);
  const [hardwareItems, setHardwareItems] = useState([]);
  const [projectUpdates, setProjectUpdates] = useState([]);
  
  const [newItem, setNewItem] = useState({
    title: '',
    category: 'Construction',
    scope: '',
    description: '',
    size: 'small',
    media_type: 'image',
    file: null
  });

  const [newHardware, setNewHardware] = useState({
    name: '',
    description: '',
    price: '',
    tag: 'New Arrival',
    image: null
  });

  const [newUpdate, setNewUpdate] = useState({
    site_name: '',
    client_name: '',
    location: '',
    category: 'construction_active',
    work_stages: [], // array of { name, images }
    main_image: ''
  });
  const [mainImageFile, setMainImageFile] = useState(null);
  const [stageFiles, setStageFiles] = useState({}); // stageName -> Array of Files
  const [editingUpdateId, setEditingUpdateId] = useState(null);

  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [loadingHardware, setLoadingHardware] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // --- Fetch Data ---
  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/portfolio`);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items", error);
    }
  };

  const fetchLeads = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads", error);
    }
  };

  const fetchHardware = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/hardware`);
      setHardwareItems(response.data);
    } catch (error) {
      console.error("Error fetching hardware", error);
    }
  };

  const fetchProjectUpdates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/project-updates`);
      setProjectUpdates(response.data);
    } catch (error) {
      console.error("Error fetching project updates", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
    } else {
      fetchItems();
      fetchLeads();
      fetchHardware();
      fetchProjectUpdates();
    }
  }, []);

  // --- Actions ---
  const handleDeleteItem = async (id) => {
    if(!window.confirm("Delete this project?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/portfolio/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem('token');
        navigate('/admin');
      } else {
        alert("Failed to delete item");
      }
    }
  };

  const handleDeleteLead = async (id) => {
    if(!window.confirm("Delete this inquiry?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLeads();
    } catch (error) {
      alert("Failed to delete lead");
    }
  };

  const handleDeleteHardware = async (id) => {
    if(!window.confirm("Delete this product?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/hardware/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHardware();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Session expired");
        localStorage.removeItem('token');
        navigate('/admin');
      } else {
        alert("Failed to delete product");
      }
    }
  };

  const handleDeleteUpdate = async (id) => {
    if(!window.confirm("Delete this project update?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/project-updates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjectUpdates();
    } catch (error) {
      alert("Failed to delete project update");
    }
  };

  const handlePortfolioSubmit = async (e) => {
    e.preventDefault();
    setLoadingPortfolio(true);
    const formData = new FormData();
    formData.append('title', newItem.title);
    formData.append('category', newItem.category);
    formData.append('scope', newItem.scope);
    formData.append('description', newItem.description);
    formData.append('size', newItem.size);
    formData.append('media_type', newItem.media_type);
    formData.append('image', newItem.file);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/portfolio`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      setNewItem({ title: '', category: 'Construction', scope: '', description: '', size: 'small', media_type: 'image', file: null });
      fetchItems();
      alert("Item added successfully!");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem('token');
        navigate('/admin');
      } else {
        alert("Failed to add item");
      }
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const handleHardwareSubmit = async (e) => {
    e.preventDefault();
    setLoadingHardware(true);
    const formData = new FormData();
    formData.append('name', newHardware.name);
    formData.append('description', newHardware.description);
    formData.append('price', newHardware.price);
    formData.append('tag', newHardware.tag);
    formData.append('image', newHardware.image);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/hardware`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewHardware({ name: '', description: '', price: '', tag: 'New Arrival', image: null });
      fetchHardware();
      alert("Product added successfully!");
    } catch (error) {
       console.error(error);
       alert("Failed to add product");
    } finally {
      setLoadingHardware(false);
    }
  };

  const handleStartEdit = (update) => {
    setEditingUpdateId(update.id);
    
    // Normalize work stages (if legacy string format, map to {name, images})
    const normalizedStages = (update.work_stages || []).map(stage => {
      if (typeof stage === 'string') {
        return { name: stage, images: [] };
      }
      return { name: stage.name, images: stage.images || [] };
    });

    setNewUpdate({
      site_name: update.site_name || '',
      client_name: update.client_name || '',
      location: update.location || '',
      category: update.category || 'construction_active',
      work_stages: normalizedStages,
      main_image: update.main_image || ''
    });
    setMainImageFile(null);
    setStageFiles({});

    // Scroll to top so the form is visible
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingUpdateId(null);
    setNewUpdate({
      site_name: '',
      client_name: '',
      location: '',
      category: 'construction_active',
      work_stages: [],
      main_image: ''
    });
    setMainImageFile(null);
    setStageFiles({});
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    const formData = new FormData();
    formData.append('site_name', newUpdate.site_name);
    formData.append('client_name', newUpdate.client_name);
    formData.append('location', newUpdate.location);
    formData.append('category', newUpdate.category);
    formData.append('work_stages', JSON.stringify(newUpdate.work_stages));
    
    if (mainImageFile) {
      formData.append('main_image', mainImageFile);
    } else if (newUpdate.main_image) {
      formData.append('existing_main_image', newUpdate.main_image);
    }

    Object.keys(stageFiles).forEach(stageName => {
      const files = stageFiles[stageName];
      if (files && files.length > 0) {
        files.forEach(file => {
          formData.append(`stage_images_${stageName}`, file);
        });
      }
    });

    try {
      const token = localStorage.getItem('token');
      if (editingUpdateId) {
        await axios.put(`${API_BASE_URL}/api/project-updates/${editingUpdateId}`, formData, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert("Project update updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/project-updates`, formData, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert("Project update added successfully!");
      }
      setNewUpdate({ 
        site_name: '', 
        client_name: '', 
        location: '', 
        category: 'construction_active', 
        work_stages: [], 
        main_image: '' 
      });
      setMainImageFile(null);
      setStageFiles({});
      setEditingUpdateId(null);
      fetchProjectUpdates();
    } catch (error) {
       console.error(error);
       if (error.response && error.response.status === 401) {
         alert("Session expired. Please log in again.");
         localStorage.removeItem('token');
         navigate('/admin');
       } else {
         alert("Failed to save project update: " + (error.response?.data?.detail || error.message));
       }
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-primary text-white fixed h-full z-20">
        <div className="p-8 border-b border-white/10">
          <h1 className="text-xl font-serif font-bold tracking-wide">
            RAMDEV <span className="text-accent">ADMIN</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'portfolio' ? 'bg-accent text-primary font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutGrid size={20} /> Portfolio
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'leads' ? 'bg-accent text-primary font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Users size={20} /> Inquiries
          </button>
          <button 
            onClick={() => setActiveTab('hardware')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'hardware' ? 'bg-accent text-primary font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Package size={20} /> Hardware
          </button>
          <button 
            onClick={() => setActiveTab('updates')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'updates' ? 'bg-accent text-primary font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <FileText size={20} /> Site Updates
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 rounded-lg transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-primary text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
         <span className="font-serif font-bold tracking-wide">RAMDEV <span className="text-accent">ADMIN</span></span>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
           {isMobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary text-white border-t border-white/10 fixed w-full z-20 top-[60px] shadow-xl overflow-hidden" 
          >
             <nav className="p-4 space-y-2">
                <button 
                  onClick={() => { setActiveTab('portfolio'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'portfolio' ? 'bg-accent text-primary font-bold' : 'text-gray-400'}`}
                >
                  <LayoutGrid size={20} /> Portfolio
                </button>
                <button 
                  onClick={() => { setActiveTab('leads'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'leads' ? 'bg-accent text-primary font-bold' : 'text-gray-400'}`}
                >
                  <Users size={20} /> Inquiries
                </button>
                <button 
                  onClick={() => { setActiveTab('hardware'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'hardware' ? 'bg-accent text-primary font-bold' : 'text-gray-400'}`}
                >
                  <Package size={20} /> Hardware
                </button>
                <button 
                  onClick={() => { setActiveTab('updates'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'updates' ? 'bg-accent text-primary font-bold' : 'text-gray-400'}`}
                >
                  <FileText size={20} /> Site Updates
                </button>
                 <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 rounded-lg"
                >
                  <LogOut size={20} /> Logout
                </button>
             </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'portfolio' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Form */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                  <h2 className="text-xl font-serif text-primary mb-6 flex items-center gap-2">
                    <Upload size={20} className="text-accent" /> New Project
                  </h2>
                  <form onSubmit={handlePortfolioSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Title</label>
                      <input 
                        type="text" 
                        value={newItem.title}
                        onChange={e => setNewItem({...newItem, title: e.target.value})}
                        className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent transition-colors"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</label>
                        <select 
                           value={newItem.category}
                           onChange={e => setNewItem({...newItem, category: e.target.value})}
                           className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
                        >
                          {["Construction", "Exterior", "Floor Plans", "Living Room", "Kitchen", "Office"].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Size</label>
                         <select 
                           value={newItem.size}
                           onChange={e => setNewItem({...newItem, size: e.target.value})}
                           className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
                        >
                          <option value="small">Small</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                    </div>

                    <div>
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Scope</label>
                       <input 
                        type="text" 
                        value={newItem.scope}
                        onChange={e => setNewItem({...newItem, scope: e.target.value})}
                        className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
                        required
                      />
                    </div>

                    <div>
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                       <textarea 
                        value={newItem.description}
                        onChange={e => setNewItem({...newItem, description: e.target.value})}
                        rows={3}
                        className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
                        placeholder="Detailed project explanation..."
                      />
                    </div>

                    <div>
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Media Type</label>
                         <div className="flex gap-4 mt-2">
                            <button
                              type="button"
                              onClick={() => setNewItem({...newItem, media_type: 'image'})}
                              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${newItem.media_type === 'image' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200'}`}
                            >
                              Image
                            </button>
                            <button
                              type="button"
                              onClick={() => setNewItem({...newItem, media_type: 'video'})}
                              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${newItem.media_type === 'video' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200'}`}
                            >
                              Video
                            </button>
                         </div>
                    </div>

                    <div className="mt-4">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                              <p className="text-xs text-gray-500">{newItem.file ? newItem.file.name : (newItem.media_type === 'video' ? 'MP4, WebM up to 10MB' : 'PNG, JPG, GIF')}</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept={newItem.media_type === 'video' ? "video/*" : "image/*"}
                            onChange={e => setNewItem({...newItem, file: e.target.files[0]})}
                            required
                          />
                      </label>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loadingPortfolio}
                      className="w-full py-3 bg-accent text-primary font-bold uppercase tracking-wider rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                    >
                      {loadingPortfolio ? 'Uploading...' : 'Add Project'}
                    </button>
                  </form>
                </div>
              </div>

              {/* List */}
              <div className="lg:col-span-2">
                 <h2 className="text-xl font-serif text-primary mb-6 flex items-center justify-between">
                   <span>Existing Projects</span>
                   <span className="text-sm font-sans font-normal text-gray-500">{items.length} items</span>
                 </h2>
                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                   {items.length === 0 ? (
                     <div className="p-8 text-center text-gray-400">No projects found. Add one!</div>
                   ) : (
                     <div className="divide-y divide-gray-100">
                       {items.map(item => (
                         <div key={item.id} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-gray-50 transition-colors">
                            <div className="relative w-full sm:w-32 h-48 sm:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                               {item.media_type === 'video' ? (
                                  <>
                               {/* Check if image_url starts with http, if so use as is, else prepend localhost */}
                       <video 
                             src={getImageUrl(item.image_url)} 
                             className="w-full h-full object-cover"
                             muted
                             playsInline
                             onMouseOver={e => e.target.play()}
                             onMouseOut={e => e.target.pause()}
                                   />
                                   <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full"><Video size={12} className="text-white"/></div>
                                  </>
                               ) : (
                                  <img 
                            src={getImageUrl(item.image_url)} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                          />
                               )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">{item.category}</span>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">{item.size}</span>
                              </div>
                              <h3 className="font-bold text-lg text-primary truncate">{item.title}</h3>
                              <p className="text-sm text-gray-500 truncate">{item.scope}</p>
                            </div>

                            <button 
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all self-end sm:self-center"
                              title="Delete Project"
                            >
                              <Trash2 size={20} />
                            </button>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="max-w-4xl mx-auto">
               <h2 className="text-xl font-serif text-primary mb-6 flex items-center justify-between">
                 <span>Client Inquiries</span>
                 <span className="text-sm font-sans font-normal text-gray-500">{leads.length} leads</span>
               </h2>
               
               <div className="grid grid-cols-1 gap-4">
                 {leads.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl text-center text-gray-400 border border-gray-100">
                      <Users size={48} className="mx-auto mb-4 opacity-20" />
                      <p>No inquiries received yet.</p>
                    </div>
                 ) : (
                   leads.map(lead => (
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       key={lead.id} 
                       className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow"
                     >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-primary">{lead.name}</h3>
                            <span className="px-2 py-0.5 bg-accent/10 text-yellow-700 text-xs rounded-full font-bold uppercase tracking-wider">
                              {lead.interest}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-600 mb-4">
                             <a href={`tel:${lead.phone}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                               <Phone size={16} /> {lead.phone}
                             </a>
                             {lead.email && (
                               <a href={`mailto:${lead.email}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                                 <Mail size={16} /> {lead.email}
                               </a>
                             )}
                             <div className="flex items-center gap-2">
                               <Calendar size={16} /> {new Date(lead.created_at).toLocaleDateString()}
                             </div>
                          </div>
                        </div>

                        <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                           <button 
                             onClick={() => handleDeleteLead(lead.id)}
                             className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors ml-auto md:ml-0"
                           >
                             <Trash2 size={16} /> Delete
                           </button>
                        </div>
                     </motion.div>
                   ))
                 )}
               </div>
            </div>
          )}

          {activeTab === 'hardware' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Form */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                  <h2 className="text-xl font-serif text-primary mb-6 flex items-center gap-2">
                    <Package size={20} className="text-accent" /> New Product
                  </h2>
                  <form onSubmit={handleHardwareSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Name</label>
                      <input 
                        type="text" 
                        value={newHardware.name}
                        onChange={e => setNewHardware({...newHardware, name: e.target.value})}
                        className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Price Quote</label>
                      <input 
                        type="text" 
                        value={newHardware.price}
                        onChange={e => setNewHardware({...newHardware, price: e.target.value})}
                        className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
                        placeholder="e.g. ₹450 / pc"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tag</label>
                      <select 
                         value={newHardware.tag}
                         onChange={e => setNewHardware({...newHardware, tag: e.target.value})}
                         className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
                      >
                        {["New Arrival", "Best Seller", "Contractor Favorite", "Premium", "Economy"].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                      <textarea 
                        value={newHardware.description}
                        onChange={e => setNewHardware({...newHardware, description: e.target.value})}
                        className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent h-24"
                        required
                      />
                    </div>

                    <div className="mt-4">
                       <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
                               <Upload className="w-8 h-8 mb-3 text-gray-400" />
                               <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Upload Image</span></p>
                               <p className="text-xs text-gray-500">{newHardware.image ? newHardware.image.name : 'PNG, JPG'}</p>
                           </div>
                           <input 
                             type="file" 
                             className="hidden" 
                             accept="image/*"
                             onChange={e => setNewHardware({...newHardware, image: e.target.files[0]})}
                             required
                           />
                       </label>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loadingHardware}
                      className="w-full py-3 bg-accent text-primary font-bold uppercase tracking-wider rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition-all shadow-md"
                    >
                      {loadingHardware ? 'Adding...' : 'Add Product'}
                    </button>
                  </form>
                </div>
              </div>

              {/* List */}
              <div className="lg:col-span-2">
                 <h2 className="text-xl font-serif text-primary mb-6 flex items-center justify-between">
                   <span>Hardware Catalog</span>
                   <span className="text-sm font-sans font-normal text-gray-500">{hardwareItems.length} items</span>
                 </h2>
                 <div className="grid grid-cols-1 gap-4">
                   {hardwareItems.map(item => (
                     <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={getImageUrl(item.image_url)} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                             <h4 className="font-bold text-primary">{item.name}</h4>
                             <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{item.tag}</span>
                           </div>
                           <p className="text-accent font-bold text-sm mb-1">{item.price}</p>
                           <p className="text-gray-500 text-xs line-clamp-1">{item.description}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteHardware(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'updates' && (() => {
            const isConstruction = newUpdate.category.includes('construction');
            const availableStages = isConstruction ? [
              "foundation work", 
              "rcc work", 
              "brick work", 
              "light fitting work", 
              "plaster work", 
              "plumbing work", 
              "tiles and marble work", 
              "roof waterproofing", 
              "light installation"
            ] : [
              "Living Room", 
              "Bedroom", 
              "Kitchen", 
              "Bathroom"
            ];
            
            const handleStageToggle = (stageName) => {
              const isSelected = newUpdate.work_stages.some(s => s.name === stageName);
              let updatedStages;
              if (isSelected) {
                updatedStages = newUpdate.work_stages.filter(s => s.name !== stageName);
                const newStageFiles = { ...stageFiles };
                delete newStageFiles[stageName];
                setStageFiles(newStageFiles);
              } else {
                updatedStages = [...newUpdate.work_stages, { name: stageName, images: [] }];
              }
              setNewUpdate({...newUpdate, work_stages: updatedStages});
            };

            return (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24 max-h-[85vh] overflow-y-auto">
                    <h2 className="text-xl font-serif text-primary mb-6 flex items-center gap-2">
                      <FileText size={20} className="text-accent" /> {editingUpdateId ? 'Edit Site Update' : 'New Site Update'}
                    </h2>
                    <form onSubmit={handleUpdateSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Update Category</label>
                        <select 
                           value={newUpdate.category}
                           onChange={e => {
                             setNewUpdate({
                               ...newUpdate,
                               category: e.target.value,
                               work_stages: []
                             });
                             setStageFiles({});
                           }}
                           className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent text-sm"
                        >
                          <option value="construction_active">Ongoing Construction</option>
                          <option value="interior_active">Ongoing Interiors</option>
                          <option value="construction_completed">Construction Done</option>
                          <option value="interior_completed">Interior Done</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Site Name</label>
                        <input 
                           type="text" 
                           value={newUpdate.site_name}
                           onChange={e => setNewUpdate({...newUpdate, site_name: e.target.value})}
                           className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent text-sm"
                           placeholder="e.g. Siddharth Residency"
                           required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Client Name</label>
                        <input 
                           type="text" 
                           value={newUpdate.client_name}
                           onChange={e => setNewUpdate({...newUpdate, client_name: e.target.value})}
                           className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent text-sm"
                           placeholder="e.g. Mr. Rajesh Sharma"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</label>
                        <input 
                           type="text" 
                           value={newUpdate.location}
                           onChange={e => setNewUpdate({...newUpdate, location: e.target.value})}
                           className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent text-sm"
                           placeholder="e.g. Bandra, Mumbai"
                        />
                      </div>

                      {/* Main Cover Image */}
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 font-semibold text-gray-700">Main Cover Image</label>
                        {newUpdate.main_image && (
                          <div className="mb-2 relative w-32 aspect-video rounded-lg overflow-hidden border border-gray-200">
                            <img src={getImageUrl(newUpdate.main_image)} alt="Existing Cover" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setNewUpdate({ ...newUpdate, main_image: '' })}
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                              title="Delete Cover"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setMainImageFile(e.target.files[0]);
                            }
                          }}
                          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-primary hover:file:bg-accent/20 cursor-pointer"
                        />
                        {mainImageFile && (
                          <div className="mt-2 relative w-32 aspect-video rounded-lg overflow-hidden border border-gray-200">
                            <img src={URL.createObjectURL(mainImageFile)} alt="New Main Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setMainImageFile(null)}
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                          Select Ongoing Work Stages
                        </label>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-100 rounded-lg bg-gray-50">
                          {availableStages.map(stage => {
                            const checked = newUpdate.work_stages.some(s => s.name === stage);
                            return (
                              <label key={stage} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-primary">
                                <input 
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => handleStageToggle(stage)}
                                  className="rounded border-gray-300 text-accent focus:ring-accent"
                                />
                                <span className="capitalize">{stage}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Stage-Specific Uploads */}
                      {newUpdate.work_stages.length > 0 && (
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Stage Images <span className="normal-case font-normal">(hold Ctrl to pick multiple)</span></label>
                          {newUpdate.work_stages.map(stageObj => (
                            <div key={stageObj.name} className="p-3 bg-gray-50 border border-gray-100 rounded-lg space-y-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold capitalize text-primary">{stageObj.name}</span>
                                <span className="text-[10px] text-gray-400">{(stageObj.images?.length || 0) + (stageFiles[stageObj.name]?.length || 0)} img(s)</span>
                              </div>
                              
                              {/* Existing stage images */}
                              {stageObj.images && stageObj.images.length > 0 && (
                                <div className="grid grid-cols-4 gap-1.5">
                                  {stageObj.images.map((imgUrl, idx) => (
                                    <div key={idx} className="relative aspect-square rounded overflow-hidden border border-gray-200">
                                      <img src={getImageUrl(imgUrl)} alt="Stage" className="w-full h-full object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updatedStages = newUpdate.work_stages.map(s => {
                                            if (s.name === stageObj.name) {
                                              return { ...s, images: s.images.filter((_, i) => i !== idx) };
                                            }
                                            return s;
                                          });
                                          setNewUpdate({ ...newUpdate, work_stages: updatedStages });
                                        }}
                                        className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                                      >
                                        <X size={10} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* New uploads */}
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files) {
                                    const newFiles = Array.from(e.target.files);
                                    setStageFiles(prev => ({
                                      ...prev,
                                      [stageObj.name]: [...(prev[stageObj.name] || []), ...newFiles]
                                    }));
                                  }
                                }}
                                className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-accent/10 file:text-primary hover:file:bg-accent/20 cursor-pointer"
                              />

                              {stageFiles[stageObj.name] && stageFiles[stageObj.name].length > 0 && (
                                <div className="grid grid-cols-4 gap-1.5 mt-1">
                                  {stageFiles[stageObj.name].map((file, idx) => (
                                    <div key={idx} className="relative aspect-square rounded overflow-hidden border border-gray-200">
                                      <img src={URL.createObjectURL(file)} alt="New Preview" className="w-full h-full object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = stageFiles[stageObj.name].filter((_, i) => i !== idx);
                                          setStageFiles(prev => ({ ...prev, [stageObj.name]: updated }));
                                        }}
                                        className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                                      >
                                        <X size={10} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        {editingUpdateId && (
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold uppercase tracking-wider rounded-lg hover:bg-gray-300 transition-all shadow-md mt-4"
                          >
                            Cancel
                          </button>
                        )}
                        <button 
                          type="submit" 
                          disabled={loadingUpdate}
                          className="flex-[2] py-3 bg-accent text-primary font-bold uppercase tracking-wider rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition-all shadow-md mt-4"
                        >
                          {loadingUpdate ? 'Saving...' : editingUpdateId ? 'Update Info' : 'Add Site Update'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                   <h2 className="text-xl font-serif text-primary mb-6 flex items-center justify-between">
                     <span>Project Site Statuses</span>
                     <span className="text-sm font-sans font-normal text-gray-500">{projectUpdates.length} updates</span>
                   </h2>
                   <div className="grid grid-cols-1 gap-4">
                     {projectUpdates.length === 0 ? (
                       <div className="bg-white p-8 text-center text-gray-400 rounded-xl border border-gray-100">
                         No project updates found. Add one!
                       </div>
                     ) : (
                       projectUpdates.map(update => (
                         <div key={update.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-4 hover:shadow-md transition-shadow">
                           {update.main_image && (
                             <div className="w-full md:w-32 aspect-video md:aspect-square rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                               <img src={getImageUrl(update.main_image)} alt="Cover" className="w-full h-full object-cover" />
                             </div>
                           )}
                           <div className="flex-1 space-y-3">
                             <div>
                               <div className="flex items-center gap-2 mb-1 flex-wrap">
                                 <h4 className="font-bold text-lg text-primary">{update.site_name}</h4>
                                 <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                   update.category === 'construction_active' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                   update.category === 'interior_active' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                   'bg-green-50 text-green-700 border border-green-200'
                                 }`}>
                                   {update.category.replace('_', ' ')}
                                 </span>
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                                 {update.client_name && <p><span className="font-semibold text-gray-700">Client:</span> {update.client_name}</p>}
                                 {update.location && <p><span className="font-semibold text-gray-700">Location:</span> {update.location}</p>}
                                </div>
                              </div>

                              {update.work_stages && update.work_stages.length > 0 && (
                                <div>
                                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Ongoing/Completed Work Stages</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {update.work_stages.map((stage, idx) => {
                                      const stageName = typeof stage === 'string' ? stage : stage.name;
                                      const stageImages = typeof stage === 'string' ? [] : (stage.images || []);
                                      return (
                                        <div key={idx} className="flex flex-col gap-1 bg-amber-50/50 border border-amber-200/60 p-2 rounded-lg min-w-28 text-left">
                                          <span className="text-amber-800 text-xs font-bold capitalize">
                                            {stageName}
                                          </span>
                                          {stageImages.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                              {stageImages.map((img, imgIdx) => (
                                                <a href={img} target="_blank" rel="noopener noreferrer" key={imgIdx} className="block w-6 h-6 rounded overflow-hidden border border-gray-150 hover:opacity-85 transition-opacity">
                                                  <img src={img} alt="Stage preview" className="w-full h-full object-cover" />
                                                </a>
                                              ))}
                                            </div>
                                          ) : (
                                            <span className="text-[10px] text-gray-400">No stage images</span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-start md:items-center gap-2">
                              <button 
                                onClick={() => handleStartEdit(update)}
                                className="p-2 text-gray-400 hover:text-accent hover:bg-yellow-50 rounded-lg transition-all self-start md:self-center"
                                title="Edit Site Update"
                              >
                                <Edit size={22} />
                              </button>
                              <button 
                                onClick={() => handleDeleteUpdate(update.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all self-start md:self-center"
                                title="Delete Site Update"
                              >
                                <Trash2 size={22} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                 </div>
              </div>
            );
          })()}
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;
