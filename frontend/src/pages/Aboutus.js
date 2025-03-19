import React from 'react';
import { motion } from 'framer-motion'; // For smooth animations
import Header from '../components/header';

function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col">
    <Header />
    <div className="min-h-screen bg-white text-black flex flex-col justify-center items-center px-8 py-16">
      
      {/* Title Section */}
      <motion.h1 
        className="text-5xl font-bold text-green-600 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        About Gurukandura Tea Estate
      </motion.h1>

      {/* Description */}
      <motion.p 
        className="text-lg text-gray-700 max-w-3xl text-center leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Nestled in the serene landscapes of Etampitiya, Bandarawela, Gurukandura Tea Estate is a thriving tea plantation spanning 30 acres of lush greenery. Renowned for producing high-quality Ceylon tea, our estate combines traditional cultivation techniques with a commitment to excellence.
        At Gurukandura, we take pride in our rich heritage and the hard work of our people, who play a vital role in maintaining the plantation’s legacy.  Whether you are a tea enthusiast or an admirer of nature’s finest offerings, Gurukandura Tea Estate invites you to experience the essence of premium Ceylon tea, crafted with passion and tradition.








      </motion.p>

      {/* Core Values Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        
        <motion.div 
          className="p-6 bg-green-500 text-white shadow-lg rounded-xl text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-2xl font-semibold mb-2">Quality</h3>
          <p className="text-md">We ensure excellence in every tea leaf we produce.</p>
        </motion.div>

        <motion.div 
          className="p-6 bg-black text-white shadow-lg rounded-xl text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-2xl font-semibold mb-2">Sustainability</h3>
          <p className="text-md">Eco-friendly farming to preserve nature.</p>
        </motion.div>

        <motion.div 
          className="p-6 bg-gray-600 text-white shadow-lg rounded-xl text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-2xl font-semibold mb-2">Community</h3>
          <p className="text-md">Empowering local workers with fair wages and opportunities.</p>
        </motion.div>

      </div>

      {/* Call to Action */}
      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-black mb-4">Experience the Taste of Excellence</h2>
        
        <motion.a 
          href="/shop"
          className="bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition mt-6 inline-block"
          whileHover={{ scale: 1.1 }}
        >
          Image Gallery
        </motion.a>
      </motion.div>

    </div>
    </div>
  );
}

export default AboutUs;
