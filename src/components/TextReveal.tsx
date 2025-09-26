import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export default function TextReveal({ children, className = "", delay = 0 }: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const words = children.split(" ");
  
  return (
    <span ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ 
            opacity: 0, 
            y: 50,
            rotateX: -90
          }}
          animate={isInView ? { 
            opacity: 1, 
            y: 0,
            rotateX: 0
          } : {
            opacity: 0, 
            y: 50,
            rotateX: -90
          }}
          transition={{
            duration: 0.8,
            delay: delay + index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "spring",
            stiffness: 100
          }}
          className="inline-block mr-2"
          style={{ transformOrigin: "bottom" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}