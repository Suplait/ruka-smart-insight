
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ValueMessageTypewriterProps {
  messages: string[];
  staticMode?: boolean;
  staticText?: string;
}

export default function ValueMessageTypewriter({
  messages,
  staticMode = false,
  staticText = ""
}: ValueMessageTypewriterProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (staticMode) return;
    
    const interval = setInterval(() => {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        setIsTyping(false);
      }, 200);
    }, 5000);

    return () => clearInterval(interval);
  }, [messages, staticMode]);

  useEffect(() => {
    if (staticMode) return;
    setCurrentMessage(messages[currentIndex]);
  }, [currentIndex, messages, staticMode]);

  if (staticMode && staticText) {
    return <span>{staticText}</span>;
  }

  return (
    <AnimatePresence mode="wait">
      {isTyping ? (
        <motion.span
          key="typing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <span className="inline-block w-8 h-5 bg-primary/20 rounded animate-pulse"></span>
        </motion.span>
      ) : (
        <motion.span
          key={currentMessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {currentMessage}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
