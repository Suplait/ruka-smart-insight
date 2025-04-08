
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ValueMessageTypewriterProps {
  messages: string[];
  staticMode?: boolean;
  staticText?: string;
}

export default function ValueMessageTypewriter({
  messages,
  staticMode = false,
  staticText
}: ValueMessageTypewriterProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (staticMode && staticText) {
      setDisplayedText(staticText);
      setShowCursor(false);
      return;
    }

    let timer: NodeJS.Timeout;
    const currentMessage = messages[currentMessageIndex];
    
    if (isDeleting) {
      if (displayedText === "") {
        setIsDeleting(false);
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
      } else {
        timer = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 30);
      }
    } else {
      if (displayedText === currentMessage) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      } else {
        timer = setTimeout(() => {
          setDisplayedText(currentMessage.slice(0, displayedText.length + 1));
        }, 70);
      }
    }
    
    return () => clearTimeout(timer);
  }, [displayedText, currentMessageIndex, isDeleting, messages, staticMode, staticText]);

  useEffect(() => {
    if (staticMode) return;
    
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    
    return () => clearInterval(cursorTimer);
  }, [staticMode]);

  return (
    <div className="inline">
      <AnimatePresence mode="wait">
        <motion.span
          key={displayedText}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {displayedText}
          {showCursor && !staticMode && (
            <span className="animate-pulse">|</span>
          )}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
