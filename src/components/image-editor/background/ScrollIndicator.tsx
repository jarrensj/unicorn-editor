
import { ChevronDown } from "lucide-react";

type ScrollIndicatorProps = {
  visible: boolean;
};

const ScrollIndicator = ({ visible }: ScrollIndicatorProps) => {
  if (!visible) return null;
  
  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2 pointer-events-none">
      <div className="animate-bounce bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md">
        <ChevronDown className="h-5 w-5 text-unicorn-purple" />
      </div>
    </div>
  );
};

export default ScrollIndicator;
