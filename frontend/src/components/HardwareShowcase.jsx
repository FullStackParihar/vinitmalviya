import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL, { getImageUrl } from '../config';
import { ArrowUpRight } from 'lucide-react';
import smartLockImage from '../assets/smart_lock.png';
import lockImage from '../assets/hero.png'; 
import hingeImage from '../assets/kitchen.png';

const products = [
  {
    id: 1,
    name: "Biometric Smart Lock",
    description: "Fingerprint, PIN, and App access. Grade 1 Security.",
    price: "₹18,500",
    image: smartLockImage,
    tag: "Best Seller"
  },
  {
    id: 2,
    name: "Gold Knurled Handle",
    description: "Solid brass with diamond-cut texture. 128mm center.",
    price: "₹450 / pc",
    image: lockImage,
    tag: "New Arrival"
  },
  {
    id: 3,
    name: "Soft-Close Hinge 110°",
    description: "Hydraulic damping system, 50,000 cycle tested.",
    price: "₹280 / pair",
    image: hingeImage,
    tag: "Contractor Favorite"
  }
];

const HardwareShowcase = () => {
  const [displayProducts, setDisplayProducts] = useState(products);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHardware = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/hardware`);
        if (response.data && response.data.length > 0) {
          // If we have API data, let's use it. 
          // You could also merge: [...products, ...response.data]
          // For now, let's append effectively so the section looks full.
          setDisplayProducts([...response.data, ...products]);
        }
      } catch (error) {
        console.error("Failed to fetch hardware", error);
      }
    };
    fetchHardware();
  }, []);
    
  const handleWhatsapp = (productName) => {
    const message = encodeURIComponent(`Hi, I'm interested in the ${productName}. Can you share more details?`);
    window.open(`https://wa.me/916376007979?text=${message}`, '_blank');
  };

  return (
    <section id="hardware" className="py-20 bg-primary/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-accent tracking-widest uppercase mb-4 font-medium">Premium Hardware</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-primary">Details Matter</h3>
          </div>
          <button 
             onClick={() => navigate('/hardware-catalog')}
             className="hidden md:flex items-center gap-2 text-primary font-bold border-b-2 border-accent pb-1 hover:text-accent transition-colors mt-6 md:mt-0"
           >
            View Full Catalog <ArrowUpRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  {product.tag}
                </div>
                <img 
                  src={product.image_url ? getImageUrl(product.image_url) : product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Quick Action Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button 
                    onClick={() => handleWhatsapp(product.name)}
                    className="w-full py-3 bg-white/90 backdrop-blur text-primary font-bold rounded-lg shadow-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="text-green-600 font-bold">WhatsApp</span> for Price
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-serif font-bold text-primary">{product.name}</h4>
                  <p className="text-accent font-bold">{product.price}</p>
                </div>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                  {product.description}
                </p>
                <button 
                  onClick={() => handleWhatsapp(product.name)}
                  className="w-full py-2 border border-gray-200 text-gray-600 rounded-lg hover:border-primary hover:text-primary transition-colors text-sm font-medium"
                >
                  Add to Quote
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <button 
            onClick={() => navigate('/hardware-catalog')}
            className="inline-flex items-center gap-2 text-primary font-bold border-b-2 border-accent pb-1"
          >
            View Full Catalog <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HardwareShowcase;
