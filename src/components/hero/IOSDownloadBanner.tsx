
import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";

const IOSDownloadBanner = () => {
  return (
    <motion.div
      className="relative z-10 mt-4 mb-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-sm border border-white/50 text-sm text-gray-600">
        <Smartphone className="w-4 h-4 text-gray-500" />
        <span>
          Download the iOS app
        </span>
        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold">
          Coming Soon
        </span>
      </div>
    </motion.div>
  );
};

export default IOSDownloadBanner;
