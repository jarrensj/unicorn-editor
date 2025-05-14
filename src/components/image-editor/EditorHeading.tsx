
import React from "react";
import { motion } from "framer-motion";

const EditorHeading = () => {
  return (
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-4 unicorn-text-gradient">Customize Your Screenshot</h2>
      <div className="w-24 h-1 bg-gradient-to-r from-unicorn-purple to-unicorn-magenta mx-auto mb-8"></div>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto">
        Choose a beautiful background for your screenshot to make it stand out on social media.
      </p>
    </motion.div>
  );
};

export default EditorHeading;
