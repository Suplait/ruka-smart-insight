
import { useState, useEffect } from "react";

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
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // If in static mode, just return the static text
  if (staticMode) {
    return <span>{staticText}</span>;
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const current = messages[currentMessage];
    
    if (isDeleting) {
      if (displayText === "") {
        setIsDeleting(false);
        setCurrentMessage((prev) => (prev + 1) % messages.length);
      } else {
        timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        }, 30);
      }
    } else {
      if (displayText === current) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      } else {
        timeout = setTimeout(() => {
          setDisplayText(current.substring(0, displayText.length + 1));
        }, 30);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentMessage, displayText, isDeleting, messages]);

  return <span>{displayText}</span>;
}
