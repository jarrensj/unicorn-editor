
import { motion } from "framer-motion";

type FloatingOrbsProps = {
  mousePosition: { x: number; y: number };
};

const FloatingOrbs = ({ mousePosition }: FloatingOrbsProps) => {
  return (
    <>
      <motion.div 
        className="absolute w-40 h-40 rounded-full bg-unicorn-pink/20 blur-3xl"
        animate={{
          x: mousePosition.x * -2,
          y: mousePosition.y * -2,
        }}
        transition={{ type: "spring", damping: 15 }}
      />
      
      <motion.div 
        className="absolute right-1/4 top-1/3 w-60 h-60 rounded-full bg-unicorn-purple/30 blur-3xl"
        animate={{
          x: mousePosition.x * 1.5,
          y: mousePosition.y * 1.5,
        }}
        transition={{ type: "spring", damping: 10 }}
      />
      
      <motion.div 
        className="absolute left-1/4 bottom-1/3 w-40 h-40 rounded-full bg-unicorn-skyBlue/20 blur-3xl"
        animate={{
          x: mousePosition.x * 1,
          y: mousePosition.y * 1,
        }}
        transition={{ type: "spring", damping: 20 }}
      />
    </>
  );
};

export default FloatingOrbs;
