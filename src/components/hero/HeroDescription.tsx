
import { motion } from "framer-motion";

const HeroDescription = () => {
  return (
    <p className="text-xl md:text-2xl mb-8 text-gray-700 max-w-2xl mx-auto backdrop-blur-sm bg-white/30 p-4 rounded-lg">
      Transform your screenshots with magical backgrounds.
      <motion.span 
        className="font-bold block mt-2"
        animate={{
          color: ['#9b87f5', '#D946EF', '#33C3F0', '#9b87f5']
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        Perfect for social media sharing.
      </motion.span>
    </p>
  );
};

export default HeroDescription;
