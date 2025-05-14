
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const HeroTitle = () => {
  const [clickCount, setClickCount] = useState(0);
  const isOpen = clickCount >= 3;

  const handleExclusiveClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <>
      <div className="flex justify-center items-center mb-8">
        <motion.div
          animate={{
            rotate: [0, 15, 0, -15, 0],
            scale: [1, 1.05, 1, 1.05, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        >
          <Sparkles className="text-unicorn-magenta h-10 w-10" />
        </motion.div>

        <div className="relative mx-4">
          <motion.div
            className="relative origin-top"
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 10 
            }}
          >
            {!isOpen ? (
              <motion.span 
                className="inline-block text-xl font-semibold uppercase tracking-widest rainbow-border px-4 py-1 rounded-md cursor-pointer"
                onClick={handleExclusiveClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Magic Editor
              </motion.span>
            ) : (
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block text-3xl"
              >
                🤫🤫🤫
              </motion.span>
            )}
          </motion.div>
        </div>

        <motion.div
          animate={{
            rotate: [0, -15, 0, 15, 0],
            scale: [1, 1.05, 1, 1.05, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 0.5
          }}
        >
          <Sparkles className="text-unicorn-skyBlue h-10 w-10" />
        </motion.div>
      </div>

      <motion.h1 
        className="text-5xl md:text-7xl font-bold mb-8 unicorn-text-gradient magic-sparkles"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        Unicorn Editor
      </motion.h1>
    </>
  );
};

export default HeroTitle;
