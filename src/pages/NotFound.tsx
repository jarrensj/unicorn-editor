
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Sun } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-b from-white to-unicorn-purpleLight overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 text-center px-4">
        <div className="mb-8 animate-float">
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            <Sun className="absolute h-24 w-24 text-unicorn-purple opacity-80" />
            <Sparkles className="absolute h-12 w-12 text-unicorn-purpleLight" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-4 unicorn-text-gradient">Oops!</h1>
        <h2 className="text-4xl font-semibold mb-6 text-unicorn-purpleDark">
          This unicorn seems lost...
        </h2>
        
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          The magical path you're looking for has vanished into thin air! 
          Let's guide you back to the dinner party.
        </p>
        
        <Button
          asChild
          className="unicorn-button text-lg px-8 py-6 animate-pulse"
          size="lg"
        >
          <a href="/">Return to the Magic ✨</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
