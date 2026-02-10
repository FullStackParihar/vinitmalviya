import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2, Upload, LogOut, LayoutGrid, Users, Phone, Mail, FileText, Calendar, Menu, X, Video, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL, { getImageUrl } from '../config';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [items, setItems] = useState([]);
  const [leads, setLeads] = useState([]);
  const [hardwareItems, setHardwareItems] = useState([]);
  
  const [newItem, setNewItem] = useState({
    title: '',
    category: 'Construction',
    scope: '',
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
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
    } else {
      fetchItems();
      fetchLeads();
      fetchHardware();
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

  const handlePortfolioSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.keys(newItem).forEach(key => {
      if (key === 'file') {
        formData.append('image', newItem[key]);
      } else {
        formData.append(key, newItem[key]);
      }
    });

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/portfolio`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      setNewItem({ title: '', category: 'Construction', scope: '', size: 'small', media_type: 'image', file: null });
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
      setLoading(false);
    }
  };

  const handleHardwareSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
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
                      disabled={loading}
                      className="w-full py-3 bg-accent text-primary font-bold uppercase tracking-wider rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                    >
                      {loading ? 'Uploading...' : 'Add Project'}
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
                      disabled={loading}
                      className="w-full py-3 bg-accent text-primary font-bold uppercase tracking-wider rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition-all shadow-md"
                    >
                      {loading ? 'Adding...' : 'Add Product'}
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
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;
