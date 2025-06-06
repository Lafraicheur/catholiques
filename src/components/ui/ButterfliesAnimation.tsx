// Composant d'animation de papillons amélioré - Plus visible
// components/animations/ButterfliesAnimation.jsx

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Butterfly = {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  scale: number;
  color: string;
};

const ButterfliesAnimation = () => {
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);

  useEffect(() => {
    // Couleurs vives pour les papillons
    const colors = [
      "#FF6B6B", // Rouge corail
      "#4ECDC4", // Turquoise
      "#45B7D1", // Bleu ciel
      "#96CEB4", // Vert menthe
      "#FFEAA7", // Jaune doux
      "#DDA0DD", // Violet clair
      "#FFB347", // Orange pêche
    ];

    const generateButterflies = () => {
      const newButterflies = [];
      for (let i = 0; i < 8; i++) { // Plus de papillons
        newButterflies.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 6 + Math.random() * 4,
          scale: 1 + Math.random() * 0.8, // Plus grands
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setButterflies(newButterflies);
    };

    generateButterflies();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {butterflies.map((butterfly) => (
        <motion.div
          key={butterfly.id}
          className="absolute opacity-70" // Plus opaque
          initial={{
            x: `${butterfly.x}vw`,
            y: `${butterfly.y}vh`,
            scale: butterfly.scale,
          }}
          animate={{
            x: [`${butterfly.x}vw`, `${(butterfly.x + 30) % 100}vw`, `${butterfly.x}vw`],
            y: [`${butterfly.y}vh`, `${(butterfly.y + 20) % 100}vh`, `${butterfly.y}vh`],
            rotate: [0, 15, -15, 0],
            scale: [butterfly.scale, butterfly.scale * 1.2, butterfly.scale],
          }}
          transition={{
            duration: butterfly.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: butterfly.delay,
          }}
        >
          {/* SVG du papillon coloré et plus détaillé */}
          <svg
            width="32" // Plus grand
            height="32"
            viewBox="0 0 32 32"
            className="drop-shadow-sm"
          >
            {/* Corps du papillon */}
            <ellipse
              cx="16"
              cy="16"
              rx="1"
              ry="8"
              fill="#4A4A4A"
            />
            
            {/* Ailes supérieures */}
            <ellipse
              cx="12"
              cy="10"
              rx="6"
              ry="4"
              fill={butterfly.color}
              opacity="0.8"
              transform="rotate(-20 12 10)"
            />
            <ellipse
              cx="20"
              cy="10"
              rx="6"
              ry="4"
              fill={butterfly.color}
              opacity="0.8"
              transform="rotate(20 20 10)"
            />
            
            {/* Ailes inférieures */}
            <ellipse
              cx="12"
              cy="20"
              rx="4"
              ry="3"
              fill={butterfly.color}
              opacity="0.6"
              transform="rotate(-30 12 20)"
            />
            <ellipse
              cx="20"
              cy="20"
              rx="4"
              ry="3"
              fill={butterfly.color}
              opacity="0.6"
              transform="rotate(30 20 20)"
            />
            
            {/* Motifs sur les ailes */}
            <circle cx="12" cy="10" r="2" fill="white" opacity="0.7" />
            <circle cx="20" cy="10" r="2" fill="white" opacity="0.7" />
            <circle cx="12" cy="20" r="1.5" fill="white" opacity="0.5" />
            <circle cx="20" cy="20" r="1.5" fill="white" opacity="0.5" />
            
            {/* Antennes */}
            <line x1="14" y1="8" x2="12" y2="6" stroke="#4A4A4A" strokeWidth="1" />
            <line x1="18" y1="8" x2="20" y2="6" stroke="#4A4A4A" strokeWidth="1" />
            <circle cx="12" cy="6" r="0.5" fill="#4A4A4A" />
            <circle cx="20" cy="6" r="0.5" fill="#4A4A4A" />
          </svg>
          
          {/* Effet de scintillement */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              opacity: [0, 0.3, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: butterfly.delay + 1,
            }}
            style={{
              background: `radial-gradient(circle, ${butterfly.color}20 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ButterfliesAnimation;