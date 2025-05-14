
import { motion } from "framer-motion";
import HeroTitle from "./HeroTitle";
import HeroDescription from "./HeroDescription";

const HeroContent = () => {
  return (
    <motion.div 
      className="relative z-10 text-center max-w-4xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <HeroTitle />
      <HeroDescription />
    </motion.div>
  );
};

export default HeroContent;
