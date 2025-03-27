
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Brain, Clock, LineChart } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: "24/7 Autonomous Agents",
    description: "Automate repetitive tasks while reducing operating costs and human errors"
  },
  {
    icon: Brain,
    title: "AI that Learns from Your Business",
    description: "Our agents adapt to your processes to deliver more accurate insights every day"
  },
  {
    icon: Clock,
    title: "Instant Information",
    description: "Access your data in real time to make informed decisions when you need them"
  },
  {
    icon: LineChart,
    title: "Total Control",
    description: "Visualize and optimize your operating margin with up-to-date data and detailed reports"
  }
];

export default function FeatureRotator() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Get the current icon component
  const CurrentIcon = features[currentIndex].icon;

  return (
    <div className="relative h-[120px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center"
        >
          <div className="flex items-start gap-4">
            <CurrentIcon className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">{features[currentIndex].title}</h3>
              <p className="text-sm text-slate-600">{features[currentIndex].description}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute bottom-0 left-0 flex gap-1">
        {features.map((_, index) => (
          <div 
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-primary w-3" : "bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
