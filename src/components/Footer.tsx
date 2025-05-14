
import { ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-unicorn-purpleLight/20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center mb-6">
            <span className="text-unicorn-purple text-2xl mr-2">🦄</span>
            <span className="text-2xl font-bold unicorn-text-gradient">Unicorn Editor</span>
          </div>
          
          <p className="text-gray-600 max-w-md mb-8">
            The best screenshot editor in the magical realm. 
            By unicorns, for unicorns.
          </p>
          
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-unicorn-purple/30 to-transparent mb-8"></div>
          
          <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center mb-8">
            <a 
              href="https://discord.gg/omakase" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-unicorn-purple transition-colors"
            >
              Discord
            </a>
            <a 
              href="https://github.com/jarrensj" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-unicorn-purple transition-colors"
            >
              GitHub
            </a>
            <a 
              href="https://kwaji.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-unicorn-purple transition-colors"
            >
              Contact
            </a>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>Built by </span>
            <a 
              href="https://kwaji.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center ml-1 text-unicorn-purple hover:text-unicorn-purpleDark transition-colors"
            >
              kwaji
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
          
          <p className="text-sm text-gray-500">
            Unicorn Editor. No humans allowed.
          </p>
          
          <div className="mt-4 text-xs text-gray-400">
            <p>Powered by unicorn magic. Website may not display properly for non-magical beings.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
