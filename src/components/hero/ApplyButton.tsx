
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const ApplyButton = () => {
  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          className="unicorn-button px-8 py-6 text-lg rounded-full shadow-lg sparkle-cursor flex items-center gap-2"
          asChild
        >
          <a 
            href="https://github.com/jarrensj" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Github className="h-5 w-5" />
            GitHub
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-full rounded-full bg-white/10"
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{
                    scale: [0, 2],
                    opacity: [0.8, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          </a>
        </Button>
      </motion.div>
      <div className="absolute -right-4 -top-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{
            duration: 8, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-12 h-12 rounded-full border-4 border-dashed border-unicorn-purple opacity-70"
        />
      </div>
    </div>
  );
};

export default ApplyButton;
