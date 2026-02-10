import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE_URL, { getImageUrl } from '../config';

const HardwareCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHardware = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/hardware`);
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch hardware", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHardware();
  }, []);

  const handleWhatsapp = (productName) => {
    const message = encodeURIComponent(`Hi, I'm interested in the ${productName}. Can you share more details?`);
    window.open(`https://wa.me/916376007979?text=${message}`, '_blank');
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
             <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Hardware Catalog</h1>
             <p className="text-gray-500 max-w-2xl mx-auto">Explore our premium collection of architectural hardware, locks, handles, and fittings.</p>
          </div>

          <div className="max-w-md mx-auto mb-12 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
             <input 
               type="text" 
               placeholder="Search products..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-accent shadow-sm"
             />
          </div>

          {loading ? (
             <div className="flex justify-center py-20">
               <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="group relative aspect-square overflow-hidden bg-gray-100">
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-primary text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                        {product.tag}
                      </div>
                      <img 
                        src={getImageUrl(product.image_url)} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button 
                           onClick={() => handleWhatsapp(product.name)}
                           className="bg-white text-primary font-bold px-6 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform"
                         >
                           Inquire Now
                         </button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                       <div className="flex justify-between items-start mb-1">
                         <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                         <span className="text-accent font-bold whitespace-nowrap ml-2">{product.price}</span>
                       </div>
                       <p className="text-gray-500 text-xs line-clamp-2 mb-3">{product.description}</p>
                       <button 
                         onClick={() => handleWhatsapp(product.name)}
                         className="w-full py-2 border border-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:border-accent hover:text-accent transition-colors"
                       >
                         View Details
                       </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-20 text-gray-400">
                   No products found matching "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HardwareCatalog;
